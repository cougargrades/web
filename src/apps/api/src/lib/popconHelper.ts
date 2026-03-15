import { parse, z } from 'zod'
import { BinnedSparklineData, DocumentPathToPathname, PathnameToDocumentPath, PopCon, PopConOptions, } from '@cougargrades/models'
import { RankingResult } from '@cougargrades/models/dto'
import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish';
import { EpochSecondsToDate, EpochSecondsToTemporal, GetNowDateEpochSeconds, IsABeforeB, ToEpochSeconds, UTC_TIMEZONE_ID } from "@cougargrades/utils/temporal"
import { env } from 'cloudflare:workers'
import { Temporal } from 'temporal-polyfill';
import { getFirestoreDocumentSafe } from './firestore-config'

const EPOCH_START = Temporal.Instant.fromEpochMilliseconds(0).toZonedDateTimeISO(UTC_TIMEZONE_ID);

/**
 * The earliest date we have analytics available, based on the Google Analytics import.
 */
const COUGAR_GRADES_EARLIEST_ANALYTICS_DATE = Temporal.Instant.fromEpochMilliseconds(1643846400 * 1000).toZonedDateTimeISO(UTC_TIMEZONE_ID);

/**
 * Allows using D1 SQLite with sql`` template literals safely
 * @param strings 
 * @param values 
 * @returns 
 */
export async function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!env.COUGARGRADES_SQL) return null;

  let raw = '';
  let boundValues: unknown[] = [];
  strings.forEach((str, i) => {
    raw += str;
    // If an array is provided as a value, then treat it as multiple variables separated by commas
    if (Array.isArray(values[i])) {
      const question_marks = Array.from(Array(values[i].length))
        .map(() => '?')
        .join(',');
      raw += question_marks;
      boundValues.push(...values[i]);
    }
    // Otherwise, just bind it like normal
    else if (values[i] !== undefined && values[i] !== null) {
      raw += '?';
      boundValues.push(values[i]);
    }
  });

  //const raw = strings.join('?');
  const statement = env.COUGARGRADES_SQL
    .prepare(raw)
    //.bind(...values)
    .bind(...boundValues);
  return await statement.run();
}

export async function recordPopCon(options: Pick<PopCon, 'pathname' | 'type'>) {
  // Verify that pathname matches the pattern we're looking for,
  // and map it to a documentPath
  const documentPath = PathnameToDocumentPath(options.pathname);
  if (isNullish(documentPath)) return;

  // Check that firestore document exists at that path
  const doc = await getFirestoreDocumentSafe(documentPath, z.object({
    _path: z.string(),
  }));
  if (!doc.success) return;

  /**
   * Based on the "_path" propert from the Firestore doc, compute the "pathname"
   * 
   * By "round-tripping" this, we standardize the capitalization and ensure that only valid PopCons are created.
   */
  const validatedPathname = DocumentPathToPathname(doc.data._path);
  if (isNullish(validatedPathname)) return;

  // This is safe to add to the PopCon records
  const res = await sql`
  INSERT INTO PopularityContest (
    pathname,
    date_epoch_seconds,
    metric_type,
    metric_count
  )
  VALUES (
    ${validatedPathname},
    strftime('%s','now','start of day'),
    ${options.type},
    1
  )
  ON CONFLICT(pathname, date_epoch_seconds, metric_type)
  DO UPDATE SET
    metric_count = metric_count + 1;
  `;
}

export type PopConTopResult = z.infer<typeof PopConTopResult>
export const PopConTopResult = z.object({
  pathname: z.string(),
  metric_count_sum: z.number().int(),
  //rank: z.number().int()
})

/**
 * Gets the ordered list of top pages that follow the PopConOptions
 * @param options PopConOptions
 * @returns 
 */
