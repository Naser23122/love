import confetti from 'canvas-confetti'

let ctx: AudioContext | null = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

let muted = false
export function setSfxMuted(value: boolean) {
  muted = value
}

function thump(c: AudioContext, at: number, freq: number, gain: number) {
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, at)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, at + 0.15)
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(gain, at + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22)
  osc.connect(g).connect(c.destination)
  osc.start(at)
  osc.stop(at + 0.25)
}

export function playHeartbeat(intensity = 0.6) {
  if (muted) return
  const c = getCtx()
  if (!c) return
  const now = c.currentTime
  thump(c, now, 70, intensity)
  thump(c, now + 0.18, 60, intensity * 0.7)
}

export function playChime() {
  if (muted) return
  const c = getCtx()
  if (!c) return
  const now = c.currentTime
  ;[880, 1320, 1760].forEach((f, i) => {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'triangle'
    osc.frequency.value = f
    const t = now + i * 0.08
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)
    osc.connect(g).connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.65)
  })
}

const loveColors = ['#ff4d9d', '#ffb3d1', '#f7c873', '#c79bff', '#ffffff']

export function burst(opts: { x?: number; y?: number; count?: number } = {}) {
  confetti({
    particleCount: opts.count ?? 120,
    spread: 90,
    startVelocity: 45,
    origin: { x: opts.x ?? 0.5, y: opts.y ?? 0.6 },
    colors: loveColors,
    zIndex: 100,
  })
}

export function heartBurst(count = 60) {
  const heart = confetti.shapeFromPath({
    path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
  })
  confetti({
    particleCount: count,
    spread: 120,
    startVelocity: 40,
    scalar: 2,
    shapes: [heart],
    colors: ['#ff4d9d', '#ff8fbf', '#ff2e6e'],
    origin: { x: 0.5, y: 0.55 },
    zIndex: 100,
  })
}

export function fireworks(durationMs = 2500) {
  const end = Date.now() + durationMs
  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval)
      return
    }
    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: loveColors,
      zIndex: 100,
    })
  }, 280)
  return () => window.clearInterval(interval)
}
