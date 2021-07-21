import { useWindowSize } from 'react-use'

export function useIsMobile() {
  const { width } = useWindowSize()
  return width < 576;
}