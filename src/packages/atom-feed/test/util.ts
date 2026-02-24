
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import { is } from '@cougargrades/utils/zod'
import { AtomFeed } from '../src';

/** cross-platform shortcut to get the contents of a file */
export function readFileSync(...paths: string[]): string {
  return fs.readFileSync(path.resolve(__dirname, path.join(...paths)), { encoding: 'utf-8' });
}

/** cross-platform shortcut to get the contents of a file */
export async function readFile(...paths: string[]): Promise<string> {
  const readFile = util.promisify(fs.readFile);
  return await readFile(path.resolve(__dirname, path.join(...paths)), { encoding: 'utf-8' });
}

export function isAtomFeed(input: unknown): input is AtomFeed {
  return is(input, AtomFeed);
}
