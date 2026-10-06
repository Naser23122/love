'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { fireworks, playChime } from '@/lib/sfx'
import { NextButton, StageHeader, type StageProps } from '../shared'

const COUNT = 12

export function ConstellationStage({ onNext }: StageProps) {
  const points = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const t = (i / COUNT) * Math.PI * 2
        const x = 16 * Math.sin(t) ** 3
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
        return { x: 50 + x * 2.6, y: 46 - y * 2.6 }
      }),
    [],
  )
  const [connected, setConnected] = useState(1)
  const done = connected >= COUNT

  function tryConnect(i: number) {
    if (done || i !== connected) return
    const next = connected + 1
    setConnected(next)
    playChime()
    if (next >= COUNT) fireworks(2500)
  }

  const path = points
    .slice(0, connected)
    .map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`)
    .join(' ')

  return (
    <section className="flex flex-col items-center">
      <StageHeader
        eyebrow="المحطة ١٣ — سماء النجوم"
        title="وصلي النجوم ببعض"
        subtitle={done ? 'شوفتي رسمنا إيه؟' : 'اضغطي على النجمة اللي بتنور.. واحدة ورا التانية'}
      />

      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-[radial-gradient(circle,oklch(0.25_0.1_290)_0%,oklch(0.12_0.05_280)_100%)] ring-1 ring-white/10">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
          <path
            d={done ? `${path} Z` : path}
            fill={done ? 'oklch(0.7 0.22 355 / 0.25)' : 'none'}
            stroke="#ffd1e6"
            strokeWidth="0.6"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 2px #ff4d9d)', transition: 'fill 1s' }}
          />
        </svg>
        {points.map((p, i) => {
          const isNext = i === connected && !done
          const isOn = i < connected
          return (
            <motion.button
              key={i}
              onClick={() => tryConnect(i)}
              onPointerEnter={(e) => e.buttons > 0 && tryConnect(i)}
              aria-label={`نجمة ${i + 1}`}
              animate={isNext ? { scale: [1, 1.6, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: isNext ? Infinity : 0 }}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center"
            >
              <span
                className={`block size-3 rotate-45 ${isOn ? 'bg-white shadow-[0_0_12px_4px] shadow-pink-300' : isNext ? 'bg-accent shadow-[0_0_12px_4px] shadow-accent' : 'bg-white/40'}`}
              />
            </motion.button>
          )
        })}

        {done && (
          <>
            <motion.p
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute inset-x-0 top-[40%] text-center font-display text-3xl text-white text-glow md:text-4xl"
              dir="ltr"
            >
              ASMAA & ABDO
            </motion.p>
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                aria-hidden="true"
                className="absolute h-0.5 w-24 rounded-full bg-gradient-to-l from-white to-transparent"
                style={{ right: `${-10 + n * 20}%`, top: `${5 + n * 12}%`, animation: `shooting 2.4s ease-out ${n * 0.8}s infinite` }}
              />
            ))}
          </>
        )}
      </div>

      <NextButton show={done} onClick={onNext} label="المحطة الأخيرة ❤️" />
    </section>
  )
}
