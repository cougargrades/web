import * as z4 from 'zod/v4/core'
import { trimEnd } from 'lodash-es';

import { VITE_COUGARGRADES_API_ORIGIN } from '../environment'
import { isNullish } from '@cougargrades/utils/nullish';

export type SearchParams = ConstructorParameters<typeof URLSearchParams>[0];

export class BaseApiService {
  baseURL: URL;

  constructor(base?: URL) {
    this.baseURL = base ?? VITE_COUGARGRADES_API_ORIGIN;
  }

  public async Get<TSchema extends z4.$ZodType>(path: string, query: SearchParams, schema: TSchema): Promise<z4.output<TSchema> | null> {
    const params = new URLSearchParams(query);
    const queryString: string = (
      params.size > 0
      ? `?${params}`
      : ''
    );

    const res = await fetch(`${trimEnd(this.baseURL.href, '/')}${path}${queryString}`);
    if (!res.ok) {
      console.error(`[BaseApiService] Failed to fetch (${res.status} ${res.statusText}) at: ${path}${queryString}`);
      return null;
    }
    try {
      const data = await res.json();
      const parsed = z4.safeParse(schema, data);
      if (!parsed.success) {
        console.debug(`[BaseApiService] Failed validation of JSON data with Zod Schema: ${path}${queryString}`, parsed);
        return null;
      }
      return parsed.data;
    }
    catch (err) {
      console.error(`[BaseApiService] Error while parsing response: ${path}${queryString}`, err);
      return null;
    }
  }

  public async Post<TSchema extends z4.$ZodType>(path: string, query: SearchParams, schema?: TSchema): Promise<z4.output<TSchema> | null> {
    const params = new URLSearchParams(query);
    const queryString: string = (
      params.size > 0
      ? `?${params}`
      : ''
    );

    const res = await fetch(`${trimEnd(this.baseURL.href, '/')}${path}${queryString}`, {
      method: 'POST',
    });
    if (!res.ok) {
      console.error(`[BaseApiService] Failed to POST (${res.status} ${res.statusText}) at: ${path}${queryString}`);
      return null;
    }
    try {
      if (isNullish(schema)) return null;
      const data = await res.json();
      const parsed = z4.safeParse(schema, data);
      if (!parsed.success) {
        console.debug(`[BaseApiService] Failed validation of JSON data with Zod Schema: ${path}${queryString}`, parsed);
        return null;
      }
      return parsed.data;
    }
    catch (err) {
      console.error(`[BaseApiService] Error while parsing response: ${path}${queryString}`, err);
      return null;
    }
  }
}
