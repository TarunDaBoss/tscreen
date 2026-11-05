import { useEffect, useRef } from 'react'
import { useStore } from '../state/store'

/**
 * When a screen appears after the visitor navigated, move keyboard/screen-reader
 * focus to it: either back to the control that opened the previous screen, or to
 * the new screen's heading. Nothing is focused on the initial page load.
 */
export function useScreenFocus() {
  const ref = useRef<HTMLHeadingElement>(null)
  const { hasNavigated, returnFocus } = useStore()
  useEffect(() => {
    if (!hasNavigated) return
    const target = returnFocus ? document.getElementById(returnFocus) : null
    ;(target ?? ref.current)?.focus({ preventScroll: true })
    // Runs once when the screen mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}
