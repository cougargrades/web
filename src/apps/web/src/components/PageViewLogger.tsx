import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai';
import { PopConMetric } from '@cougargrades/models';
import { PopConService } from '@cougargrades/services';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { isNullish } from '@cougargrades/utils/nullish';
//import { getTurnstileTokenAtom, turnstileTokenAtom } from '../lib/jotai';

const SUBMIT_DELAY_MS = 5_000

/**
 * Whenever the location returned by `useLocation` updates, submit a new record to the PopCon service
 * @returns 
 */
export function PageViewLogger() {
  const location = useLocation();
  const turnstileRef = useRef<TurnstileInstance>(null);
  //const [ turnstileToken, setTurnstileToken] = useAtom(turnstileTokenAtom);
  //const [_, setTurnstileTokenFetcher] = useAtom(getTurnstileTokenAtom);
  const { mutate } = useMutation<unknown, unknown, string>({
    mutationFn: async (pathname) => {
      if (isNullish(turnstileRef.current)) {
        console.warn(`[PageViewLogger.tsx] TurnstileRef is not initialized..?`);
        return;
      }
      const turnstileToken = await turnstileRef.current.getResponsePromise();
      const popconService = new PopConService();
      await popconService.SubmitRecord({ pathname, type: PopConMetric.PageView }, turnstileToken);
      turnstileRef.current.reset()
    } 
  })

  useEffect(() => {
    const required_prefixes = ['/c/', '/i/', '/g/'];
    const HAS_REQUIRED_PREFIX = !required_prefixes.every(prefix => !location.pathname.startsWith(prefix))
    if (HAS_REQUIRED_PREFIX) {
      // Send immediately because we use `Navigator.sendBeacon()` behind the scenes
      mutate(location.pathname);
    }
  }, [location.pathname]);

  return <>
  
  <Turnstile ref={turnstileRef}
    siteKey={import.meta.env.VITE_CF_TURNSTILE_SITE_KEY}
    />

  </>;
}
