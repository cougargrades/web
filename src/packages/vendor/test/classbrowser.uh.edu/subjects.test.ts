import { beforeAll, describe, expect, it } from 'vitest'
import { UHClassBrowserService } from '../../src/classbrowser.uh.edu/UHClassBrowserService';

describe('subjects', () => {
  let service: UHClassBrowserService;

  beforeAll(() => {
    service = new UHClassBrowserService();
  });

  it('should return >0 subjects', async () => {
    const subjects = await service.GetAllSubjects()
    expect(subjects).toBeTruthy();
    expect(subjects?.length).toBeGreaterThan(0);
  })
});
