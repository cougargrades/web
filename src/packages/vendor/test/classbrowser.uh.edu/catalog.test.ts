import { beforeAll, describe, expect, it } from 'vitest'
import { UHClassBrowserService } from '../../src/classbrowser.uh.edu/UHClassBrowserService';

describe('catalog', () => {
  let service: UHClassBrowserService;

  beforeAll(() => {
    service = new UHClassBrowserService();
  });

  it('should return >0 courses', async () => {
    const results = await service.SearchCatalog()
    expect(results).toBeTruthy();
    expect(results?.length).toBeGreaterThan(0);
  })

  it('should return COOP 0011', async () => {
    const results = await service.SearchCatalog({ subject: 'COOP' })
    expect(results).toBeTruthy();
    expect(results?.length).toBeGreaterThan(0);
    expect(results?.filter(r => r.subject === 'COOP' && r.catalog_nbr === '0011').length).toBeGreaterThan(0)
  })
});
