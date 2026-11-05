import { useEffect, useRef, useState } from 'react'
import { CameraIcon, LockIcon, ShieldIcon } from '../components/Icons'
import { abs, DetailFrame, pos } from '../components/ui'
import { useDispatch, useStore, type SecurityMode } from '../state/store'
import { SECURITY_LABEL } from '../lib/design'
import { useScreenFocus } from './useScreenFocus'


const TILES: { mode: SecurityMode; x: number; selectedFill: string; shield: string; selectedShield: string }[] = [
  { mode: 'disarmed', x: 258, selectedFill: 'rgba(0, 255, 43, 0.45)', shield: '#15AD00', selectedShield: '#E6E6E6' },
  { mode: 'stay', x: 602, selectedFill: '#FF6300', shield: '#FF6300', selectedShield: '#FFFFFF' },
  { mode: 'away', x: 946, selectedFill: '#FF0000', shield: '#FF0000', selectedShield: '#F7F7F7' },
]

function EmergencyDialog({ onClose }: { onClose: () => void }) {
  const okRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { okRef.current?.focus({ preventScroll: true }) }, [])
  return (
    <div
      className="dialog-backdrop"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.stopPropagation(); onClose() }
        // Only one control inside, so keep Tab on it (focus trap).
        if (e.key === 'Tab') { e.preventDefault(); okRef.current?.focus() }
      }}
    >
      <div
        className="dialog glass"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
        aria-describedby="emergency-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="dialog-alert" aria-hidden="true">!</span>
        <h2 id="emergency-title" className="t dialog-title">Emergency</h2>
        <p id="emergency-desc" className="t dialog-text">This is a demo, no call will be made.</p>
        <button ref={okRef} type="button" className="btn dialog-ok" onClick={onClose}>OK</button>
      </div>
    </div>
  )
}

export function Security() {
  const { security } = useStore()
  const dispatch = useDispatch()
  const headingRef = useScreenFocus()
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const emergencyRef = useRef<HTMLButtonElement>(null)

  const closeEmergency = () => setEmergencyOpen(false)

  // Return focus to the Emergency button once the dialog is gone and the page is no longer inert.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !emergencyOpen) emergencyRef.current?.focus({ preventScroll: true })
    wasOpen.current = emergencyOpen
  }, [emergencyOpen])

  return (
    <div className="screen-fill">
      <div inert={emergencyOpen} aria-hidden={emergencyOpen || undefined}>
        <DetailFrame title="Security System" headingRef={headingRef}>
          <div role="group" aria-label="Security mode">
            {TILES.map((t) => {
              const selected = security === t.mode
              return (
                <button
                  key={t.mode}
                  type="button"
                  className="btn security-tile"
                  aria-pressed={selected}
                  onClick={() => dispatch({ type: 'setSecurity', mode: t.mode })}
                  style={{ ...pos(t.x, 348, 309, 309), borderRadius: 50, background: selected ? t.selectedFill : 'rgba(0, 0, 0, 0.25)' }}
                >
                  <ShieldIcon w={205.76} h={209} color={selected ? t.selectedShield : t.shield} style={abs(51.12, 25)} />
                  <span className="t" style={{ ...abs(0, 243.39, 309), fontSize: 35, textAlign: 'center' }}>{SECURITY_LABEL[t.mode]}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            id="btn-cameras"
            className="btn pill-btn"
            onClick={() => dispatch({ type: 'navigate', screen: 'cameras' })}
            style={pos(261, 704, 302, 75)}
          >
            <CameraIcon w={68} h={47} style={abs(52, 14)} />
            <span className="t" style={{ ...abs(129, 20), fontSize: 29 }}>Cameras</span>
          </button>

          <button
            ref={emergencyRef}
            type="button"
            className="btn pill-btn"
            aria-haspopup="dialog"
            onClick={() => setEmergencyOpen(true)}
            style={pos(605, 704, 302, 75)}
          >
            <span className="emergency-ring" aria-hidden="true" style={abs(47, 17, 40, 40)}>!</span>
            <span className="t" style={{ ...abs(102, 19), fontSize: 29, color: '#FF3636' }}>Emergency</span>
          </button>

          <button
            type="button"
            className="btn pill-btn"
            onClick={() => dispatch({ type: 'navigate', screen: 'locks' })}
            style={pos(949, 704, 302, 75)}
          >
            <LockIcon w={54} h={60} style={abs(34, -3)} />
            <span className="t" style={{ ...abs(96, 19), fontSize: 29 }}>Smart Locks</span>
          </button>
        </DetailFrame>
      </div>
      {emergencyOpen && <EmergencyDialog onClose={closeEmergency} />}
    </div>
  )
}
