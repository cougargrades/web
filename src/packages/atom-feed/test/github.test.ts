import { describe, expect, it } from 'vitest'

import * as Parser from '../src/Parser';
import { isAtomFeed, readFileSync } from './util';

describe('private', () => {
  const data = readFileSync('samples', 'github.com', 'private.atom.xml');
  it('parseAtomFeed', () => {
    Parser.parseAtomFeed(data);
  });
  it('isAtomFeed', () => {
    expect(isAtomFeed(Parser.parseAtomFeed(data))).toBeTruthy();
  });
  // TODO: verify that the output looks like it's supposed to
});

describe('releases', () => {
  const data = readFileSync('samples', 'github.com', 'releases.atom.xml');
  it('parseAtomFeed', () => {
    Parser.parseAtomFeed(data);
  });
  it('isAtomFeed', () => {
    expect(isAtomFeed(Parser.parseAtomFeed(data))).toBeTruthy();
  });
  // TODO: verify that the output looks like it's supposed to
});
