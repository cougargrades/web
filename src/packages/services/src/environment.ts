
import { z } from 'zod'
import { isNullishOrWhitespace } from '@cougargrades/utils/nullish'

function strOrNull(input: any): string | null {
  return isNullishOrWhitespace(input) ? null : `${input}`;
}

function urlOrNull(input: any): URL | null {
  try {
    return new URL(input);
  }
  catch {
    return null;
  }
}

export type DataEnvironment = z.infer<typeof DataEnvironment>;
export const DataEnvironment = z.enum(['production', 'preview'])

// TODO: detect correctly
export const VITE_COUGARGRADES_DATA_ENVIRONMENT: DataEnvironment = 'preview';

export const VITE_COUGARGRADES_DEFAULT_API_ORIGIN = new URL(`https://api.cougargrades.io`);

// ----------

export const VITE_COUGARGRADES_API_ORIGIN = urlOrNull('https://api.cougargrades.io') ?? VITE_COUGARGRADES_DEFAULT_API_ORIGIN; //urlOrNull(import.meta.env?.VITE_COUGARGRADES_API_ORIGIN);

export const VITE_COUGARGRADES_ROOT_DATA_ORIGIN = new URL(`https://data.cougargrades.io`); //urlOrNull(import.meta.env?.VITE_COUGARGRADES_DATA_ORIGIN);

/**
 * Ex: `https://data.cougargrades.io/preview`
 */
export const VITE_COUGARGRADES_DATA_ORIGIN = new URL(`/${VITE_COUGARGRADES_DATA_ENVIRONMENT}`, VITE_COUGARGRADES_ROOT_DATA_ORIGIN);

