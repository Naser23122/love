'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { wheelOptions } from '@/lib/content'
import { fireworks, heartBurst, playChime } from '@/lib/sfx'
import { GlowButton, NextButton, StageHeader, type StageProps } from '../shared'

const SEG = 360 / wheelOptions.length

function slicePath(i: number) {
  const r = 100
  const a0 = ((i * SEG - 90) * Math.PI) / 180
  const a1 = (((i + 1) * SEG - 90) * Math.PI) / 180
  return `M100,100 L${100 + r * Math.cos(a0)},${100 + r * Math.sin(a0)} A${r},${r} 0 0,1 ${100 + r * Math.cos(a1)},${100 + r * Math.sin(a1)} Z`
}

function Face({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-white to-pink-100 ring-4 ring-primary/70 md:size-28">
      <Image src={src || '/placeholder.svg'} alt={alt} fill sizes="112px" className="origin-[50%_16%] scale-[2.3] object-cover" />
    </div>
  )
}

function KissScene({ run }: { run: number }) {
  const marks = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ x: (i - 4) * 18, delay: 1.3 + i * 0.12, rot: (i % 3) * 15 - 15 })),
    [],
  )
  return (
    <div key={run} className="relative flex h-44 w-full max-w-sm items-center justify-center" aria-label="أسماء بتبوس عبده">
      <motion.div
        initial={{ x: 140 }}
        animate={{ x: [140, 34, 26, 34], rotate: [0, -12, -18, -10] }}
        transition={{ duration: 1.8, times: [0, 0.6, 0.8, 1], ease: 'easeOut' }}
        className="absolute"
      >
        <Face src="/characters/asmaa.png" alt="أسماء" />
      </motion.div>
      <motion.div
        initial={{ x: -140 }}
        animate={{ x: [-140, -34, -34], rotate: [0, 6, 4] }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute"
      >
        <Face src="/characters/abdo.png" alt="عبده" />
      </motion.div>
      {marks.map((m, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0], y: -110, x: m.x, scale: [0.3, 1.3, 1], rotate: m.rot }}
          transition={{ duration: 1.8, delay: m.delay, ease: 'easeOut' }}
          className="absolute top-1/3 text-3xl"
        >
          {i % 2 ? '❤️' : '💋'}
        </motion.span>
      ))}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1], scale: [0, 1.6, 1.2] }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute -top-2 text-4xl"
      >
        💋
      </motion.span>
    </div>
  )
}

export function WheelStage({ onNext }: StageProps) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [runs, setRuns] = useState(0)

  function spin() {
    if (spinning) return
    const target = Math.floor(Math.random() * wheelOptions.length)
    const center = target * SEG + SEG / 2
    const base = rotation - (rotation % 360)
    setRotation(base + 360 * 6 + (360 - center))
    setResult(null)
    setSpinning(true)
    window.setTimeout(() => {
      setSpinning(false)
      setResult(target)
      setRuns((r) => r + 1)
      playChime()
      fireworks(1500)
      window.setTimeout(() => heartBurst(80), 1300)
    }, 4200)
  }

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٨ — عجلة الحظ" title="لفي العجلة يا بطتي" subtitle="واللي يطلع.. لازم يتنفذ حالاً 😌" />

      <div className="relative size-72 md:size-80">
        <div className="absolute -top-2 left-1/2 z-10 size-0 -translate-x-1/2 border-x-[14px] border-t-[26px] border-x-transparent border-t-accent drop-shadow-lg" aria-hidden="true" />
        <motion.svg
          viewBox="0 0 200 200"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0.85, 0.25, 1] }}
          className="size-full drop-shadow-[0_0_30px_oklch(0.7_0.22_355/0.6)]"
          role="img"
          aria-label="عجلة الحظ"
        >
          {wheelOptions.map((o, i) => {
            const mid = i * SEG + SEG / 2
            return (
              <g key={i}>
                <path d={slicePath(i)} fill={o.color} stroke="#fff" strokeWidth="1.5" />
                <text
                  x="100"
                  y="32"
                  transform={`rotate(${mid} 100 100)`}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="#fff"
                  style={{ fontFamily: 'var(--font-cairo)' }}
                >
                  {o.label}
                </text>
              </g>
            )
          })}
          <circle cx="100" cy="100" r="16" fill="#1a1035" stroke="#f7c873" strokeWidth="3" />
          <text x="100" y="104" textAnchor="middle" fontSize="12" fill="#ff4d9d">
            {'♥'}
          </text>
        </motion.svg>
      </div>

      <GlowButton onClick={spin} disabled={spinning} className="mt-8">
        {spinning ? 'بتلف...' : result === null ? 'لفي العجلة' : 'لفي تاني'}
      </GlowButton>

      <div className="mt-6 flex min-h-56 w-full flex-col items-center" aria-live="polite">
        {result !== null && (
          <>
            <KissScene run={runs} />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-2 text-center font-display text-2xl text-glow"
            >
              طلعت &quot;{wheelOptions[result].label}&quot;.. وبصراحة كل الخانات كده 😂
            </motion.p>
          </>
        )}
      </div>

      <NextButton show={result !== null && !spinning} onClick={onNext} />
    </section>
  )
}
