import { useRouter } from "next/router";


/**
 * Isomorphic version of `import { useSearchParams } from 'next/navigation'` that isn't client-only and actually provides the correct values during the lifecycle
 */
export function useIsomorphicSearchParams(): URLSearchParams {
    let router = useRouter();
    let serverSearchParams = new URL(router.asPath, 'https://localhost').searchParams;

    return serverSearchParams;
}
