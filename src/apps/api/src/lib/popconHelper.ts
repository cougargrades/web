import { parse, z } from 'zod'
import { DocumentPathToPathname, PathnameToDocumentPath, PopCon, PopConOptions, ToEpochSeconds } from '@cougargrades/models'
import { RankingResult } from '@cougargrades/models/dto'
import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish';
import { UTC_TIMEZONE_ID } from "@cougargrades/utils/temporal"
import { env } from 'cloudflare:workers'
import { Temporal } from 'temporal-polyfill';
import { getFirestoreDocumentSafe } from './firestore-config'

const EPOCH_START = Temporal.Instant.fromEpochMilliseconds(0).toZonedDateTimeISO(UTC_TIMEZONE_ID);

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
      metric_count_sum
    FROM (
      SELECT
        pathname,
        SUM(metric_count) as metric_count_sum
      FROM
        PopularityContest
      WHERE
        metric_type = ${metric}
        AND date_epoch_seconds >= ${ToEpochSeconds(qTimeRange[0])}
        AND date_epoch_seconds <= ${ToEpochSeconds(qTimeRange[1])}
        AND pathname LIKE ${pathname_LIKE}
        AND pathname NOT IN (${qExclude})
      GROUP BY
        pathname
    )
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
export async function* streamPopConTopPages({ metric, timeRange, topic, exclude, chunkSize }: Omit<PopConOptions, 'limit' | 'offset'> & { chunkSize: number }) {
  let offset = 0;
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
        AND date_epoch_seconds >= ${ToEpochSeconds(qTimeRange[0])}
        AND date_epoch_seconds <= ${ToEpochSeconds(qTimeRange[1])}
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
