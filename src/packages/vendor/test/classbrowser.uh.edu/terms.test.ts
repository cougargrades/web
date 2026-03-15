import { beforeAll, describe, expect, it } from 'vitest'
import { UHClassBrowserService } from '../../src/classbrowser.uh.edu/UHClassBrowserService';

describe('terms', () => {
  let service: UHClassBrowserService;

  beforeAll(() => {
    service = new UHClassBrowserService();
  });

  it('should return >0 terms', async () => {
    const terms = await service.GetAllTerms();
    expect(terms).toBeTruthy();
    expect(terms?.length).toBeGreaterThan(0);
  })
});
