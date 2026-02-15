import useSWR from 'swr/immutable'
import { Observable, ObservableStatus } from './Observable'
import { formatTermCode, getYear, SeasonCode, seasonCode } from '../util'
import type { LatestTermResult } from '../../pages/api/latest_term'
import mailtoLink from 'mailto-link'

export type LatestTermResultExtra = LatestTermResult & {
  latestTermFormatted: string | null;
}

/**
 * React hook for accessing the course data client-side
 * @param courseName 
 * @returns 
 */
export function useLatestTerm(): Observable<LatestTermResultExtra> {
  const { data, error, isLoading } = useSWR<LatestTermResult>(`/api/latest_term`)
  const status: ObservableStatus = error ? 'error' : (isLoading || !data) ? 'loading' : 'success';

  try {
    return {
      data: {
        latestTerm: data?.latestTerm ?? null,
        latestTermFormatted: typeof data?.latestTerm === 'number' ? formatTermCode(data.latestTerm) : null,
      },
      error,
      status,
    }
  }
  catch(error) {
    console.error(`[useLatestTerm] Error:`, error)
    return {
      data: undefined,
      error: error as any,
      status: 'error',
    }
  }
}

const END_OF_SEASON_DATES: Record<SeasonCode, `${number}-${number}`> = {
  '01': '05-12', // Deadline for faculty to post Spring grade data (May 12)
  '02': '08-19', // Deadline for faculty to post Summer grade data (August 19)
  '03': '12-16', // Deadline for faculty to post Fall grade data (December 16)
}

export interface MissingTerm {
  termCode: number;
  formattedTerm: string;
  termEndDate: Date;
};

export function useMissingData(): Observable<MissingTerm[]> {
  const { data, error, status } = useLatestTerm();
  if (!data) return { data: undefined, error, status };
  if (!data.latestTerm) return { data: undefined, error, status };

  // Separate the season and year of the latest termCode
  const season = seasonCode(data.latestTerm);
  const year = getYear(data.latestTerm);
  // Get the "end" of that season
  const endOfSeason = END_OF_SEASON_DATES[season];
  // Use it to construct a date
  const latestTermEndDate = new Date(`${year}-${endOfSeason}`);
  const now = new Date();

  // Check if we got the latest data "early"
  if (now < latestTermEndDate) return { data: [], error, status }

  const missing_terms: MissingTerm[] = []

  //console.log('iterating from ', latestTermEndDate, 'to', now);

  // Iterate all the calendar days between the end of the term and today
  // We want to see if the any other "end of term" days are found
  for (let d = new Date(latestTermEndDate); d <= now; d.setDate(d.getDate() + 1)) {
    // Check if the date 
    const mmdd = `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    //console.log('d?', d.toLocaleDateString(), 'mmdd?', mmdd);

    // Check if this date matches any of the "end of term" days, and store information about it if it does
    for(let season in END_OF_SEASON_DATES) {
      if ((END_OF_SEASON_DATES as any)[season] === mmdd) {
        const missingTermCode = parseInt(`${d.getFullYear()}${season}`)

        // Due to JS `Date` sucking and timezone stuff, we verify that the latestTerm isn't a "missing" one
        if (missingTermCode === data.latestTerm) continue;

        //console.log('term is missing!', missingTermCode);
        missing_terms.push({
          termCode: missingTermCode,
          formattedTerm: formatTermCode(missingTermCode),
          termEndDate: new Date(d),
        });
      }
    }
  }

  return {
    data: missing_terms,
    error,
    status,
  }
}

export function generateMissingDataMailToLink(missingData: MissingTerm[]): `mailto:${string}` {
  if (missingData.length === 0) return 'mailto:'

  const earliestMissing = missingData.sort((a,b) => a.termCode - b.termCode)[0]
  //const latestMissing = missingData.sort((a,b) => b.termCode - a.termCode)[0]

  const semesterVerbiage = (
    missingData.length === 1
    ? `${earliestMissing.formattedTerm}`
    : `${earliestMissing.formattedTerm} to the most recent available semester`
  );

  // Keep in mind: Chrome-based browsers (and seemingly Safari too) have a character limit of 2000 characters in `mailto:` links for no particular reason.

  const link = mailtoLink({
    to: 'publicinfo@uh.edu',
    subject: 'Public Information Data Request Form, University of Houston',
    body: `
Dear Public Information Officer,

Pursuant to the Texas Public Information Act, I am making a request for information from the University of Houston.

Here is my personal information:
Name: YOUR NAME
Phone #: YOUR PHONE NUMBER
Address: YOUR ADDRESS

I am requesting official course grade distribution data for all UH undergraduate and graduate courses from ${semesterVerbiage}. The data should match the format used in past UH public records, as shown in:
https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution

Each record should include:
• Term
• Subject Code
• Course Number
• Section Number
• Instructor(s)
• Grade counts for A, B, C, D, F, W, etc.

Please provide the data in CSV or a similar machine-readable format.
    `.trim()
  });
  return link as any
}