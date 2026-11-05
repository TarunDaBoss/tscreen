import { useEffect, useState, type CSSProperties } from 'react'
import { Device } from './components/Device'
import { Sky } from './components/Sky'
import { clockLabel, SLIDER_MAX, SLIDER_MIN, skyStage } from './lib/time'
import { StoreProvider, useDispatch, useStore } from './state/store'

const CANVAS_W = 1512
const CANVAS_H = 982
/** The time slider tucks into the empty band under the device (canvas y 918 onward). */
const TUCK = 64
const CONTROLS_H = 64
const NOTE_H = 30
const NARROW = 640

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight })
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const onResize = () => setVp(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/** Advances the scene clock by one minute each time the real clock does. */
function useRealTimeTick() {
  const dispatch = useDispatch()
  useEffect(() => {
    let last = new Date().getMinutes()
    const id = window.setInterval(() => {
      const m = new Date().getMinutes()
      if (m !== last) {
        last = m
        dispatch({ type: 'tick' })
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [dispatch])
}

/**
 * SVG filters for the night look.
 * night-room: the design's color controls on the GN-mode photo
 *   (saturation 1.08, brightness −0.272, contrast 1.323, hue −180°).
 * night-home: the design has no night Home screen; a hue flip would turn the trees
 *   purple, so the house photo gets a darkened blue moonlight grade instead.
 */
function NightFilters() {
  const slope = 1.32293314873418
  const intercept = (-0.272399129746835 - 0.5) * slope + 0.5
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="night-room" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="1.0801522943038" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={slope} intercept={intercept} />
          <feFuncG type="linear" slope={slope} intercept={intercept} />
          <feFuncB type="linear" slope={slope} intercept={intercept} />
        </feComponentTransfer>
        <feColorMatrix type="hueRotate" values="180" />
      </filter>
      <filter id="night-home" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.16 0.20 0.06 0 0.00
                  0.14 0.26 0.08 0 0.01
                  0.16 0.30 0.24 0 0.04
                  0    0    0    1 0"
        />
      </filter>
    </svg>
  )
}

function TimeSlider() {
  const { sceneMinutes } = useStore()
  const dispatch = useDispatch()
  const label = clockLabel(sceneMinutes)
  return (
    <div className="time-control">
      <label htmlFor="time-slider" className="sr-only">Time of day</label>
      <span className="time-end" aria-hidden="true">Morning</span>
      <input
        id="time-slider"
        type="range"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={1}
        value={sceneMinutes}
        aria-valuetext={label}
        onChange={(e) => dispatch({ type: 'setTime', minutes: Number(e.target.value) })}
        onKeyDown={(e) => {
          // Arrow keys move 15 minutes, Page Up/Down one hour (native step is 1 minute).
          const step = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 60, PageDown: -60 }[e.key]
          if (step) {
            e.preventDefault()
            dispatch({ type: 'setTime', minutes: sceneMinutes + step })
          }
        }}
        style={{ '--fill': `${((sceneMinutes - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%` } as CSSProperties}
      />
      <span className="time-end" aria-hidden="true">Night</span>
      <output htmlFor="time-slider" className="time-readout" aria-hidden="true">{label}</output>
    </div>
  )
}

function Scene() {
  const { sceneMinutes, goodnight, lights } = useStore()
  const { w, h } = useViewport()
  useRealTimeTick()

  const stage = skyStage(sceneMinutes)
  const nightTime = stage === 'night'
  const night = goodnight || nightTime
  const lightsOn = Object.values(lights).filter(Boolean).length
  const glow = nightTime && lightsOn > 0 ? Math.min(1, 0.35 + lightsOn * 0.065) : 0

  const narrow = w < NARROW
  const reserved = CONTROLS_H + (narrow ? NOTE_H : 0) + 8
  const s = Math.max(0.1, Math.min(w / CANVAS_W, (h - reserved) / (CANVAS_H - TUCK)))

  return (
    <div className="app" style={{ '--s': s } as CSSProperties}>
      <Sky stage={stage} />
      <NightFilters />
      <div className="stage-wrap" style={{ width: CANVAS_W * s, height: CANVAS_H * s }}>
        <div className="stage" style={{ transform: `scale(${s})` }}>
          <div className="device-glow" style={{ opacity: glow }} aria-hidden="true" />
          <Device night={night} />
        </div>
      </div>
      <div className="controls" style={{ marginTop: -TUCK * s }}>
        <TimeSlider />
      </div>
      {narrow && <p className="narrow-note">Best viewed on a larger screen</p>}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Scene />
    </StoreProvider>
  )
}
