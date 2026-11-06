import coffeeUrl from '../assets/sounds/coffee-brewing.mp3'
import vacuumUrl from '../assets/sounds/vacuum-start.mp3'
import awayUrl from '../assets/sounds/voice-armed-away.mp3'
import stayUrl from '../assets/sounds/voice-armed-stay.mp3'
import disarmedUrl from '../assets/sounds/voice-disarmed.mp3'
import type { SecurityMode } from '../state/store'

// Credits for every file are in SOUNDS.md.
const CLIPS = {
  'voice-disarmed': disarmedUrl,
  'voice-stay': stayUrl,
  'voice-away': awayUrl,
  coffee: coffeeUrl,
  vacuum: vacuumUrl,
} as const

export type ClipName = keyof typeof CLIPS

export const SECURITY_VOICE: Record<SecurityMode, ClipName> = {
  disarmed: 'voice-disarmed',
  stay: 'voice-stay',
  away: 'voice-away',
}

const players = new Map<ClipName, HTMLAudioElement>()

function player(name: ClipName): HTMLAudioElement {
  let a = players.get(name)
  if (!a) {
    a = new Audio(CLIPS[name])
    a.preload = 'auto'
    players.set(name, a)
  }
  return a
}

/** Load every clip so the first play is instant (called when sound is turned on). */
export function preloadSounds() {
  for (const name of Object.keys(CLIPS) as ClipName[]) player(name).load()
}

export function playSound(name: ClipName) {
  const a = player(name)
  a.currentTime = 0
  // Browsers may refuse playback before a user gesture; the sound is optional, so ignore that.
  a.play().catch(() => {})
}

export function stopSound(name: ClipName) {
  const a = players.get(name)
  if (!a) return
  a.pause()
  a.currentTime = 0
}

export function stopVoices() {
  stopSound('voice-disarmed')
  stopSound('voice-stay')
  stopSound('voice-away')
}

export function stopAllSounds() {
  for (const name of players.keys()) stopSound(name)
}
