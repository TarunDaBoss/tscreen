import coffeeUrl from '../assets/coffee-machine.png'
import vacuumUrl from '../assets/robot-vacuum.png'
import { abs, AddTile, DetailFrame, pos, Switch, Text } from '../components/ui'
import { STATUS_COLOR } from '../lib/design'
import { coffeeStatus, vacuumStatus } from '../lib/useHomeEffects'
import { useDispatch, useStore } from '../state/store'
import { useScreenFocus } from './useScreenFocus'

/** Status line under a switch (not in the design): live text so it also works with sound off. */
function Status({ x, text, label }: { x: number; text: string; label: string }) {
  const busy = text.endsWith('…')
  return (
    <Text x={x} y={752} w={330} size={20} align="center" style={{ color: STATUS_COLOR[text] }}>
      <span className={busy ? 'status-pulse' : undefined} role="status" aria-label={`${label}: ${text}`}>{text}</span>
    </Text>
  )
}

export function Appliances() {
  const { appliances, coffeeReady } = useStore()
  const dispatch = useDispatch()
  const headingRef = useScreenFocus()

  return (
    <div className="screen-fill">
      <DetailFrame title="Smart Appliances" headingRef={headingRef}>
        {/* Coffee */}
        <section aria-label="Coffee Machine" className="appliance-tile" style={pos(240, 293, 330, 495)}>
          <span className="t" aria-hidden="true" style={{ ...abs(108.728, 56.539), fontSize: 35 }}>Coffee</span>
          <span className="appliance-disc" style={abs(38, 121, 254, 254)}>
            <img src={coffeeUrl} alt="Coffee machine" style={abs(43, 43, 168, 168)} draggable={false} />
          </span>
        </section>
        <Switch
          x={366}
          y={695}
          checked={appliances.coffee}
          onChange={() => dispatch({ type: 'toggleAppliance', id: 'coffee' })}
          label="Coffee Machine power"
        />
        <Status x={240} text={coffeeStatus(appliances.coffee, coffeeReady)} label="Coffee Machine" />

        {/* Vacuum */}
        <section aria-label="Vacuum" className="appliance-tile" style={pos(593, 293, 330, 495)}>
          <span className="t" aria-hidden="true" style={{ ...abs(96.728, 52.539), fontSize: 35 }}>Vacuum</span>
          <span className="appliance-disc" style={abs(43, 126, 243, 243)}>
            <img src={vacuumUrl} alt="Robot vacuum" style={abs(27, 46, 190, 190)} draggable={false} />
          </span>
        </section>
        {/* Switch aligned to the Coffee switch (design had it 2px higher) */}
        <Switch
          x={719}
          y={695}
          checked={appliances.vacuum}
          onChange={() => dispatch({ type: 'toggleAppliance', id: 'vacuum' })}
          label="Vacuum power"
        />
        <Status x={593} text={vacuumStatus(appliances.vacuum)} label="Vacuum" />

        <AddTile
          x={946} y={293} w={330} h={495} radius={50} border={5} opacity={0.51}
          discX={1068} discY={498}
          label="Add an appliance"
        />
      </DetailFrame>
    </div>
  )
}
