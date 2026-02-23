import { parse, z } from 'zod'
import { DocumentPathToPathname, PathnameToDocumentPath, PopCon, PopConOptions, ToEpochSeconds } from '@cougargrades/models'
import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish';
import { env } from 'cloudflare:workers'
import { Temporal } from 'temporal-polyfill';
import { getFirestoreDocumentSafe } from './firestore-config'

const EPOCH_START = Temporal.Instant.fromEpochMilliseconds(0).toZonedDateTimeISO(Temporal.Now.timeZoneId());

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
  const res = await sql`INSERT INTO PopularityContest (pathname, metric_type) VALUES (${validatedPathname}, ${options.type})`;
}

export async function getPopConTopPages({ metric, limit, offset, timeRange, topic, exclude }: PopConOptions) {
  //if (!env.COUGARGRADES_SQL) return null;

  const qTimeRange: [Temporal.ZonedDateTime, Temporal.ZonedDateTime] = timeRange ?? [EPOCH_START, Temporal.Now.zonedDateTimeISO()]
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
      RANK() OVER (ORDER BY metric_count DESC) as rank,
      pathname,
      metric_count
    FROM (
      SELECT
        pathname,
        COUNT(*) AS metric_count
      FROM
        PopularityContest
      WHERE
        metric_type = ${metric}
        AND timestamp_epoch_seconds >= ${ToEpochSeconds(qTimeRange[0])}
        AND timestamp_epoch_seconds <= ${ToEpochSeconds(qTimeRange[1])}
        AND pathname LIKE ${pathname_LIKE}
        AND pathname NOT IN (${qExclude})
      GROUP BY
        pathname
    )
    ORDER BY
      metric_count DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  
  const row_schema = z.object({
    pathname: z.string(),
    metric_count: z.number().int(),
    rank: z.number().int()
  })

  // We want a failed parse to throw an error
  const parsed = row_schema.array().parse(res?.results);
  return parsed;
}

// TODO: get rank of course or instructor by view count
