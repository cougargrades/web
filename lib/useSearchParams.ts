import { useRef, useMemo, useCallback } from 'react'
import { type NextRouter, useRouter,  } from 'next/router';
import { useIsomorphicSearchParams } from './useIsomorphicSearchParams';

/**
 * Based on React router's implementation, but adapted for Next.js
 */


export type ParamKeyValuePair = [string, string];

export type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams;

export type TransitionOptions = Parameters<NextRouter['push']>[2] & {
    /** Replace the current entry in the history stack instead of pushing a new one */
    replace?: boolean;
};

export type SetURLSearchParams = (
  nextInit?:
    | URLSearchParamsInit
    | ((prev: URLSearchParams) => URLSearchParamsInit),
  transitionOpts?: TransitionOptions,
) => void;

export function createSearchParams(
  init: URLSearchParamsInit = "",
): URLSearchParams {
  return new URLSearchParams(
    typeof init === "string" ||
    Array.isArray(init) ||
    init instanceof URLSearchParams
      ? init
      : Object.keys(init).reduce((memo, key) => {
          let value = init[key];
          return memo.concat(
            Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]],
          );
        }, [] as ParamKeyValuePair[]),
  );
}

function getSearchParamsForLocation(
  locationSearch: string,
  defaultSearchParams: URLSearchParams | null,
) {
  let searchParams = createSearchParams(locationSearch);

  if (defaultSearchParams) {
    // Use `defaultSearchParams.forEach(...)` here instead of iterating of
    // `defaultSearchParams.keys()` to work-around a bug in Firefox related to
    // web extensions. Relevant Bugzilla tickets:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1414602
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1023984
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }

  return searchParams;
}

/**
 * Based on React router's implementation, but adapted for Next.js
 * See: https://github.com/remix-run/react-router/blob/d9399d692b159293d697a97335d2e04e6c82f97a/packages/react-router/lib/dom/lib.tsx#L2280
 */
export function useSearchParams(defaultInit?: URLSearchParamsInit): [URLSearchParams, SetURLSearchParams] {
    let defaultSearchParamsRef = useRef(createSearchParams(defaultInit));
    let hasSetSearchParamsRef = useRef(false);
    let router = useRouter();

    //let serverSearchParams = useNextSearchParams(); // ineffective because it's empty on first render and is client-only
    let serverSearchParams = useIsomorphicSearchParams();
    let searchParams = useMemo(
        () =>
        // Only merge in the defaults if we haven't yet called setSearchParams.
        // Once we call that we want those to take precedence, otherwise you can't
        // remove a param with setSearchParams({}) if it has an initial value
        getSearchParamsForLocation(
            serverSearchParams.toString(),
            hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current,
        ),
        [serverSearchParams]
    );
    
    let setSearchParams = useCallback<SetURLSearchParams>(
        (nextInit, navigateOptions) => {
        const newSearchParams = createSearchParams(
            typeof nextInit === "function"
            ? nextInit(new URLSearchParams(searchParams))
            : nextInit,
        );
        hasSetSearchParamsRef.current = true;
        if (navigateOptions?.replace === true) {
            router.replace(`${location.pathname}?${newSearchParams}`, undefined, navigateOptions);
            //window.history.replaceState(undefined, '', `${location.pathname}?${newSearchParams}`) // can't use because it fucks with the Next.js lifecycle
        }
        else {
            router.push(`${location.pathname}?${newSearchParams}`, undefined, navigateOptions);
            //window.history.pushState(undefined, '', `${location.pathname}?${newSearchParams}`) // can't use because it fucks with the Next.js lifecycle
        }
        },
        [searchParams],
    );

  return [searchParams, setSearchParams];
}
