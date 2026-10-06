'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { finalLetter } from '@/lib/content'
import { fireworks, heartBurst } from '@/lib/sfx'
import { GlowButton, StageHeader } from '../shared'

function RosePetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i * 0.53) % 8,
        duration: 7 + ((i * 1.7) % 6),
        size: 12 + ((i * 7) % 14),
      })),
    [],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute -top-10 rounded-[60%_0_60%_0] bg-gradient-to-br from-rose-400 to-red-600 opacity-90"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `fall-down ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function FinaleStage({ onReplay }: { onReplay: () => void }) {
  const [opened, setOpened] = useState(false)
  const [chars, setChars] = useState(0)
  const done = chars >= finalLetter.length

  useEffect(() => {
    if (!opened || done) return
    const id = window.setInterval(() => setChars((c) => Math.min(finalLetter.length, c + 2)), 35)
    return () => window.clearInterval(id)
  }, [opened, done])

  useEffect(() => {
    if (!done) return
    heartBurst(150)
    const stop = fireworks(6000)
    const loop = window.setInterval(() => fireworks(2000), 9000)
    return () => {
      stop()
      window.clearInterval(loop)
    }
  }, [done])

  return (
    <section className="flex flex-col items-center">
      {done && <RosePetals />}
      <StageHeader eyebrow="المحطة ١٤ — الختام" title="جواب أخير.. من عبده" />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.button
            key="env"
            onClick={() => setOpened(true)}
            exit={{ scale: 1.4, opacity: 0, rotate: 8 }}
            animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-label="افتحي الجواب"
            className="relative h-52 w-80 rounded-lg bg-gradient-to-b from-parchment to-amber-200 shadow-[0_20px_60px_-10px] shadow-accent"
          >
            <span className="absolute inset-0 rounded-lg bg-amber-300/70" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 58%)' }} />
            <span className="absolute top-[52%] left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-700 text-2xl text-red-200 shadow-lg ring-4 ring-red-900">
              {'♥'}
            </span>
            <span className="absolute inset-x-0 bottom-4 font-display text-xl text-ink">إلى أسماء</span>
          </motion.button>
        ) : (
          <motion.article
            key="letter"
            initial={{ opacity: 0, y: 60, rotateX: 30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="relative w-full max-w-2xl rounded-md bg-parchment p-6 text-ink shadow-[0_30px_80px_-20px] shadow-accent md:p-10"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 35px, oklch(0.6 0.08 60 / 0.18) 35px 36px)' }}
          >
            <p className="font-display text-lg leading-[36px] whitespace-pre-line md:text-xl" aria-live="off">
              {finalLetter.slice(0, chars)}
              {!done && <span className="mr-0.5 inline-block h-5 w-0.5 animate-pulse bg-ink align-middle" />}
            </p>
            <span className="sr-only">{finalLetter}</span>
            {!done && (
              <button onClick={() => setChars(finalLetter.length)} className="absolute bottom-3 left-4 text-xs text-ink/60 underline">
                اعرضي الجواب كله
              </button>
            )}
          </motion.article>
        )}
      </AnimatePresence>

      {done && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-col items-center text-center">
          <div className="relative aspect-square w-72 overflow-hidden rounded-full ring-4 ring-primary shadow-[0_0_80px_-5px] shadow-primary md:w-80">
            <Image src="/characters/hug.png" alt="عبده وأسماء في حضن دافي" fill sizes="320px" className="object-cover" />
          </div>
          <motion.h3
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 font-display text-4xl leading-tight text-balance text-glow md:text-6xl"
          >
            بحبك يا أسماء ❤️
          </motion.h3>
          <p className="mt-2 text-lg text-accent" dir="ltr">
            Asmaa & Abdo — Forever
          </p>
          <GlowButton variant="ghost" onClick={onReplay} className="mt-8">
            نعيد الرحلة من الأول؟
          </GlowButton>
        </motion.div>
      )}
    </section>
  )
}
