import backdoorUrl from '../assets/cam-backdoor.jpg'
import frontDoorUrl from '../assets/cam-front-door.jpg'
import garageUrl from '../assets/cam-garage.jpg'
import { DetailFrame, pos, Text } from '../components/ui'
import { useScreenFocus } from './useScreenFocus'

const CAMS = [
  { name: 'Front Door', src: frontDoorUrl, x: 303, y: 262, labelX: 471, labelY: 507 },
  { name: 'Backdoor', src: backdoorUrl, x: 767.164, y: 262, labelX: 948, labelY: 507 },
  // x aligned with Front Door (design had it at 304.86)
  { name: 'Garage', src: garageUrl, x: 303, y: 548.872, labelX: 486, labelY: 794 },
]

export function Cameras() {
  const headingRef = useScreenFocus()
  return (
    <div className="screen-fill">
      <DetailFrame title="Cameras" titleY={218} headingRef={headingRef}>
        <ul className="plain-list" aria-label="Camera feeds">
          {CAMS.map((c) => (
            <li key={c.name}>
              <figure style={{ margin: 0 }}>
                <img
                  src={c.src}
                  alt={`${c.name} camera feed`}
                  className="camera-feed"
                  style={pos(c.x, c.y, 441.84, 238.128)}
                  draggable={false}
                />
                <Text x={c.labelX} y={c.labelY} size={18}>
                  <figcaption style={{ display: 'inline' }}>{c.name}</figcaption>
                </Text>
              </figure>
            </li>
          ))}
        </ul>
      </DetailFrame>
    </div>
  )
}
