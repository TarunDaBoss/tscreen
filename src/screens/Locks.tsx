import { LockIcon } from '../components/Icons'
import { abs, AddTile, DetailFrame, pos, Switch } from '../components/ui'
import { useDispatch, useStore, type LockId } from '../state/store'
import { useScreenFocus } from './useScreenFocus'


const DOORS: { id: LockId; name: string; x: number }[] = [
  { id: 'front', name: 'Front Door', x: 323 },
  { id: 'back', name: 'Back Door', x: 631 },
]

export function Locks() {
  const { locks } = useStore()
  const dispatch = useDispatch()
  const headingRef = useScreenFocus()
  return (
    <div className="screen-fill">
      {/* Title y aligned with the other screens (design had it 2px higher) */}
      <DetailFrame title="Smart Locks" headingRef={headingRef}>
        {DOORS.map((d) => (
          <div key={d.id}>
            <div className="lock-tile" style={pos(d.x, 357, 251, 310)} aria-hidden="true">
              <LockIcon w={141.3} h={157} style={abs(55.35, 23)} />
              <span className="t" style={{ ...abs(0, 198, 251), fontSize: 27, textAlign: 'center' }}>{d.name}</span>
            </div>
            {/* "On" knob offset unified to +23px (Back Door's was 22px in one frame) */}
            <Switch
              x={d.x + 98}
              y={597}
              size="small"
              checked={locks[d.id]}
              onChange={() => dispatch({ type: 'toggleLock', id: d.id })}
              label={`${d.name} locked`}
            />
          </div>
        ))}
        <AddTile
          x={939} y={357} w={251} h={310} radius={30} border={3}
          discX={1021} discY={469}
          label="Add a lock"
        />
      </DetailFrame>
    </div>
  )
}
