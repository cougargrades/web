import { describe, expect, it,  } from 'vitest'
import { search } from '../../src/simplesyllabus/simplesyllabus'


describe('search', () => {
  it('should pass the zod schema', async () => {
    const results = await search('MANA 3335');
    expect(results).toBeTruthy();
  });
});
