import coffeeUrl from '../assets/coffee-machine.png'
import vacuumUrl from '../assets/robot-vacuum.png'
import {
  ChevronRightIcon, DropletIcon, MoonIcon, PowerIcon, ShieldIcon, SunIcon, ThermometerIcon, WindIcon,
} from '../components/Icons'
import { abs, DegreeRing, Glass, pos, Switch, Text } from '../components/ui'
import {
  useDispatch, useStore, type HvacMode, type LightId, type ScreenId,
} from '../state/store'
import { MODE_FILL, MODE_LABEL, SECURITY_COLOR, SECURITY_LABEL, SECURITY_SHIELD, ZONES } from '../lib/design'
import { useScreenFocus } from './useScreenFocus'

const LIGHTS: { id: LightId; name: string; label?: string; x: number; y: number }[] = [
  { id: 'living', name: 'Living Room', x: 565, y: 261.552 },
  { id: 'kitchen', name: 'Kitchen', x: 717, y: 261.552 },
  { id: 'garage', name: 'Garage', x: 870.103, y: 261.552 },
  { id: 'master', name: 'Master Bedroom', label: 'Master\nBedroom', x: 1022.1, y: 261.552 },
  { id: 'office', name: 'Office Room', x: 1174, y: 261.552 },
  { id: 'bed1', name: 'Bedroom 1', x: 565, y: 404.552 },
  { id: 'common', name: 'Common Area', label: 'Common\nArea', x: 717.103, y: 404.552 },
  { id: 'bed2', name: 'Bedroom 2', x: 870.103, y: 404.552 },
  { id: 'guest', name: 'Guest Bedroom', label: 'Guest\nBedroom', x: 1022.1, y: 404.552 },
  { id: 'movie', name: 'Movie Room', x: 1174.1, y: 404.552 },
]


function ModeIcon({ mode }: { mode: HvacMode }) {
  switch (mode) {
    case 'cool': return <WindIcon w={37.5294} h={44} style={abs(12, 22)} />
    case 'warm': return <DropletIcon w={32} h={32} style={abs(12, 32)} />
    case 'auto': return <ThermometerIcon w={34} h={34} style={abs(11, 31)} />
    case 'off': return <PowerIcon w={32} h={32} style={abs(12, 32)} />
  }
}

function ThermostatTile({ zone }: { zone: (typeof ZONES)[number] }) {
  const { thermostats } = useStore()
  const dispatch = useDispatch()
  const t = thermostats[zone.id]
  const id = `tile-${zone.id}`
  return (
    <button
      type="button"
      id={id}
      className="btn tile"
      aria-label={`${zone.name} thermostat: ${t.temp} degrees, ${MODE_LABEL[t.mode]}. Open.`}
      onClick={() => dispatch({ type: 'navigate', screen: zone.screen, returnFocus: id })}
      style={{ ...pos(237, zone.y, 231, 112), borderRadius: 21, background: MODE_FILL[t.mode] }}
    >
      <ModeIcon mode={t.mode} />
      <span style={{ ...abs(zone.tempX, 16), display: 'flex', alignItems: 'flex-start' }} aria-hidden="true">
        <span className="t t-inline" style={{ fontSize: 55 }}>{t.temp}</span>
        <DegreeRing size={19} border={4} style={{ marginLeft: 1, marginTop: 12 }} />
      </span>
      <span className="t" aria-hidden="true" style={{ ...abs(zone.labelX, zone.labelY), fontSize: 17 }}>{zone.name}</span>
      <ChevronRightIcon w={36} h={37.7143} style={{ ...abs(194.773, 37.1429), opacity: 0.8 }} />
    </button>
  )
}

