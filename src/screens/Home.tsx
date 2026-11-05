import { useRef } from 'react'
import houseUrl from '../assets/home-house.jpg'
import { MoonIcon, NavigationIcon, SunIcon } from '../components/Icons'
import { DegreeRing, pos, Text } from '../components/ui'
import { clockParts, longDate, sceneDate, skyStage } from '../lib/time'
import { useDispatch, useStore } from '../state/store'
import { useScreenFocus } from './useScreenFocus'

export function Home({ night }: { night: boolean }) {
  const { sceneMinutes } = useStore()
  const dispatch = useDispatch()
  const { time, ampm } = clockParts(sceneMinutes)
  const date = longDate(sceneDate(sceneMinutes))
  const isNightTime = skyStage(sceneMinutes) === 'night'
  const headingRef = useScreenFocus()
  const swipeStart = useRef<number | null>(null)

  const open = () => dispatch({ type: 'navigate', screen: 'panel', returnFocus: null })

  return (
    <div
      className="screen-fill home"
      onPointerDown={(e) => { swipeStart.current = e.clientY }}
      onPointerUp={(e) => {
        const start = swipeStart.current
        swipeStart.current = null
        if (start !== null && start - e.clientY > 40) open()
      }}
      onPointerCancel={() => { swipeStart.current = null }}
    >
      {/* Background: house photo (fixed 1px offset, see FIXES.md) + gradient overlay */}
      <img src={houseUrl} alt="" className="bg-img" style={pos(174, 127, 1165, 728)} draggable={false} />
      <img src={houseUrl} alt="" className={`bg-img night-home ${night ? 'is-on' : ''}`} style={pos(174, 127, 1165, 728)} draggable={false} />
      <div className="gradient-home" />

      <h1 className="sr-only" tabIndex={-1} ref={headingRef}>Home screen</h1>

      {/* "Tap for Control Panel" pill (black 60%, #979797 1px inside border, radius 20) */}
      <button type="button" className="btn home-pill" style={pos(648, 148, 220, 37)} onClick={open}>
        Tap for Control Panel
      </button>

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
    </div>
  )
}
