import { useMemo, useCallback } from 'react'
import * as z4 from 'zod/v4/core';
import { TransitionOptions, useSearchParams } from './useSearchParams';


export type SetURLSearchParams<T extends z4.$ZodType<object>> = (
  nextInit?:
    | z4.output<T>
    | ((prev: z4.output<T>) => z4.output<T>),
  transitionOpts?: TransitionOptions,
) => void;


/**
 * Wrapper around `useSearchParams` that validates with Zod.
 */
export function useTypedSearchParams<T extends z4.$ZodType<{}>>(schema: T, defaultInit: z4.output<T>): [z4.output<T>, SetURLSearchParams<T>]  {
  //const [searchParams, setSearchParams] = useSearchParams({ age: '99', foo: 'false' });
  const [searchParams, setSearchParams] = useSearchParams(defaultInit);

  // Parse the search params with zod
  let parsedSearchParams = useMemo(() => {
    /**
     * Using `safeParse` is important because if you reroute to the root by clicking a link, then the
     * searchParams will be empty "intentionally" for a moment (causing a parse failure), when
     * normally "defaultInit" is only respected at the beginning.
     * 
     * This is our special behavior because we need everything to be type-safe. If this was an ordinary `useSearchParams`
     * then we'd just get an empty URLSearchParams instance for 1 render cycle.
     */
    const parsed = z4.safeParse(schema, Object.fromEntries(searchParams.entries()));
    return parsed.success ? parsed.data : defaultInit;
  }, [searchParams]);
  let setTypedSearchParams = useCallback<SetURLSearchParams<T>>(
    (nextInit, navigateOptions) => {
      // TypeScript for the love of god, please...
      // https://github.com/microsoft/TypeScript/issues/37750
      const newInit = typeof nextInit === 'function' ? (nextInit as (prev: z4.output<T>) => z4.output<T>)(parsedSearchParams) : nextInit;
      setSearchParams(newInit, navigateOptions);
    },
    [searchParams]
  )

  return [parsedSearchParams, setTypedSearchParams]
}
