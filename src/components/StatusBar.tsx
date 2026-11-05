import { clockLabel, sceneDate, shortDate, skyStage } from '../lib/time'
import { useStore } from '../state/store'
import { MoonIcon, NavigationIcon, SunIcon } from './Icons'
import { DegreeRing, pos } from './ui'

/** Top bar shared by the Control Panel and every detail screen. */
export function StatusBar() {
  const { sceneMinutes } = useStore()
  const isNightTime = skyStage(sceneMinutes) === 'night'
  const when = `${shortDate(sceneDate(sceneMinutes))}  ${clockLabel(sceneMinutes)}`
  return (
    <div className="status-bar" role="group" aria-label={`${isNightTime ? 'Clear' : 'Sunny'}, 49 degrees, Apex, North Carolina. ${when}`}>
      {isNightTime
        ? <MoonIcon w={28} h={28} color="#FFB02F" style={pos(203, 148)} />
        : <SunIcon w={32} h={32} color="#FFB02F" style={pos(201, 146)} />}
      <span className="t status-text" aria-hidden="true" style={pos(242, 149)}>49</span>
      <DegreeRing size={7} border={2} style={pos(270, 153)} />
      <span className="t status-text" aria-hidden="true" style={pos(293, 149)}>Apex, North Carolina</span>
      <NavigationIcon w={20} h={20} style={{ ...pos(515.187, 149.296), transform: 'rotate(39deg)' }} />
      {/* Right-aligned to the design's right edge (x 1314) so any time fits */}
      <span className="t status-text" aria-hidden="true" style={{ ...pos(1014, 146, 300), textAlign: 'right', whiteSpace: 'pre' }}>
        {when}
      </span>
    </div>
  )
}
