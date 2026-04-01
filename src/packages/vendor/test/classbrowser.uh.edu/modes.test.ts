import { beforeAll, describe, expect, it } from 'vitest'
import { UHClassBrowserService } from '../../src/classbrowser.uh.edu/UHClassBrowserService';

describe('modes', () => {
  let service: UHClassBrowserService;

  beforeAll(() => {
    service = new UHClassBrowserService();
  });

  it('should return >0 modes', async () => {
    const modes = await service.GetAllInstructionModes();
    expect(modes).toBeTruthy();
    expect(modes?.length).toBeGreaterThan(0);
  })
});
