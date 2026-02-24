import { describe, expect, it } from 'vitest'

import * as Parser from '../src/Parser';
import { isAtomFeed, readFileSync } from './util';

describe('Newtonsoft.Json', () => {
  const data = readFileSync('samples', 'nuget.org', 'Newtonsoft.Json.atom.xml');
  it('parseAtomFeed', () => {
    Parser.parseAtomFeed(data);
  });
  it('isAtomFeed', () => {
    expect(isAtomFeed(Parser.parseAtomFeed(data))).toBeTruthy();
  });
  // TODO: verify that the output looks like it's supposed to
});

describe('Swashbuckle.AspNetCore.Swagger', () => {
  const data = readFileSync('samples', 'nuget.org', 'Swashbuckle.AspNetCore.Swagger.atom.xml');
  it('parseAtomFeed', () => {
    Parser.parseAtomFeed(data);
  });
  it('isAtomFeed', () => {
    expect(isAtomFeed(Parser.parseAtomFeed(data))).toBeTruthy();
  });
  // TODO: verify that the output looks like it's supposed to
});
