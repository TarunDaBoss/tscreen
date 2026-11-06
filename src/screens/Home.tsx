import { useEffect, useRef, useState, type CSSProperties } from 'react'
import houseUrl from '../assets/home-house.jpg'
import { MoonIcon, NavigationIcon, SunIcon } from '../components/Icons'
import { DegreeRing, pos, Text } from '../components/ui'
import { clockParts, longDate, sceneDate, skyStage } from '../lib/time'
import { useDispatch, useStore } from '../state/store'
import { useScreenFocus } from './useScreenFocus'

/** Drag distance (canvas px) or flick speed (canvas px per ms) that unlocks. */
const UNLOCK_DISTANCE = 110
const UNLOCK_VELOCITY = 0.6
const SCREEN_H = 728

export function Home({ night }: { night: boolean }) {
  const { sceneMinutes } = useStore()
  const dispatch = useDispatch()
  const { time, ampm } = clockParts(sceneMinutes)
  const date = longDate(sceneDate(sceneMinutes))
  const isNightTime = skyStage(sceneMinutes) === 'night'
  const headingRef = useScreenFocus()
  const rootRef = useRef<HTMLDivElement>(null)

  // How far the foreground is dragged up (negative = up), in canvas pixels.
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const moved = useRef(false)
  const openedRef = useRef(false)

  const open = () => {
    if (openedRef.current) return
    openedRef.current = true
    dispatch({ type: 'navigate', screen: 'panel', returnFocus: null })
  }

  // Swipe up with touch or a mouse drag. Window listeners (rather than pointer capture)
  // keep a plain click on the bar working as a click.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const root = rootRef.current
    if (!root) return
    const scale = root.getBoundingClientRect().height / SCREEN_H
    const startY = e.clientY
    const startT = performance.now()
    let last = { y: startY, t: startT }
    let prev = last
    moved.current = false
    setDragging(true)

    const move = (ev: PointerEvent) => {
      const dy = (ev.clientY - startY) / scale
      if (Math.abs(dy) > 6) moved.current = true
      prev = last
      last = { y: ev.clientY, t: performance.now() }
      // Follows the finger upward; resists a little when pulled down.
      setDrag(dy < 0 ? dy : dy * 0.15)
    }
    const end = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      setDragging(false)
      const dy = (ev.clientY - startY) / scale
      const dt = Math.max(1, last.t - prev.t)
      const velocity = (last.y - prev.y) / scale / dt
      if (ev.type === 'pointerup' && (dy < -UNLOCK_DISTANCE || (dy < -20 && velocity < -UNLOCK_VELOCITY))) open()
      else setDrag(0)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }

  // Enter (or Space / Arrow Up) unlocks when nothing else on the page has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!['Enter', ' ', 'ArrowUp'].includes(e.key)) return
      const t = e.target as HTMLElement | null
      const onPage = !t || t === document.body || t === headingRef.current
      if (!onPage) return
      e.preventDefault()
      open()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fg: CSSProperties = {
    transform: drag ? `translateY(${drag}px)` : undefined,
    opacity: drag < 0 ? Math.max(0, 1 + drag / 360) : 1,
    transition: dragging ? 'none' : 'transform 0.35s var(--ease), opacity 0.35s ease',
  }

  return (
    <div ref={rootRef} className="screen-fill home" onPointerDown={onPointerDown}>
      {/* Background: house photo (fixed 1px offset, see FIXES.md) + gradient overlay */}
      <img src={houseUrl} alt="" className="bg-img" style={pos(174, 127, 1165, 728)} draggable={false} />
      <img src={houseUrl} alt="" className={`bg-img night-home ${night ? 'is-on' : ''}`} style={pos(174, 127, 1165, 728)} draggable={false} />
      <div className="gradient-home" />

      <h1 className="sr-only" tabIndex={-1} ref={headingRef}>Home screen</h1>

      <div className="screen-fill" style={fg}>
        {/* Same pill as the design (black 60%, #979797 border, radius 20), now a swipe hint */}
        <span className="home-pill" aria-hidden="true" style={pos(648, 148, 220, 37)}>
          Swipe up to unlock
        </span>

        {/* Time & date */}
        <div style={{ ...pos(213, 629), display: 'flex', alignItems: 'flex-start' }} aria-label={`${time} ${ampm}, ${date}`} role="group">
          <span className="t home-time" aria-hidden="true">{time}</span>
          <span className="t home-ampm" aria-hidden="true">{ampm}</span>
        </div>
        <Text x={226} y={782} size={30} style={{ whiteSpace: 'nowrap' }}>
          <span aria-hidden="true">{date}</span>
        </Text>

        {/* Weather */}
        <div role="group" aria-label={`Weather: ${isNightTime ? 'clear' : 'sunny'}, 49 degrees, Apex, North Carolina`}>
          {/* Sun by day; the same icon slot shows a moon at night (time slider extension) */}
          {isNightTime
            ? <MoonIcon w={70} h={70} color="#FFB02F" style={pos(1043, 694)} />
            : <SunIcon w={78} h={78} color="#FFB02F" style={pos(1039, 690)} />}
          <Text x={1127} y={678} size={91} weight={600}><span aria-hidden="true">49</span></Text>
          <DegreeRing size={19} border={4} style={pos(1253, 696)} />
          <Text x={961} y={782} size={30} style={{ whiteSpace: 'nowrap' }}><span aria-hidden="true">Apex, North Carolina</span></Text>
          <NavigationIcon w={24} h={24} style={{ ...pos(1272, 788), transform: 'rotate(39deg)' }} />
        </div>

        {/* iPad-style home bar: drag it (or anywhere) up, click it, or press Enter */}
        <button
          type="button"
          className="btn home-bar"
          aria-label="Unlock: open the Control Panel"
          style={pos(606.5, 813, 300, 42)}
          onClick={() => { if (!moved.current) open() }}
        >
          <span className="home-bar-line" />
        </button>
      </div>
    </div>
  )
}
