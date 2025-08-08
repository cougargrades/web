import { useRouter } from "next/router";

export function useIsomorphicSearchParams(): URLSearchParams {
    let router = useRouter();
    let serverSearchParams = new URL(router.asPath, 'https://localhost').searchParams;

    return serverSearchParams;
}
