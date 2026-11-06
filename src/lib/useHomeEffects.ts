import { useEffect, useRef } from 'react'
import { useDispatch, useStore } from '../state/store'
import { playSound, preloadSounds, SECURITY_VOICE, stopAllSounds, stopSound, stopVoices } from './sound'

const BREW_MS = 4000

/**
 * Side effects of state changes: sounds (only when sound is on) and the coffee
 * brewing timer (always, so the on-screen status works with sound off).
 */
export function useHomeEffects() {
  const { security, appliances, soundOn, coffeeReady } = useStore()
  const dispatch = useDispatch()
  const prev = useRef({ security, coffee: appliances.coffee, vacuum: appliances.vacuum })

  // Sounds follow state changes, wherever they came from (tiles, keypad, Goodnight Mode).
  useEffect(() => {
    const p = prev.current
    if (soundOn) {
      if (security !== p.security) {
        stopVoices()
        playSound(SECURITY_VOICE[security])
      }
      if (appliances.coffee && !p.coffee) playSound('coffee')
      if (appliances.vacuum && !p.vacuum) playSound('vacuum')
    }
    if (!appliances.coffee && p.coffee) stopSound('coffee')
    if (!appliances.vacuum && p.vacuum) stopSound('vacuum')
    prev.current = { security, coffee: appliances.coffee, vacuum: appliances.vacuum }
  }, [security, appliances.coffee, appliances.vacuum, soundOn])

  useEffect(() => {
    if (soundOn) preloadSounds()
    else stopAllSounds()
  }, [soundOn])

  // Coffee: "Brewing…" for 4 seconds, then "Ready".
  useEffect(() => {
    if (!appliances.coffee || coffeeReady) return
    const t = window.setTimeout(() => dispatch({ type: 'coffeeReady' }), BREW_MS)
    return () => window.clearTimeout(t)
  }, [appliances.coffee, coffeeReady, dispatch])
}

export function coffeeStatus(on: boolean, ready: boolean): string {
  if (!on) return 'Off'
  return ready ? 'Ready' : 'Brewing…'
}

export function vacuumStatus(on: boolean): string {
  return on ? 'Cleaning…' : 'Off'
}
