import { beforeAll, describe, expect, it } from 'vitest'
import { UHClassBrowserService } from '../../src/classbrowser.uh.edu/UHClassBrowserService';

describe('instructors', () => {
  let service: UHClassBrowserService;

  beforeAll(() => {
    service = new UHClassBrowserService();
  });

  /**
   * This will randomly fail with "500 Internal Server Error"
   */
  // it('should return >0 instructors', async () => {
  //   const results = await service.SearchInstructors('a');
  //   expect(results).toBeTruthy();
  //   expect(results?.length).toBeGreaterThan(0);
  // })

  it('should return Bob Buzzanco', async () => {
    const results = await service.SearchInstructors('Buzzanco,Robert');
    expect(results).toBeTruthy();
    expect(results?.length).toBeGreaterThan(0);
  })
});
