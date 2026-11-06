import type { CSSProperties, ReactNode } from 'react'

// Line icons from the design's Symbols page (Feather icon set, MIT).
// Sketch stretches each 24×24 symbol to its instance frame, strokes included,
// so these SVGs use preserveAspectRatio="none" and let the stroke scale too.

interface IconProps {
  w: number
  h: number
  color?: string
  style?: CSSProperties
  className?: string
}

function Svg({ w, h, color = '#fff', style, className, children, viewBox = '0 0 24 24' }: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      width={w}
      height={h}
      viewBox={viewBox}
      preserveAspectRatio="none"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={style}
      className={className}
    >
      {children}
    </svg>
  )
}

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Svg>
)

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
)

export const WindIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </Svg>
)

export const DropletIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </Svg>
)

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="9 18 15 12 9 6" />
  </Svg>
)

export const NavigationIcon = (p: IconProps) => (
  <Svg {...p}>
    <polygon points="12 2 19 21 12 17 5 21 12 2" />
  </Svg>
)

// Not in the design: used only for the Auto and Off thermostat tiles, which have no drawn state.
export const ThermometerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </Svg>
)

export const PowerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </Svg>
)

/** "Camera" symbol: rounded body + rounded triangle lens (88×47 master). */
export const CameraIcon = ({ w, h, color = '#fff', style }: IconProps) => (
  <svg width={w} height={h} viewBox="0 0 88 47" preserveAspectRatio="none" aria-hidden="true" focusable="false" style={style}>
    <rect x="0" y="0" width="62" height="47" rx="10" fill={color} />
    <polygon points="49,23.5 86,5.5 86,41.5" fill={color} stroke={color} strokeWidth="4" strokeLinejoin="round" />
  </svg>
)

/** "Lock" symbol, drawn at the Smart Locks screen size (141.3×157) and scaled for other uses. */
export const LockIcon = ({ w, h, color = '#fff', style }: IconProps) => (
  <svg width={w} height={h} viewBox="0 0 141.3 157" preserveAspectRatio="none" aria-hidden="true" focusable="false" style={style}>
    {/* Shackle: the design's triangle with corner radius 70 renders as a dome on short straight legs */}
    <path d="M32.15 80 V62 A39.5 20.5 0 0 1 111.15 62 V80" fill="none" stroke={color} strokeWidth="5" />
    <rect x="20.65" y="77.5" width="99.4" height="79.5" rx="12" fill={color} />
  </svg>
)

/** Rounded triangle used by the raise/lower temperature buttons (35.54×28, corner radius 3). */
export const TriangleIcon = ({ w, h, color = '#fff', style }: IconProps) => (
  <svg width={w} height={h} viewBox="0 0 35.54 28" aria-hidden="true" focusable="false" style={style}>
    <polygon points="17.77,2.2 33.6,26.3 1.94,26.3" fill={color} stroke={color} strokeWidth="3.6" strokeLinejoin="round" />
  </svg>
)

/** Back arrow: a 29px, 3px-thick line with Sketch's "filled arrow" end marker. */
export const BackArrowIcon = ({ color = '#fff', style }: { color?: string; style?: CSSProperties }) => (
  <svg width="32" height="16" viewBox="0 0 32 16" aria-hidden="true" focusable="false" style={style}>
    <line x1="30" y1="8" x2="10" y2="8" stroke={color} strokeWidth="3" />
    <polygon points="1,8 12,1.5 12,14.5" fill={color} />
  </svg>
)

export const VolumeOffIcon = (p: IconProps) => (
  <Svg {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </Svg>
)

export const VolumeOnIcon = (p: IconProps) => (
  <Svg {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </Svg>
)
