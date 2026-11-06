import { useEffect, useRef, useState } from 'react'

export const DEMO_CODE = '1234'
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Backspace arrow for the keypad's delete key. */
const DeleteIcon = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true" focusable="false">
    <path d="M13 3h22a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H13L2 15z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M19 10l10 10M29 10L19 20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/**
 * 4-digit code pad shown over the Security screen when disarming.
 * Glass panel in the design's style; digits can also be typed on a keyboard.
 */
export function Keypad({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstKeyRef = useRef<HTMLButtonElement>(null)
  const checking = useRef(false)

  useEffect(() => { firstKeyRef.current?.focus({ preventScroll: true }) }, [])

  const press = (digit: string) => {
    if (checking.current || code.length >= 4) return
    setError(false)
    const next = code + digit
    setCode(next)
    if (next.length === 4) {
      checking.current = true
      // Short pause so the fourth dot is visible before the result.
      window.setTimeout(() => {
        if (next === DEMO_CODE) {
          onSuccess()
        } else {
          setError(true)
          shake()
          setCode('')
          checking.current = false
        }
      }, 180)
    }
  }

  // Shake the panel in place (no remount, so keyboard focus stays put).
  const shake = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    panelRef.current?.animate(
      [0, -18, 16, -12, 8, -4, 0].map((x) => ({ transform: `translateX(${x}px)` })),
      { duration: 450, easing: 'ease-out' },
    )
  }

  const backspace = () => {
    if (checking.current) return
    setCode((c) => c.slice(0, -1))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); return }
    if (e.key === 'Backspace') { e.preventDefault(); backspace(); return }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); return }
    if (e.key === 'Tab') {
      // Keep focus inside the keypad.
      const items = [...(panelRef.current?.querySelectorAll<HTMLElement>('button') ?? [])]
      const i = items.indexOf(document.activeElement as HTMLElement)
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1)
      e.preventDefault()
      items[next]?.focus()
    }
  }

  return (
    <div className="dialog-backdrop keypad-backdrop" onKeyDown={onKeyDown}>
      <div className="keypad-wrap">
        <div
          ref={panelRef}
          className="keypad glass"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keypad-title"
          aria-describedby="keypad-hint"
        >
          <h2 id="keypad-title" className="keypad-title">Enter code to disarm</h2>
          <div className="keypad-dots" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => <span key={i} className={`keypad-dot ${i < code.length ? 'is-filled' : ''}`} />)}
          </div>
          <p className="sr-only" aria-live="polite">{code.length} of 4 digits entered</p>
          <p className="keypad-error" role="alert">{error ? 'Wrong code' : ''}</p>
          <div className="keypad-grid">
            {KEYS.map((k, i) => (
              <button key={k} ref={i === 0 ? firstKeyRef : undefined} type="button" className="btn keypad-key" onClick={() => press(k)}>
                {k}
              </button>
            ))}
            <button type="button" className="btn keypad-key keypad-text" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn keypad-key" onClick={() => press('0')}>0</button>
            <button type="button" className="btn keypad-key keypad-text" aria-label="Delete last digit" onClick={backspace}>
              <DeleteIcon />
            </button>
          </div>
        </div>
        <p id="keypad-hint" className="keypad-hint">Demo code: {DEMO_CODE}</p>
      </div>
    </div>
  )
}
