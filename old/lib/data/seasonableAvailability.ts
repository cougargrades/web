import { Section, SparklineData } from '@cougargrades/types'
import { formatSeasonCode, getTotalEnrolled, getYear, seasonCode, SeasonCode, sum } from '@/lib/util'

export interface SeasonalAvailability {
  measured: Record<SeasonCode, number>;
  ratioSorted: Record<SeasonCode, number>;
  //formatted: string;
}

export function getSeasonalAvailability(sections: Section[]): SeasonalAvailability {
  let measured: Record<SeasonCode, number> = {
    '01': 0,
    '02': 0,
    '03': 0,
  };
  const seen = new Set<string>();
  for (let sec of sections) {
    const seenKey = `${sec.term}_${sec.sectionNumber}`;
    if (seen.has(seenKey)) {
      continue;
    }
    seen.add(seenKey);
    const season = seasonCode(sec.term);
    const enrolled = getTotalEnrolled(sec);
    measured[season] += enrolled;
  }
  // Get the total enrolled
  const totalEnrolled = sum(Object.values(measured));
  // Sort the entries in descending order
  const sortedEntries = Object.entries(measured).sort(([aKey, aValue], [bKey, bValue]) => bValue - aValue);
  // Create a new object (JavaScript sorts keys in the order they're created)
  let ratioSorted: Record<string, number> = {};
  for (let [k, v] of sortedEntries) {
    ratioSorted[k] = v / totalEnrolled;
  }

  return {
    measured,
    ratioSorted,
  }
}

// Group by calendar

export type SparklineDataWithKey<T> = Omit<SparklineData, 'data'> & {
  key: T,
  data: (number | null)[],
}

export function groupSparklineDataByCalendarYear(sparklineData: SparklineData): SparklineDataWithKey<SeasonCode>[] {
  // Some checks
  if (sparklineData.data.length !== sparklineData.xAxis.length)
    throw new Error("Sparkline X and Y axis aren't the same length. Uh.... What happened?");

  /**
   * Get all the years this sparkline covers (this will be the X-Axis)
   * JS specification requires that set be iterable in insertion order
   */
  const allYears = new Set<number>();
  for(let termCode of sparklineData.xAxis) {
    allYears.add(getYear(termCode))
  }

  /**
   * This will be the Y-Axis where the index is the year
   */
  let dataBySeason: Record<SeasonCode, (number | null)[]> = {
    '01': [],
    '02': [],
    '03': [],
  };

  // Loop over all years (this makes it easier to set handle years we don't have all 3 semesters for)
  for(let year of allYears) {
    // Iterate over all seasons
    for(let member in SeasonCode.enum) {
      const season: SeasonCode = member as SeasonCode;
      const termCode = parseInt(`${year}${season}`);

      // Get the index that data for this term may be found
      const dataIndex = sparklineData.xAxis.findIndex(tc => tc === termCode);
      // Get the data for this term, or null if we don't have data for that term
      const dataValue = dataIndex >= 0 ? sparklineData.data[dataIndex] : null;

      // Store the data
      dataBySeason[season].push(dataValue);
    }
  }

  // Create result
  return Object.entries(dataBySeason).map<SparklineDataWithKey<SeasonCode>>(([season, data]) => ({
    key: season as SeasonCode,
    data: data,
    xAxis: Array.from(allYears),
    yAxis: {
      min: sparklineData.yAxis.min,
      max: sparklineData.yAxis.max,
      avg: sparklineData.yAxis.avg,
      stddev: sparklineData.yAxis.stddev,
      median: sparklineData.yAxis.median,
    }
  }))
}
