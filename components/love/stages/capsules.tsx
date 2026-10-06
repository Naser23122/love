'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Hourglass } from 'lucide-react'
import { capsules } from '@/lib/content'
import { playChime } from '@/lib/sfx'
import { NextButton, StageHeader, type StageProps } from '../shared'

export function CapsulesStage({ onNext }: StageProps) {
  const [opened, setOpened] = useState<Set<number>>(new Set())

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ١١ — كبسولات الزمن" title="رسايل لمستقبلنا" subtitle="كل كبسولة فيها حلم مستني يتحقق" />

      <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
        {capsules.map((c, i) => {
          const isOpen = opened.has(i)
          return (
            <motion.button
              key={c.title}
              layout
              onClick={() => {
                if (!isOpen) playChime()
                setOpened((s) => new Set(s).add(i))
              }}
              aria-expanded={isOpen}
              whileHover={{ scale: 1.03 }}
              className="glass flex flex-col items-center gap-3 rounded-3xl p-5 text-center"
            >
              <motion.span
                animate={isOpen ? { rotate: 180 } : { rotate: [0, -10, 10, 0] }}
                transition={isOpen ? { duration: 0.6 } : { duration: 2, repeat: Infinity }}
                className="grid size-14 place-items-center rounded-full bg-gradient-to-b from-accent to-amber-600"
              >
                <Hourglass className="size-7 text-accent-foreground" aria-hidden="true" />
              </motion.span>
              <span className="text-lg font-bold">{c.title}</span>
              <span className="text-xs text-accent">{c.year}</span>
              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm leading-relaxed text-pretty text-foreground/90"
                  >
                    {c.note}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      <NextButton show={opened.size === capsules.length} onClick={onNext} />
    </section>
  )
}
