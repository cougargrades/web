
import * as z4 from 'zod/v4/core'
import { z } from 'zod'

// https://zod.dev/library-authors?id=how-to-accept-user-defined-schemas

/**
 * Tests if `input` passes the provided Zod v4 schema
 * 
 * Ex: `is(123, z.string())`
 * 
 * @param input 
 * @param schema 
 * @returns 
 */
export function is<TSchema extends z4.$ZodType>(input: unknown, schema: TSchema): input is z4.output<TSchema> {
  const parsed = z4.safeParse(schema, input);
  return parsed.success
}

export type SafeParseResult<T> = z4.util.SafeParseResult<T>
