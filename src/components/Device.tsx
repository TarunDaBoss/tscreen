import { useCallback, useState } from 'react'
import roomUrl from '../assets/room.jpg'
import { Appliances } from '../screens/Appliances'
import { Cameras } from '../screens/Cameras'
import { ControlPanel } from '../screens/ControlPanel'
import { Home } from '../screens/Home'
import { Locks } from '../screens/Locks'
import { Security } from '../screens/Security'
import { Thermostat } from '../screens/Thermostat'
import { useDispatch, useStore, type ScreenId } from '../state/store'
import { VolumeOffIcon, VolumeOnIcon } from './Icons'
import { StatusBar } from './StatusBar'
import { ScreenTransition } from './Transition'
import { pos } from './ui'

type Outer = 'home' | 'inside'
type Inner = Exclude<ScreenId, 'home'>

const outerDepth = (k: Outer) => (k === 'home' ? 0 : 1)
const innerDepth = (k: Inner) => (k === 'panel' ? 0 : 1)

function renderInner(k: Inner) {
  switch (k) {
    case 'panel': return <ControlPanel />
    case 'thermo-downstairs': return <Thermostat zone="downstairs" />
    case 'thermo-upstairs': return <Thermostat zone="upstairs" />
    case 'thermo-basement': return <Thermostat zone="basement" />
    case 'security': return <Security />
    case 'appliances': return <Appliances />
    case 'cameras': return <Cameras />
    case 'locks': return <Locks />
  }
}

/** Room photo (1165×749 at y −5.58, as in the design) + night version + gradient overlay. */
function RoomBackground({ night }: { night: boolean }) {
  return (
    <div className="backdrop" aria-hidden="true">
      <img src={roomUrl} alt="" className="bg-img" style={pos(174, 121.423, 1165, 749.026)} draggable={false} />
      <img src={roomUrl} alt="" className={`bg-img night-room ${night ? 'is-on' : ''}`} style={pos(174, 121.423, 1165, 749.026)} draggable={false} />
      <div className="gradient-room" />
    </div>
  )
}

/** Control Panel + detail screens share one background and status bar. */
function Inside({ night }: { night: boolean }) {
  // While this layer animates out to Home, it keeps showing the screen it had.
  const { lastInside } = useStore()
  return (
    <div className="screen-fill">
      <RoomBackground night={night} />
      <ScreenTransition
        screenKey={lastInside}
        depth={innerDepth}
        render={renderInner}
        variant="zoom"
        backdrop={<RoomBackground night={night} />}
      />
      <StatusBar />
    </div>
  )
}

/** The 1512×982 canvas: bezel, screen, and the "Tscreen" label (which doubles as a Home button). */
export function Device({ night }: { night: boolean }) {
  const { screen } = useStore()
  const dispatch = useDispatch()
  const outer: Outer = screen === 'home' ? 'home' : 'inside'
  const renderOuter = useCallback(
    (k: Outer) => (k === 'home' ? <Home night={night} /> : <Inside night={night} />),
    [night],
  )

  return (
    <>
      <div className="bezel" />
      <main className="screen" aria-label="TScreen smart home display">
        <ScreenTransition screenKey={outer} depth={outerDepth} render={renderOuter} variant="unlock" />
      </main>
      <button
        type="button"
        className="btn bezel-home"
        aria-label="Go to Home screen"
        title="Home"
        onClick={() => dispatch({ type: 'navigate', screen: 'home' })}
        disabled={screen === 'home'}
      >
        Tscreen
      </button>
      <SoundButton />
    </>
  )
}

/** Speaker button on the bezel (not in the design). Starts muted; the choice lasts while the page is open. */
function SoundButton() {
  const { soundOn } = useStore()
  const dispatch = useDispatch()
  const [tip, setTip] = useState(false)
  const label = soundOn ? 'Turn off sound' : 'Turn on sound'
  const Icon = soundOn ? VolumeOnIcon : VolumeOffIcon
  return (
    <>
      <button
        type="button"
        className="btn bezel-sound"
        aria-label={label}
        aria-pressed={soundOn}
        onClick={() => dispatch({ type: 'toggleSound' })}
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        onFocus={() => setTip(true)}
        onBlur={() => setTip(false)}
      >
        <Icon w={24} h={24} color={soundOn ? '#FFFFFF' : '#BDBDBD'} />
      </button>
      <span className={`bezel-tip ${tip ? 'is-open' : ''}`} aria-hidden="true">{label}</span>
    </>
  )
}
