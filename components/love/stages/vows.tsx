'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { vows } from '@/lib/content'
import { playChime } from '@/lib/sfx'
import { NextButton, StageHeader, type StageProps } from '../shared'

export function Envelope({ opened, onOpen, label, children }: { opened: boolean; onOpen: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={opened}
      aria-label={label}
      className="relative h-40 w-full [perspective:800px]"
    >
      <motion.div
        animate={opened ? { y: -70, opacity: 1 } : { y: 0, opacity: 0 }}
        transition={{ delay: opened ? 0.35 : 0, type: 'spring', stiffness: 120 }}
        className="absolute inset-x-3 top-3 z-10 min-h-28 rounded-md bg-parchment p-3 text-center font-display text-lg leading-snug text-ink shadow-xl"
      >
        {children}
      </motion.div>
      <div className="absolute inset-0 z-20 rounded-lg bg-gradient-to-b from-rose-200 to-rose-300 shadow-lg" style={{ clipPath: 'polygon(0 25%, 50% 65%, 100% 25%, 100% 100%, 0 100%)' }} />
      <div className="absolute inset-0 rounded-lg bg-rose-400" />
      <motion.div
        animate={{ rotateX: opened ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: 'top', clipPath: 'polygon(0 0, 100% 0, 50% 60%)', zIndex: opened ? 5 : 30 }}
        className="absolute inset-0 rounded-lg bg-gradient-to-b from-rose-300 to-rose-400"
      />
      {!opened && (
        <span className="absolute top-[52%] left-1/2 z-40 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-700 text-lg text-red-200 shadow-md ring-2 ring-red-900">
          {'♥'}
        </span>
      )}
    </button>
  )
}

export function VowsStage({ onNext }: StageProps) {
  const [opened, setOpened] = useState<Set<number>>(new Set())

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٩ — جدار الوعود" title="وعود مختومة بالشمع" subtitle="افتحي كل ظرف.. ده كلام من القلب" />

      <div className="grid w-full max-w-lg grid-cols-1 gap-x-4 gap-y-24 pt-20 sm:grid-cols-2">
        {vows.map((v, i) => (
          <Envelope
            key={v}
            label={`ظرف الوعد ${i + 1}`}
            opened={opened.has(i)}
            onOpen={() => {
              if (!opened.has(i)) playChime()
              setOpened((s) => new Set(s).add(i))
            }}
          >
            {v}
          </Envelope>
        ))}
      </div>

      <NextButton show={opened.size === vows.length} onClick={onNext} />
    </section>
  )
}
