import { PopConMetric } from '@cougargrades/models';
import { PopConService } from '@cougargrades/services';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react'

const SUBMIT_DELAY_MS = 5_000

/**
 * Whenever the location returned by `useLocation` updates, submit a new record to the PopCon service
 * @returns 
 */
export function PageViewLogger() {
  const location = useLocation();
  const { mutate } = useMutation<unknown, unknown, string>({
    mutationFn: async (pathname) => {
      const popconService = new PopConService();
      await popconService.SubmitRecord({ pathname, type: PopConMetric.PageView })
    } 
  })

  useEffect(() => {
    const required_prefixes = ['/c/', '/i/', '/g/'];
    const HAS_REQUIRED_PREFIX = !required_prefixes.every(prefix => !location.pathname.startsWith(prefix))
    if (HAS_REQUIRED_PREFIX) {
      const pathnameCopy = location.pathname;
      // Submit after 5 seconds so page load isn't delayed
      console.debug(`[PageViewLogger] Submitting in ${SUBMIT_DELAY_MS / 1000} seconds: \`${location.pathname}\``);
      setTimeout(() => mutate(pathnameCopy), SUBMIT_DELAY_MS);
    }
  }, [location.pathname]);

  return <></>;
}
