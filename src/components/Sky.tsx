import { useEffect, useState } from 'react'
import { SKY_STAGES, type SkyStage } from '../lib/time'

// Gradient stand-ins until public/sky/<stage>.jpg exists. Drop the four images
// into public/sky/ and they are picked up automatically, no code change needed.
const PLACEHOLDER: Record<SkyStage, string> = {
  morning: 'linear-gradient(180deg, #7FB2E5 0%, #B9D4EE 45%, #F6D8C4 80%, #FBE6D2 100%)',
  afternoon: 'linear-gradient(180deg, #2F7FD8 0%, #5FA6EA 45%, #A9D3F5 80%, #DCEFFC 100%)',
  sunset: 'linear-gradient(180deg, #23214F 0%, #6A3E7A 35%, #D06A5F 70%, #F5A65B 90%, #FBD38D 100%)',
  night: 'radial-gradient(ellipse at 50% 120%, #1D2D55 0%, rgba(29,45,85,0) 60%), linear-gradient(180deg, #03050C 0%, #0A1229 55%, #142246 100%)',
}

function useSkyImages(): Partial<Record<SkyStage, string>> {
  const [found, setFound] = useState<Partial<Record<SkyStage, string>>>({})
  useEffect(() => {
    let cancelled = false
    for (const stage of SKY_STAGES) {
      const url = `${import.meta.env.BASE_URL}sky/${stage}.jpg`
      const img = new Image()
      img.onload = () => { if (!cancelled) setFound((f) => ({ ...f, [stage]: url })) }
      img.src = url
    }
    return () => { cancelled = true }
  }, [])
  return found
}

/** Full-window sky behind the device. Each stage is a layer; the active one fades in over 1.5s. */
export function Sky({ stage }: { stage: SkyStage }) {
  const images = useSkyImages()
  return (
    <div className="sky" aria-hidden="true">
      {SKY_STAGES.map((s) => (
        <div
          key={s}
          className={`sky-layer ${s === stage ? 'is-active' : ''}`}
          style={{ backgroundImage: images[s] ? `url("${images[s]}")` : PLACEHOLDER[s] }}
        />
      ))}
    </div>
  )
}
