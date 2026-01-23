import React, { useEffect, useState } from 'react'
import { useScroll, useWindowScroll } from 'react-use'

export function useNotableScrollPosition(ref: React.RefObject<HTMLElement>, tolerance: number = 0, stickyPos: number | undefined = undefined) {
  const [atTop, setAtTop] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const [topIsVisible, setTopIsVisible] = useState(false)
  const [bottomIsVisible, setBottomIsVisible] = useState(false)
  const [isSticky, setSticky] = useState(false)
  const { y } = useScroll(ref)
  const { y: windowY } = useWindowScroll();

  const handle = () => {
    const rect = ref.current?.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    const SCROLLED_AT_TOP = ref.current !== null && ref.current.scrollTop <= 0 + tolerance
    const SCROLLED_AT_BOTTOM = ref.current !== null && Math.abs(ref.current.scrollHeight - ref.current.scrollTop - ref.current.clientHeight) < 1 + tolerance;
    const TOP_IS_VISIBLE = rect !== undefined && rect.top > 0 - tolerance && rect.top <= viewHeight
    const BOTTOM_IS_VISIBLE = rect !== undefined && rect.bottom > 0 - tolerance && rect.bottom <= viewHeight
    const IS_STICKY = rect !== undefined && stickyPos !== undefined && rect.y === stickyPos
    setAtTop(SCROLLED_AT_TOP)
    setAtBottom(SCROLLED_AT_BOTTOM)
    setTopIsVisible(TOP_IS_VISIBLE)
    setBottomIsVisible(BOTTOM_IS_VISIBLE)
    setSticky(IS_STICKY)
  }

  useEffect(() => {
    handle()
  },[y, windowY])

  useEffect(() => {
    handle()
  },[])

  return {
    atTop,
    atBottom,
    topIsVisible,
    bottomIsVisible,
    isSticky
  }
}