function LightButton({ light }: { light: (typeof LIGHTS)[number] }) {
  const { lights } = useStore()
  const dispatch = useDispatch()
  const on = lights[light.id]
  return (
    <button
      type="button"
      className={`btn light ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      aria-label={`${light.name} light`}
      onClick={() => dispatch({ type: 'toggleLight', id: light.id })}
      style={pos(light.x, light.y, 73.8968, 73.8968)}
    >
      <SunIcon w={38} h={38} className="light-icon light-sun" style={abs(18, 18.4484)} />
      <MoonIcon w={37} h={37} color="#7B7B7B" className="light-icon light-moon" style={abs(18.8968, 19.4484)} />
      <span className="t light-label" aria-hidden="true">{light.label ?? light.name}</span>
    </button>
  )
}

export function ControlPanel() {
  const { security, appliances, goodnight } = useStore()
  const dispatch = useDispatch()
  const headingRef = useScreenFocus()
  const go = (screen: ScreenId, returnFocus: string) => dispatch({ type: 'navigate', screen, returnFocus })

  return (
    <div className="screen-fill">
      <h1 className="sr-only" tabIndex={-1} ref={headingRef}>Control Panel</h1>

      {/* Thermostats */}
      <Glass x={210} y={193} w={286} h={509} />
      <section aria-labelledby="h-thermostats">
        <Text as="h2" id="h-thermostats" x={210} y={219} w={286} size={28} weight={600} align="center">Thermostats</Text>
        {ZONES.map((z) => <ThermostatTile key={z.id} zone={z} />)}
      </section>

      {/* Goodnight Mode */}
      <Glass x={210} y={719} w={286} h={119} />
      <Switch
        x={232}
        y={757}
        checked={goodnight}
        onChange={() => dispatch({ type: 'toggleGoodnight' })}
        label="Goodnight Mode (turns off all lights and sets security to Stay)"
        knobContent={<MoonIcon w={24} h={24} color="#000000" style={abs(9, 9)} />}
      />
      <Text x={331} y={745} size={28} weight={600} style={{ whiteSpace: 'pre' }}>
        <span aria-hidden="true">{'Goodnight\nMode'}</span>
      </Text>

      {/* Lights */}
      <Glass x={512} y={193} w={787} h={372} />
      <section aria-labelledby="h-lights">
        <Text as="h2" id="h-lights" x={512} y={211} w={787} size={28} weight={600} align="center">Lights</Text>
        {LIGHTS.map((l) => <LightButton key={l.id} light={l} />)}
      </section>

      {/* Security System */}
      <button
        type="button"
        id="card-security"
        className="btn glass card-btn"
        aria-label={`Security System: ${SECURITY_LABEL[security]}. Open.`}
        onClick={() => go('security', 'card-security')}
        style={{ ...pos(512, 583, 255, 255), borderRadius: 31 }}
      >
        <ShieldIcon w={127} h={129} color={SECURITY_SHIELD[security]} style={{ ...abs(9.5, 21), transition: 'stroke .3s' }} />
        <span className="t" aria-hidden="true" style={{ ...abs(135, 32), fontSize: 22, fontWeight: 600, color: SECURITY_COLOR[security], transition: 'color .3s' }}>
          {SECURITY_LABEL[security]}
        </span>
        <span className="t" aria-hidden="true" style={{ ...abs(29, 161), fontSize: 30, fontWeight: 600, whiteSpace: 'pre' }}>
          {'Security\nSystem'}
        </span>
        <ChevronRightIcon w={53} h={53} style={abs(170, 174)} />
      </button>

      {/* Appliances */}
      <button
        type="button"
        id="card-appliances"
        className="btn glass card-btn"
        aria-label={`Appliances: Coffee Machine ${appliances.coffee ? 'On' : 'Off'}, Vacuum ${appliances.vacuum ? 'On' : 'Off'}. Open.`}
        onClick={() => go('appliances', 'card-appliances')}
        style={{ ...pos(783, 583, 516, 255), borderRadius: 31 }}
      >
        {/* Title unified to 28pt (was 22pt), kept centered at the same point */}
        <span className="t" aria-hidden="true" style={{ ...abs(0, 7, 516), fontSize: 28, fontWeight: 600, textAlign: 'center' }}>Appliances</span>

        <span className="appliance-disc" style={abs(53.5, 58, 129, 129)}>
          <img src={coffeeUrl} alt="" style={abs(22.2167, 21.8583, 85.2833, 85.2833)} draggable={false} />
        </span>
        <span className="t" aria-hidden="true" style={{ ...abs(0, 196, 236), fontSize: 16, textAlign: 'center' }}>Coffee Machine</span>
        <span className="t" aria-hidden="true" style={{ ...abs(0, 221, 236), fontSize: 11, textAlign: 'center' }}>{appliances.coffee ? 'On' : 'Off'}</span>

        <span className="appliance-disc" style={abs(229.5, 58, 129, 129)}>
          <img src={vacuumUrl} alt="" style={abs(14.5, 24.5, 101, 101)} draggable={false} />
        </span>
        <span className="t" aria-hidden="true" style={{ ...abs(176, 196, 236), fontSize: 16, textAlign: 'center' }}>Vacuum</span>
        <span className="t" aria-hidden="true" style={{ ...abs(176, 221, 236), fontSize: 11, textAlign: 'center' }}>{appliances.vacuum ? 'On' : 'Off'}</span>

        <ChevronRightIcon w={53} h={53} style={abs(409, 101)} />
      </button>
    </div>
  )
}
