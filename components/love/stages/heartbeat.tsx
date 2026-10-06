'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { burst, heartBurst, playHeartbeat } from '@/lib/sfx'
import { Character, NextButton, StageHeader, type StageProps } from '../shared'

const MAX = 1000

export function HeartbeatStage({ onNext }: StageProps) {
  const [level, setLevel] = useState(0)
  const [holding, setHolding] = useState(false)
  const [done, setDone] = useState(false)
  const levelRef = useRef(0)
  const lastBeat = useRef(0)

  useEffect(() => {
    if (done) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const next = holding
        ? Math.min(MAX, levelRef.current + dt * (120 + levelRef.current * 0.35))
        : Math.max(0, levelRef.current - dt * 60)
      levelRef.current = next
      setLevel(next)

      const interval = 900 - (next / MAX) * 650
      if (holding && now - lastBeat.current > interval) {
        lastBeat.current = now
        playHeartbeat(0.3 + (next / MAX) * 0.6)
      }
      if (next >= MAX) {
        setDone(true)
        setHolding(false)
        heartBurst(120)
        burst({ count: 200 })
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [holding, done])

  const pct = Math.round(level)
  const ratio = level / MAX

  return (
    <section className="flex flex-col items-center">
      <StageHeader
        eyebrow="المحطة ٤ — مقياس النبض"
        title="اضغطي وفضلي دايسة عشان نقيس حبنا"
        subtitle="القلب ده بيكبر كل ما تفضلي دايسة.. شوفي هيوصل لفين"
      />

      <div
        className="pointer-events-none fixed inset-0 -z-[5] transition-opacity"
        style={{ background: `radial-gradient(circle, oklch(0.7 0.22 355 / ${ratio * 0.5}) 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <button
        type="button"
        disabled={done}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setHolding(true)
        }}
        onPointerUp={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setHolding(true)}
        onKeyUp={() => setHolding(false)}
        aria-label="اضغطي مطولاً على القلب"
        className="relative my-6 grid size-56 touch-none select-none place-items-center rounded-full outline-none md:size-64"
      >
        <motion.div
          animate={{ scale: holding ? [1 + ratio * 0.5, 1.08 + ratio * 0.6, 1 + ratio * 0.5] : 1 + ratio * 0.5 }}
          transition={{ duration: Math.max(0.25, 0.9 - ratio * 0.65), repeat: holding ? Infinity : 0 }}
        >
          <Heart
            className="size-40 fill-primary text-primary drop-shadow-[0_0_30px_oklch(0.7_0.22_355)] md:size-48"
            aria-hidden="true"
          />
        </motion.div>
        <span className="absolute font-display text-4xl text-white drop-shadow-lg" aria-live="polite">
          {pct}%
        </span>
      </button>

      <div className="h-3 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-l from-primary to-fuchsia-400" style={{ width: `${ratio * 100}%` }} />
      </div>

      <Character
        who="abdo"
        size="sm"
        mood={done ? 'happy' : 'idle'}
        says={done ? 'القلب اتفجر من الحب! ١٠٠٠٪ ومش كفاية 🥹❤️' : pct > 500 ? 'كملي كملي.. قربنا!' : 'يلا شدي حيلك'}
        className="mt-8"
      />

      <NextButton show={done} onClick={onNext} />
    </section>
  )
}
