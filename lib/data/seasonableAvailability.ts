import { Section } from '@cougargrades/types'
import { formatSeasonCode, getTotalEnrolled, seasonCode, SeasonCode, sum } from '@/lib/util'

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
    for(let sec of sections) {
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
    for(let [k, v] of sortedEntries) {
        ratioSorted[k] = v / totalEnrolled;
    }

    // Format the string
    // const formatted = Object.entries(ratioSorted).map(([seasonCode, ratio]) => {
    //     const season = formatSeasonCode(seasonCode as SeasonCode);

    // });
    // Object.entries(data!.seasonalAvailability.ratioSorted).map(([seasonCode, ratio]) => {
                
    //           })

    return {
        measured,
        ratioSorted,
    }
}
