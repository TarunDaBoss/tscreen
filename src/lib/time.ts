// Scene time is measured in minutes from midnight of the "scene day".
// The time slider runs from 5:00 AM (Morning) to 4:59 AM the next day (Night),
// so values go from 300 to 1739.
export const SLIDER_MIN = 5 * 60
export const SLIDER_MAX = SLIDER_MIN + 24 * 60 - 1

export type SkyStage = 'morning' | 'afternoon' | 'sunset' | 'night'
export const SKY_STAGES: SkyStage[] = ['morning', 'afternoon', 'sunset', 'night']

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
// Matches the design's "Sept 12" abbreviation style.
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** The visitor's real local time, expressed on the slider's scale. */
export function realSceneMinutes(now = new Date()): number {
  const m = now.getHours() * 60 + now.getMinutes()
  return m < SLIDER_MIN ? m + 24 * 60 : m
}

export function clockParts(sceneMinutes: number): { time: string; ampm: 'AM' | 'PM' } {
  const m = ((sceneMinutes % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const min = m % 60
  const h12 = h24 % 12 || 12
  return { time: `${h12}:${String(min).padStart(2, '0')}`, ampm: h24 >= 12 ? 'PM' : 'AM' }
}

export function clockLabel(sceneMinutes: number): string {
  const { time, ampm } = clockParts(sceneMinutes)
  return `${time} ${ampm}`
}

/** The calendar date shown for a given slider position. */
export function sceneDate(sceneMinutes: number, now = new Date()): Date {
  const d = new Date(now)
  // Before 5 AM the slider's "day" began yesterday.
  if (now.getHours() * 60 + now.getMinutes() < SLIDER_MIN) d.setDate(d.getDate() - 1)
  if (sceneMinutes >= 1440) d.setDate(d.getDate() + 1)
  return d
}

function ordinal(n: number): string {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}

/** "Wednesday, September 12th" */
export function longDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${ordinal(d.getDate())}`
}

/** "Sept 12" */
export function shortDate(d: Date): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`
}

export function skyStage(sceneMinutes: number): SkyStage {
  const h = (sceneMinutes % 1440) / 60
  if (h >= 5 && h < 11) return 'morning'
  if (h >= 11 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'sunset'
  return 'night'
}
