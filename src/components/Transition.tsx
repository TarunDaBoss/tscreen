import { useEffect, useRef, useState, type ReactNode } from 'react'

export const TRANSITION_MS = 420

type Phase = 'enter' | 'exit' | 'idle'
type Dir = 'fwd' | 'back'
interface Item<K> { key: K; phase: Phase; dir: Dir }

/**
 * Keeps the outgoing screen mounted while the incoming one animates in, iPad-style.
 * `depth` decides direction: going deeper zooms in, going back zooms out.
 *
 * `backdrop` is painted inside every layer, under the animated content. A layer that
 * fades (opacity < 1) becomes a "backdrop root", so the glass cards' backdrop-filter
 * can only see what is inside that layer. Giving each layer its own copy of the photo
 * keeps the frosted-glass blur intact for the whole animation.
 */
export function ScreenTransition<K extends string>({
  screenKey, depth, render, variant, backdrop,
}: {
  screenKey: K
  depth: (k: K) => number
  render: (k: K) => ReactNode
  variant: 'unlock' | 'zoom'
  backdrop?: ReactNode
}) {
  const [items, setItems] = useState<Item<K>[]>([{ key: screenKey, phase: 'idle', dir: 'fwd' }])
  const prev = useRef(screenKey)

  useEffect(() => {
    if (prev.current === screenKey) return
    const dir: Dir = depth(screenKey) >= depth(prev.current) ? 'fwd' : 'back'
    prev.current = screenKey
    setItems((cur) => [
      ...cur.filter((i) => i.key !== screenKey).map((i) => ({ ...i, phase: 'exit' as const, dir })),
      { key: screenKey, phase: 'enter', dir },
    ])
    const t = window.setTimeout(() => {
      setItems((cur) => cur.filter((i) => i.phase !== 'exit').map((i) => ({ ...i, phase: 'idle' })))
    }, TRANSITION_MS)
    return () => window.clearTimeout(t)
  }, [screenKey, depth])

  return (
    <>
      {items.map((i) => (
        <div
          key={i.key}
          className={`layer ${variant} ${i.phase} ${i.dir}`}
          inert={i.phase === 'exit'}
          aria-hidden={i.phase === 'exit' || undefined}
        >
          {backdrop}
          <div className="layer-content">{render(i.key)}</div>
        </div>
      ))}
    </>
  )
}
