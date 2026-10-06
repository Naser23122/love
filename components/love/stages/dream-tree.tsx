'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { dreams } from '@/lib/content'
import { playChime } from '@/lib/sfx'
import { cn } from '@/lib/utils'
import { NextButton, StageHeader, type StageProps } from '../shared'

export function DreamTreeStage({ onNext }: StageProps) {
  const [lit, setLit] = useState<Set<number>>(new Set())
  const [active, setActive] = useState<number | null>(null)

  function light(i: number) {
    if (!lit.has(i)) playChime()
    setLit((s) => new Set(s).add(i))
    setActive(i)
  }

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ١٢ — شجرة الأحلام" title="نوري الفوانيس" subtitle={`كل فانوس حلم من أحلامنا — منور ${lit.size} من ${dreams.length}`} />

      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl">
        <Image src="/scenes/dream-tree.png" alt="شجرة الأحلام المضيئة" fill sizes="448px" className="object-cover" priority />
        {dreams.map((d, i) => {
          const on = lit.has(i)
          return (
            <motion.button
              key={d.text}
              onClick={() => light(i)}
              aria-label={on ? d.text : `فانوس ${i + 1}`}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="mx-auto block h-3 w-px bg-amber-200/60" />
              <span
                className={cn(
                  'block h-9 w-7 rounded-b-xl rounded-t-md border border-amber-200/50 transition-all duration-500',
                  on ? 'bg-amber-300 shadow-[0_0_30px_8px] shadow-amber-300/70' : 'bg-amber-900/60',
                )}
              />
            </motion.button>
          )
        })}
      </div>

      <div className="mt-5 min-h-16" aria-live="polite">
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-full px-6 py-3 font-display text-xl text-glow"
            >
              {dreams[active].text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <NextButton show={lit.size === dreams.length} onClick={onNext} />
    </section>
  )
}
