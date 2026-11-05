import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { BackArrowIcon } from './Icons'
import { useDispatch } from '../state/store'

// Every coordinate in this app is copied straight from the Sketch file, in canvas
// pixels (1512×982). Screen content lives inside the screen rectangle at (174,127),
// so pos() converts canvas coordinates to screen-relative ones.
export const SCREEN_X = 174
export const SCREEN_Y = 127

export function pos(x: number, y: number, w?: number, h?: number): CSSProperties {
  const style: CSSProperties = { position: 'absolute', left: x - SCREEN_X, top: y - SCREEN_Y }
  if (w !== undefined) style.width = w
  if (h !== undefined) style.height = h
  return style
}

interface TextProps {
  x: number
  y: number
  w?: number
  size: number
  weight?: 400 | 600
  color?: string
  align?: 'left' | 'center' | 'right'
  children: ReactNode
  as?: 'span' | 'h1' | 'h2' | 'p'
  id?: string
  style?: CSSProperties
  /** focusable heading target for screen changes */
  headingRef?: React.Ref<HTMLHeadingElement>
}

export function Text({ x, y, w, size, weight = 400, color = '#FFFFFF', align = 'left', children, as = 'span', id, style, headingRef }: TextProps) {
  const Tag = as
  const extra = as === 'h1' ? { tabIndex: -1, ref: headingRef } : {}
  return (
    <Tag
      id={id}
      className="t"
      style={{ ...pos(x, y, w), fontSize: size, fontWeight: weight, color, textAlign: align, ...style }}
      {...extra}
    >
      {children}
    </Tag>
  )
}

/** A degree sign drawn as a ring, exactly like the design (an oval with an inside border). */
export function DegreeRing({ size, border, style }: { size: number; border: number; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${border}px solid #FFFFFF`,
        boxSizing: 'border-box',
        ...style,
      }}
    />
  )
}

/** Glass card: #1E1E1E @ 62% with Sketch's 6px background blur (saturation 146%). */
export function Glass({ x, y, w, h, radius = 31, children, className = '' }: { x: number; y: number; w: number; h: number; radius?: number; children?: ReactNode; className?: string }) {
  return <div className={`glass ${className}`} style={{ ...pos(x, y, w, h), borderRadius: radius }}>{children}</div>
}

export const ON_GREEN = 'rgba(40, 255, 0, 0.47)' // #28FF00 at 47% layer opacity

interface SwitchProps {
  x: number
  y: number
  checked: boolean
  onChange: () => void
  label: string
  size?: 'large' | 'small'
  /** off-track color (already multiplied by the 47% layer opacity) */
  offColor?: string
  knobContent?: ReactNode
  id?: string
}

/** Toggle switch. Large = 78×49 (Goodnight, appliances), small = 56×35 (locks). */
export function Switch({ x, y, checked, onChange, label, size = 'large', offColor, knobContent, id }: SwitchProps) {
  const large = size === 'large'
  const w = large ? 78 : 56
  const h = large ? 49 : 35
  const knob = large ? 42 : 30
  const knobTop = large ? 3 : 2
  const knobLeft = checked ? (large ? 32 : 23) : 3
  const off = offColor ?? (large ? 'rgba(143, 143, 143, 0.2068)' : 'rgba(95, 95, 95, 0.47)')
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      className="btn switch"
      onClick={onChange}
      style={{ ...pos(x, y, w, h), borderRadius: 25, background: checked ? ON_GREEN : off }}
    >
      <span
        className="switch-knob"
        style={{ width: knob, height: knob, top: knobTop, left: knobLeft }}
      >
        {knobContent}
      </span>
    </button>
  )
}

/** Round 67px back button with the design's filled-arrow line. Always returns to the Control Panel. */
export function BackButton() {
  const dispatch = useDispatch()
  return (
    <button
      type="button"
      className="btn round-btn"
      aria-label="Back to Control Panel"
      onClick={() => dispatch({ type: 'navigate', screen: 'panel' })}
      style={pos(226, 208, 67, 67)}
    >
      <BackArrowIcon style={{ position: 'absolute', left: 17.5 - 2, top: 33.5 - 8 }} />
    </button>
  )
}

/** Container shared by every detail screen (1104×644 glass card + title + back button). */
export function DetailFrame({ title, titleY = 227, children, headingRef }: { title: string; titleY?: number; children: ReactNode; headingRef: React.Ref<HTMLHeadingElement> }) {
  return (
    <>
      <Glass x={204} y={190} w={1104} h={644} />
      <Text as="h1" headingRef={headingRef} x={204} y={titleY} w={1104} size={28} weight={600} align="center">
        {title}
      </Text>
      <BackButton />
      {children}
    </>
  )
}

/** Gray "+" disc used on the add tiles (86px, #D8D8D8 with #979797 bars). */
function PlusDisc({ x, y }: { x: number; y: number }) {
  return (
    <span aria-hidden="true" className="plus-disc" style={pos(x, y, 86, 86)}>
      <span className="plus-bar" />
      <span className="plus-bar plus-bar-v" />
    </span>
  )
}

/** "+" add tile: does nothing except show a small "Coming soon" tooltip. */
export function AddTile({ x, y, w, h, radius, border, opacity = 1, discX, discY, label }: {
  x: number; y: number; w: number; h: number; radius: number; border: number; opacity?: number; discX: number; discY: number; label: string
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const tipId = useId()
  const show = (ms = 1800) => {
    setOpen(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(false), ms)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <>
      <button
        type="button"
        className="btn add-tile"
        aria-label={label}
        aria-describedby={tipId}
        onClick={() => show()}
        onFocus={() => show(2400)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => show(2400)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
        style={{ ...pos(x, y, w, h), borderRadius: radius, boxShadow: `inset 0 0 0 ${border}px #979797`, opacity }}
      >
        <PlusDisc x={discX - x + SCREEN_X} y={discY - y + SCREEN_Y} />
      </button>
      <span
        id={tipId}
        role="tooltip"
        className={`tooltip ${open ? 'is-open' : ''}`}
        style={{ ...pos(discX + 43 - 110, discY - 70, 220) }}
      >
        <span className="tooltip-bubble">Coming soon</span>
      </span>
    </>
  )
}

/** Position relative to the parent element (for children of buttons/tiles). */
export function abs(x: number, y: number, w?: number, h?: number): CSSProperties {
  const style: CSSProperties = { position: 'absolute', left: x, top: y }
  if (w !== undefined) style.width = w
  if (h !== undefined) style.height = h
  return style
}
