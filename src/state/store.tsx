import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { realSceneMinutes, SLIDER_MAX, SLIDER_MIN } from '../lib/time'

export type LightId =
  | 'living' | 'kitchen' | 'garage' | 'master' | 'office'
  | 'bed1' | 'common' | 'bed2' | 'guest' | 'movie'
export type ZoneId = 'downstairs' | 'upstairs' | 'basement'
export type HvacMode = 'cool' | 'warm' | 'auto' | 'off'
export type SecurityMode = 'disarmed' | 'stay' | 'away'
export type ApplianceId = 'coffee' | 'vacuum'
export type LockId = 'front' | 'back'

export type ScreenId =
  | 'home' | 'panel'
  | 'thermo-downstairs' | 'thermo-upstairs' | 'thermo-basement'
  | 'security' | 'appliances' | 'cameras' | 'locks'

export const TEMP_MIN = 50
export const TEMP_MAX = 90

export interface State {
  screen: ScreenId
  /** id of the element that opened the current screen, focused again on return */
  returnFocus: string | null
  /** false until the visitor first navigates, so the page doesn't steal focus on load */
  hasNavigated: boolean
  lights: Record<LightId, boolean>
  thermostats: Record<ZoneId, { temp: number; mode: HvacMode }>
  security: SecurityMode
  appliances: Record<ApplianceId, boolean>
  locks: Record<LockId, boolean>
  goodnight: boolean
  sceneMinutes: number
}

// Starting state = the base "Control Panels Screen" frame of the design.
export const initialState = (): State => ({
  screen: 'home',
  returnFocus: null,
  hasNavigated: false,
  lights: {
    living: true, kitchen: true, garage: false, master: false, office: true,
    bed1: true, common: false, bed2: false, guest: false, movie: false,
  },
  thermostats: {
    downstairs: { temp: 69, mode: 'cool' },
    upstairs: { temp: 67, mode: 'cool' },
    basement: { temp: 56, mode: 'warm' },
  },
  security: 'disarmed',
  appliances: { coffee: false, vacuum: false },
  locks: { front: false, back: false },
  goodnight: false,
  sceneMinutes: realSceneMinutes(),
})

export type Action =
  | { type: 'navigate'; screen: ScreenId; returnFocus?: string | null }
  | { type: 'toggleLight'; id: LightId }
  | { type: 'nudgeTemp'; zone: ZoneId; delta: 1 | -1 }
  | { type: 'setMode'; zone: ZoneId; mode: HvacMode }
  | { type: 'setSecurity'; mode: SecurityMode }
  | { type: 'toggleAppliance'; id: ApplianceId }
  | { type: 'toggleLock'; id: LockId }
  | { type: 'toggleGoodnight' }
  | { type: 'setTime'; minutes: number }
  | { type: 'tick' }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'navigate':
      return {
        ...state,
        screen: action.screen,
        returnFocus: action.returnFocus ?? null,
        hasNavigated: true,
      }
    case 'toggleLight':
      return { ...state, lights: { ...state.lights, [action.id]: !state.lights[action.id] } }
    case 'nudgeTemp': {
      const t = state.thermostats[action.zone]
      return {
        ...state,
        thermostats: {
          ...state.thermostats,
          [action.zone]: { ...t, temp: clamp(t.temp + action.delta, TEMP_MIN, TEMP_MAX) },
        },
      }
    }
    case 'setMode':
      return {
        ...state,
        thermostats: {
          ...state.thermostats,
          [action.zone]: { ...state.thermostats[action.zone], mode: action.mode },
        },
      }
    case 'setSecurity':
      return { ...state, security: action.mode }
    case 'toggleAppliance':
      return { ...state, appliances: { ...state.appliances, [action.id]: !state.appliances[action.id] } }
    case 'toggleLock':
      return { ...state, locks: { ...state.locks, [action.id]: !state.locks[action.id] } }
    case 'toggleGoodnight':
      if (state.goodnight) {
        // Turning it off restores the normal look; lights and security stay as they are.
        return { ...state, goodnight: false }
      }
      return {
        ...state,
        goodnight: true,
        security: 'stay',
        lights: Object.fromEntries(Object.keys(state.lights).map((k) => [k, false])) as State['lights'],
      }
    case 'setTime':
      return { ...state, sceneMinutes: clamp(Math.round(action.minutes), SLIDER_MIN, SLIDER_MAX) }
    case 'tick': {
      const next = state.sceneMinutes + 1
      return { ...state, sceneMinutes: next > SLIDER_MAX ? SLIDER_MIN : next }
    }
  }
}

const StateCtx = createContext<State | null>(null)
const DispatchCtx = createContext<Dispatch<Action> | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useStore(): State {
  const s = useContext(StateCtx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}

export function useDispatch(): Dispatch<Action> {
  const d = useContext(DispatchCtx)
  if (!d) throw new Error('useDispatch must be used inside StoreProvider')
  return d
}
