import { describe, expect, it } from 'vitest'
import { Temporal } from 'temporal-polyfill'
import fs from 'node:fs/promises'
import path from 'node:path'

import { runReport } from './analytics-config'
import { isNullish } from '@cougargrades/utils/nullish'

//const startDate = Temporal.Now.plainDateISO().subtract({ months: 48 })
//const startDate = Temporal.PlainDate.from('2021-12-11');// 2025-04-01
const startDate = Temporal.PlainDate.from('2025-04-01');
//const endDate = Temporal.Now.plainDateISO();
const endDate = Temporal.PlainDate.from('2026-02-22');
const hours24 = Temporal.Duration.from({ hours: 24 })

function isABeforeB(a: Temporal.PlainDate, b: Temporal.PlainDate) {
  return Temporal.PlainDate.compare(a, b) <  0;
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath)
    return true;
  }
  catch {
    return false;
  }
}

type ReportResponse = Awaited<ReturnType<typeof runReport>>

const OUTPUT_FILE_PATH = path.join(import.meta.dirname, '../../api/data', 'ga4_scrape.csv');

describe('blog', () => {
  it('hello', async () => {
    if (!(await exists(OUTPUT_FILE_PATH))) {
      await fs.appendFile(OUTPUT_FILE_PATH, `timestamp_epoch_seconds,page_path\n`)
    }

    let currentDate = startDate;
    do {
      console.log(`--- ${currentDate} ---`);
      const report = await runReport(currentDate);
      console.log('original report contains: ', report.rowCount, 'rows');
      const rows = ProcessReport(report);
      console.log('processed: ', rows.length, 'rows');

      for(let row of rows) {
        await fs.appendFile(OUTPUT_FILE_PATH, `${row.timestamp_epoch_seconds},"${row.page_path}"\n`);
      }

      // iterate
      currentDate = currentDate.add(hours24);
    }
    while(isABeforeB(currentDate, endDate));
  })
});

interface CsvRow {
  timestamp_epoch_seconds: number;
  page_path: string;
}

function ProcessReport(report: ReportResponse): CsvRow[] {
  let results: CsvRow[] = [];
  for(let row of report.rows ?? []) {
    const n = parseInt(row.metricValues?.[0].value ?? '0');
    // `/post/hello`
    const page_path = row.dimensionValues?.[0].value;
    if (isNullish(page_path)) continue;
    // YYYYMMDDHHMM
    const dateHourMinute = row.dimensionValues?.[1].value;
    if (isNullish(dateHourMinute)) continue;
    
    const plainDate = YYYYMMDDHHMM2PlainDateTime(dateHourMinute);
    const timestamp_epoch_seconds = Math.round(plainDate.toZonedDateTime('Etc/UTC').epochMilliseconds / 1000)

    for(let i = 0; i < n; i++) {
      results.push({
        page_path,
        timestamp_epoch_seconds,
      });
    }
  }
  return results;
}

function YYYYMMDDHHMM2PlainDateTime(dateHourMinute: string): Temporal.PlainDateTime {
  const YYYY = dateHourMinute.substring(0, 4)
  const MM = dateHourMinute.substring(4, 6)
  const DD = dateHourMinute.substring(6, 8)
  const HH = dateHourMinute.substring(8, 10)
  const mm = dateHourMinute.substring(10, 12)


  return Temporal.PlainDateTime.from(`${YYYY}-${MM}-${DD}T${HH}:${mm}:00`)
}


