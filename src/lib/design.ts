import type { HvacMode, ScreenId, SecurityMode, ZoneId } from '../state/store'

// Design values shared by several screens (from the Sketch file; Auto/Off fills are extrapolated).

export const MODE_LABEL: Record<HvacMode, string> = { cool: 'Cool', warm: 'Warm', auto: 'Auto', off: 'Off' }

/** Tile/button fill for each thermostat mode. Cool and Warm come from the design; Auto and Off are extrapolated. */
export const MODE_FILL: Record<HvacMode, string> = {
  cool: 'rgba(0, 177, 255, 0.55)',
  warm: 'rgba(255, 104, 0, 0.55)',
  auto: 'linear-gradient(135deg, rgba(0, 177, 255, 0.55), rgba(255, 104, 0, 0.55))',
  off: 'rgba(0, 0, 0, 0.23)',
}

export const SECURITY_COLOR: Record<SecurityMode, string> = {
  disarmed: '#44E83D',
  stay: '#FF6300',
  away: '#FF0000',
}
export const SECURITY_SHIELD: Record<SecurityMode, string> = { disarmed: '#40C938', stay: '#FF6300', away: '#FF0000' }
export const SECURITY_LABEL: Record<SecurityMode, string> = { disarmed: 'Disarmed', stay: 'Stay', away: 'Away' }

export const ZONES: { id: ZoneId; name: string; y: number; tempX: number; labelX: number; labelY: number; screen: ScreenId }[] = [
  { id: 'downstairs', name: 'Downstairs', y: 275, tempX: 64, labelX: 70, labelY: 82, screen: 'thermo-downstairs' },
  { id: 'upstairs', name: 'Upstairs', y: 414, tempX: 63, labelX: 72, labelY: 81, screen: 'thermo-upstairs' },
  { id: 'basement', name: 'Basement', y: 553, tempX: 63, labelX: 70, labelY: 81, screen: 'thermo-basement' },
]


/** Appliance status text colors (not in the design; "Off" keeps the design's white). */
export const STATUS_COLOR: Record<string, string> = {
  Off: '#FFFFFF',
  'Brewing…': '#FFB02F',
  Ready: '#44E83D',
  'Cleaning…': '#6FD3FF',
}
