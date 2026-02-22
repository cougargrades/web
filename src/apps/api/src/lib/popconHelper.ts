import { parse, z } from 'zod'
import { PopCon, PopConOptions, ToEpochSeconds } from '@cougargrades/models'
import { isNullish } from '@cougargrades/utils/nullish';
import { env } from 'cloudflare:workers'
import { Temporal } from 'temporal-polyfill';

const EPOCH_START = Temporal.Instant.fromEpochMilliseconds(0).toZonedDateTimeISO(Temporal.Now.timeZoneId());

/**
 * Allows using D1 SQLite with sql`` template literals safely
 * @param strings 
 * @param values 
 * @returns 
 */
export async function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!env.COUGARGRADES_SQL) return null;
  const raw = strings.join('?');
  const statement = env.COUGARGRADES_SQL
    .prepare(raw)
    .bind(...values);
  return await statement.run();
}

export async function recordPopCon(options: Pick<PopCon, 'pathname' | 'type'>) {
  // Must be a valid prefix
  if (['/c/', '/i/', '/g/'].some(prefix => options.pathname.startsWith(prefix)) === false) {
    return;
  }
  const res = await sql`INSERT INTO PopularityContest (pathname, metric_type) VALUES (${options.pathname}, ${options.type})`;
}

export async function getPopConTopPages({ metric, limit, offset, timeRange, topic }: PopConOptions) {
  //if (!env.COUGARGRADES_SQL) return null;

  // TODO: use to hide core
  // --AND pathname IN ('/c/COSC%201430')

  const qTimeRange: [Temporal.ZonedDateTime, Temporal.ZonedDateTime] = timeRange ?? [EPOCH_START, Temporal.Now.zonedDateTimeISO()]

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
        AND pathname LIKE ${topic === 'course' ? '/c/%' : '/i/%'}
      GROUP BY
        pathname
    )
    ORDER BY
      metric_count DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  if (isNullish(res)) return null;
  if (isNullish(res.results)) return null;
  
  const row_schema = z.object({
    pathname: z.string(),
    metric_count: z.number().int(),
    rank: z.number().int()
  })

  const parsed = row_schema.array().safeParse(res.results);
  if (parsed.success) return parsed.data;
  return null;
}

// TODO: get rank of course or instructor by view count
