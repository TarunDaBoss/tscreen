import type { ReactNode } from 'react'
import { DropletIcon, TriangleIcon, WindIcon } from '../components/Icons'
import { abs, DegreeRing, DetailFrame, pos } from '../components/ui'
import { TEMP_MAX, TEMP_MIN, useDispatch, useStore, type HvacMode, type ZoneId } from '../state/store'
import { MODE_FILL, MODE_LABEL, ZONES } from '../lib/design'
import { useScreenFocus } from './useScreenFocus'


/** Selected fill on this screen. Cool/Warm are from the design; Off gets a light neutral so the selection is visible. */
const SELECTED_FILL: Record<HvacMode, string> = { ...MODE_FILL, off: 'rgba(255, 255, 255, 0.28)' }

const MODES: { mode: HvacMode; x: number; content: ReactNode }[] = [
  {
    mode: 'cool',
    x: 252,
    content: (
      <>
        <WindIcon w={37.5294} h={44} style={abs(40, 31)} />
        <span className="t mode-text" style={abs(89.53, 34)}>Cool</span>
      </>
    ),
  },
  {
    mode: 'warm',
    x: 520,
    content: (
      <>
        <DropletIcon w={37.5294} h={37} style={abs(30, 35)} />
        <span className="t mode-text" style={abs(79.53, 33)}>Warm</span>
      </>
    ),
  },
  { mode: 'auto', x: 788, content: <span className="t mode-text" style={abs(63.53, 33)}>Auto</span> },
  { mode: 'off', x: 1056, content: <span className="t mode-text" style={abs(76.53, 33)}>Off</span> },
]

export function Thermostat({ zone }: { zone: ZoneId }) {
  const { thermostats } = useStore()
  const dispatch = useDispatch()
  const headingRef = useScreenFocus()
  const { temp, mode } = thermostats[zone]
  const name = ZONES.find((z) => z.id === zone)!.name

  return (
    <div className="screen-fill">
      {/* Title now names the right room (the design said "Downstairs" on all three) */}
      <DetailFrame title={name} headingRef={headingRef}>
        <button
          type="button"
          className="btn round-btn"
          aria-label={`Raise temperature to ${Math.min(temp + 1, TEMP_MAX)} degrees`}
          aria-disabled={temp >= TEMP_MAX}
          onClick={() => dispatch({ type: 'nudgeTemp', zone, delta: 1 })}
          style={pos(568, 385, 67, 67)}
        >
          <TriangleIcon w={35.5387} h={28} style={abs(15.7306, 17.4851)} />
        </button>
        <button
          type="button"
          className="btn round-btn"
          aria-label={`Lower temperature to ${Math.max(temp - 1, TEMP_MIN)} degrees`}
          aria-disabled={temp <= TEMP_MIN}
          onClick={() => dispatch({ type: 'nudgeTemp', zone, delta: -1 })}
          style={pos(568, 511, 67, 67)}
        >
          <TriangleIcon w={35.5387} h={28} style={{ ...abs(15.7306, 21.5149), transform: 'rotate(180deg)' }} />
        </button>

        <div style={{ ...pos(668, 372), display: 'flex', alignItems: 'flex-start' }} aria-live="polite" aria-atomic="true">
          <span className="t t-inline" style={{ fontSize: 186 }}>{temp}<span className="sr-only"> degrees</span></span>
          <DegreeRing size={42} border={9} style={{ marginLeft: 0.45, marginTop: 44.17 }} />
        </div>

        <div role="group" aria-label="Mode">
          {MODES.map((m) => {
            const selected = m.mode === mode
            return (
              <button
                key={m.mode}
                type="button"
                className="btn mode-btn"
                aria-pressed={selected}
                aria-label={MODE_LABEL[m.mode]}
                onClick={() => dispatch({ type: 'setMode', zone, mode: m.mode })}
                style={{ ...pos(m.x, 669, 205, 108), borderRadius: 20, background: selected ? SELECTED_FILL[m.mode] : 'rgba(0, 0, 0, 0.23)' }}
              >
                {m.content}
              </button>
            )
          })}
        </div>
      </DetailFrame>
    </div>
  )
}
