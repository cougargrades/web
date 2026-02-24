import { describe, expect, it } from 'vitest'

import * as Parser from '../src/Parser';
import { isAtomFeed, readFileSync } from './util';

describe('npm versions', () => {
  const data = readFileSync('samples', 'libraries.io', 'npm_versions.atom.xml');
  it('parseAtomFeed', () => {
    Parser.parseAtomFeed(data);
  });
  it('isAtomFeed', () => {
    expect(isAtomFeed(Parser.parseAtomFeed(data))).toBeTruthy();
  });
  // TODO: verify that the output looks like it's supposed to
});
