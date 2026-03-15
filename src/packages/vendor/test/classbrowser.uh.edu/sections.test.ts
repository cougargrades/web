import { assert, beforeAll, describe, expect, it } from 'vitest'
import { Temporal } from 'temporal-polyfill'
import { UHClassBrowserService } from '../../src/classbrowser.uh.edu/UHClassBrowserService';
import { FormattedSeasonCode, getCurrentSeason, SeasonCode } from '@cougargrades/models';
import { isNullish } from '@cougargrades/utils/nullish';

describe('sections', () => {
  let service: UHClassBrowserService;

  beforeAll(() => {
    service = new UHClassBrowserService();
  });

  it('should return 0 sections', async () => {
    // When no parameters are provided, an empty result is returned
    const results = await service.SearchSections({})
    expect(results).toBeTruthy();
    expect(results?.data.length).toBe(0);
  })

  it('should return >0 sections', async () => {
    // We need to know the terms, since we need to provide one in order to test the section serach
    const allTerms = await service.GetAllTerms();
    assert(!isNullish(allTerms), "Could not fetch terms");
    assert(allTerms.length > 0, "No terms are available");

    // "2026"
    const currentYear = new Date().getFullYear().toString();
    // "01"
    const cgSeasonCode = getCurrentSeason()
    // "Spring"
    const recentSeasonString = FormattedSeasonCode[cgSeasonCode];

    // { "term": "2280", "term_descr": "Spring 2026" }
    const likelyAvailableTerm = allTerms
      .find(t =>
        t.term_descr.includes(currentYear)
        && t.term_descr.toLowerCase().includes(recentSeasonString.toLowerCase())
      );
    
    assert(!isNullish(likelyAvailableTerm), 'Could not assess a term that is most likely to have values available');
    if (isNullish(likelyAvailableTerm)) throw new Error();

    // When no parameters are provided, an empty result is returned
    const results = await service.SearchSections({ term: likelyAvailableTerm.term });
    expect(results).toBeTruthy();
    expect(results?.data.length).toBeGreaterThan(0);
    console.log(results?.data.length ?? -1, 'sections fetched for', likelyAvailableTerm);
  })
}, 20_000);