export async function getPopConTopPages({ metric, limit, offset, timeRange, topic, exclude }: PopConOptions): Promise<PopConTopResult[]> {
  //if (!env.COUGARGRADES_SQL) return null;

  const qTimeRange: [Temporal.ZonedDateTime, Temporal.ZonedDateTime] = timeRange ?? [EPOCH_START, Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID)]
  const qExclude = exclude ?? [];

  const pathname_LIKE = (
    topic === 'course'
    ? '/c/%'
    : (
      topic === 'instructor'
      ? '/i/%'
      : '%'
    )
  );

  const res = await sql`
    SELECT
      pathname,
      SUM(metric_count) as metric_count_sum
    FROM
      PopularityContest
    WHERE
      date_epoch_seconds BETWEEN ${ToEpochSeconds(qTimeRange[0])} AND ${ToEpochSeconds(qTimeRange[1])}
      AND metric_type = ${metric}
      AND pathname LIKE ${pathname_LIKE}
      AND pathname NOT IN (${qExclude})
    GROUP BY
      pathname
    ORDER BY
      metric_count_sum DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  
  // We want a failed parse to throw an error
  const parsed = PopConTopResult.array().parse(res?.results);
  return parsed;
}

/**
 * Wrapper around `getPopConTopPages(...)` to support streaming
 * @param param0 
 */
export async function* streamPopConTopPages({ metric, timeRange, topic, offset: initialOffset, exclude, chunkSize }: Omit<PopConOptions, 'limit'> & { chunkSize: number }) {
  let offset = initialOffset;
  let snap: PopConTopResult[];
  do {
    snap = await getPopConTopPages({
      metric,
      timeRange,
      topic,
      exclude,
      limit: chunkSize,
      offset: offset,
    });
    for(let row of snap) {
      yield row;
    }
    offset += chunkSize;
  }
  while(snap.length > 0);
}

/**
 * Looks up the rank of an individual page (via `pathname`) that follows PopConOptions.
 * This should give the same result as the position in `getPopConTopPages()`
 * 
 * This uses the SQLite `RANK()` function. 
 * 
 * A comparison:
 * - RANK() => Ties share rank, gaps appear (1,2,2,4)
 * - DENSE_RANK() => Ties share rank, no gaps (1,2,2,3)
 * - ROW_NUMBER() => No ties, strictly sequential
 * 
 * @param options PopConOptions
 * @returns 
 */
export async function getRankForPathname(pathname: string, { metric, timeRange, topic, exclude }: Omit<PopConOptions, 'limit' | 'offset'>): Promise<RankingResult | null> {
  const qTimeRange: [Temporal.ZonedDateTime, Temporal.ZonedDateTime] = timeRange ?? [EPOCH_START, Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID)]
  const qExclude = exclude ?? [];

  const pathname_LIKE = (
    topic === 'course'
    ? '/c/%'
    : (
      topic === 'instructor'
      ? '/i/%'
      : '%'
    )
  );

  const res = await sql`
    WITH totals AS (
      SELECT
        pathname,
        SUM(metric_count) AS total
      FROM
        PopularityContest
      WHERE
        metric_type = ${metric}
        AND date_epoch_seconds BETWEEN ${ToEpochSeconds(qTimeRange[0])} AND ${ToEpochSeconds(qTimeRange[1])}
        AND pathname LIKE ${pathname_LIKE}
        AND pathname NOT IN (${qExclude})
      GROUP BY
        pathname
    ),
    target AS (
      SELECT total FROM totals WHERE pathname = ${pathname}
    )
    SELECT
      (SELECT COUNT(*) FROM totals WHERE total > target.total) + 1 AS rank,
      target.total AS score
    FROM
      target;
  `;
  
  // We want a failed parse to throw an error
  const parsed = RankingResult.array().parse(res?.results);
  return parsed.at(0) ?? null;
}

/**
 * Looks up the rank of an individual page (via `pathname`) that follows PopConOptions.
 * This should give the same result as the position in `getPopConTopPages()`
 * 
 * This uses the SQLite `RANK()` function. 
 * 
 * A comparison:
 * - RANK() => Ties share rank, gaps appear (1,2,2,4)
 * - DENSE_RANK() => Ties share rank, no gaps (1,2,2,3)
 * - ROW_NUMBER() => No ties, strictly sequential
 * 
 * @param options PopConOptions
 * @returns 
 */
export async function getSparklineForPathname(pathname: string, binSize: Temporal.Duration, { metric, timeRange, topic }: Pick<PopConOptions, 'metric' | 'timeRange' | 'topic'>): Promise<BinnedSparklineData> {
  
  if (!!timeRange) {
    // Overwrite the time range with the earliest available, if it's before. (it affects the binning)
    if (IsABeforeB(timeRange[0], COUGAR_GRADES_EARLIEST_ANALYTICS_DATE)) {
      timeRange[0] = COUGAR_GRADES_EARLIEST_ANALYTICS_DATE;
    }
    // If the timeRange goes after the present time, reset it to the current time. (it affects binning)
    if (IsABeforeB(GetNowDateEpochSeconds(), timeRange[1])) {
      timeRange[1] = GetNowDateEpochSeconds();
    }
  }
  const qTimeRange: [Temporal.ZonedDateTime, Temporal.ZonedDateTime] = timeRange ?? [COUGAR_GRADES_EARLIEST_ANALYTICS_DATE, Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID)]

  // const pathname_LIKE = (
  //   topic === 'course'
  //   ? '/c/%'
  //   : (
  //     topic === 'instructor'
  //     ? '/i/%'
  //     : '%'
  //   )
  // );

  const binSizeSeconds = Math.floor(Math.abs(binSize.total({ unit: 'seconds', relativeTo: Temporal.Now.zonedDateTimeISO() })));

  /**
   * These are all the bins, not just what the SQL has.
   * An entry in here should be IDENTICAL, to what is found in the SQL side.
   */
  const bins = Array.from(
    GenerateBins(ToEpochSeconds(qTimeRange[0]), ToEpochSeconds(qTimeRange[1]), binSizeSeconds)
  ).slice(0, -1);

  /**
   * Get the max Y-value given:
   * - Same metric
   * - Same time range
   * - Same topic (course vs instructor)
   * 
   * This is needed to appropriately set the Y-axis between charts for different courses/instructors
   */
  // Wrong query
  // const yAxisMaxValue = z.number().int().parse(
  //   (await sql`
  //     SELECT MAX(sub_binned.metric_sum) AS max_metric_count
  //     FROM (
  //       SELECT
  //         (date_epoch_seconds - CAST(${ToEpochSeconds(qTimeRange[0])} AS INTEGER)) / CAST(${binSizeSeconds} AS INTEGER) AS bin_index,
  //         CAST(${ToEpochSeconds(qTimeRange[0])} AS INTEGER) + (
  //         ((date_epoch_seconds - CAST(${ToEpochSeconds(qTimeRange[0])} AS INTEGER)) / CAST(${binSizeSeconds} AS INTEGER))
  //         * CAST(${binSizeSeconds} AS INTEGER)
  //         ) AS bin_start,
  //         SUM(metric_count)       AS metric_sum
  //       FROM PopularityContest
  //       WHERE
  //         date_epoch_seconds BETWEEN ${ToEpochSeconds(qTimeRange[0])} AND ${ToEpochSeconds(qTimeRange[1])}
  //         AND pathname LIKE ${pathname_LIKE}
  //         AND metric_type = ${metric}
  //       GROUP BY
  //         bin_index
  //       ORDER BY
  //         bin_index
  //     ) AS sub_binned;
  //   `)?.results.at(0)?.['max_metric_count']
  // );

  /**
   * Generate the chart given:
   * - Specified metric
   * - Specified time range
   * - Specified pathname exact match
   */

  const res = await sql`
    SELECT
      (date_epoch_seconds - CAST(${ToEpochSeconds(qTimeRange[0])} AS INTEGER)) / CAST(${binSizeSeconds} AS INTEGER) AS bin_index,
      CAST(${ToEpochSeconds(qTimeRange[0])} AS INTEGER) + (
      ((date_epoch_seconds - CAST(${ToEpochSeconds(qTimeRange[0])} AS INTEGER)) / CAST(${binSizeSeconds} AS INTEGER))
      * CAST(${binSizeSeconds} AS INTEGER)
      ) AS bin_start,
      SUM(metric_count)       AS metric_sum
    FROM PopularityContest
    WHERE
      date_epoch_seconds BETWEEN ${ToEpochSeconds(qTimeRange[0])} AND ${ToEpochSeconds(qTimeRange[1])}
      AND pathname           = ${pathname}
      AND metric_type        = ${metric}
    GROUP BY
      bin_index
    ORDER BY
      bin_index;
  `;

  const rowSchema = z.object({
    bin_index: z.number(),
    bin_start: z.number(),
    metric_sum: z.number(),
  })

  // We want a failed parse to throw an error
  const rows = rowSchema.array().parse(res?.results);

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const result: BinnedSparklineData = {
    // data: rows.map(r => r.metric_sum),
    // xAxis: rows.map(r => {
    //   const start = EpochSecondsToDate(r.bin_start);
    //   const end = EpochSecondsToDate(r.bin_start + binSizeSeconds);
    //   return formatter.formatRange(start, end);
    // }),
    data: bins.map(b =>
      rows.find(r => r.bin_start === b)?.metric_sum ?? 0
    ),
    xAxis: bins.map(bin => {
      const start = EpochSecondsToDate(bin);
      const end = EpochSecondsToDate(bin + binSizeSeconds);
      return formatter.formatRange(start, end);
    }),
    yAxis: {
      min: 0,
      //max: yAxisMaxValue,
      max: -1
    }
  };

  return result;
}

export function *GenerateBins(start: number, end: number, binSize: number) {
  yield start;
  let cursor = start;
  do {
    cursor += binSize;
    yield cursor;
  }
  while (cursor < end);
}
