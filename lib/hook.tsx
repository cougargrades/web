import { useMedia } from 'react-use'

export function useIsMobile() {
  return useMedia('(max-width: 576px)');
}

export function useIsCondensed() {
  return useMedia('(max-width: 768px)');
}
