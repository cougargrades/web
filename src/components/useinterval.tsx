import { useEffect, useRef } from 'react';

/**
 * Original code by:
 * Dan Abramov
 * Adapted from: 
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback: () => void, delay?: number | null) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if(savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }

    if (delay !== null && delay !== undefined) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}