'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { memories, memoryCaption } from '@/lib/content'
import { playHeartbeat } from '@/lib/sfx'
import { Character, GlowButton, StageHeader, type StageProps } from '../shared'

const CARD_MS = 1200
const FULL_MS = 3600
const BACK_MS = 1000

export function IntroStage({ onNext }: StageProps) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    playHeartbeat(0.7)
    const beat = window.setInterval(() => playHeartbeat(0.35), 1600)
    return () => window.clearInterval(beat)
  }, [])

  useEffect(() => {
    if (paused) return
    const open = window.setTimeout(() => setExpanded(true), CARD_MS)
    const close = window.setTimeout(() => setExpanded(false), CARD_MS + FULL_MS)
    const next = window.setTimeout(() => setIndex((i) => (i + 1) % memories.length), CARD_MS + FULL_MS + BACK_MS)
    return () => {
      window.clearTimeout(open)
      window.clearTimeout(close)
      window.clearTimeout(next)
    }
  }, [index, paused])

  const current = memories[index]
  const layoutId = `memory-${current.src}`

  function jump(i: number) {
    setExpanded(false)
    setIndex(i)
  }

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٢ — شريط الذكريات" title="كان يا ما كان.. حكاية عبده وأسماء" />

      <div className="relative mb-6 h-[26rem] w-full max-w-sm md:h-[30rem]">
        <AnimatePresence mode="popLayout">
          <motion.figure
            key={current.src}
            initial={{ opacity: 0, scale: 0.7, rotate: current.tilt * 3, y: 60 }}
            animate={{ opacity: 1, scale: 1, rotate: current.tilt, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -200, rotate: -20 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="absolute inset-x-6 top-0 rounded-sm bg-white p-3 pb-20 shadow-2xl"
          >
            <button
              onClick={() => setExpanded(true)}
              aria-label="كبري الصورة"
              className="relative block h-[18rem] w-full overflow-hidden bg-neutral-900 md:h-[22rem]"
            >
              {!expanded && (
                <motion.div layoutId={layoutId} className="absolute inset-0">
                  <Image src={current.src || '/placeholder.svg'} alt={current.alt} fill sizes="320px" className="object-cover object-top" />
                </motion.div>
              )}
            </button>
            <figcaption className="absolute inset-x-3 bottom-3 text-center font-display text-base leading-snug text-pretty text-neutral-800">
              {memoryCaption}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/85 p-4 backdrop-blur-md"
            role="dialog"
            aria-label={current.alt}
          >
            <motion.div
              layoutId={layoutId}
              transition={{ type: 'spring', stiffness: 70, damping: 18 }}
              className="relative h-[75dvh] w-full max-w-3xl overflow-hidden rounded-2xl shadow-[0_0_80px_-10px] shadow-primary"
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: FULL_MS / 1000 + 1, ease: 'easeOut' }}
              >
                <Image src={current.src || '/placeholder.svg'} alt={current.alt} fill sizes="100vw" className="object-contain" priority />
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-xl text-center font-display text-2xl leading-snug text-balance text-glow md:text-3xl"
            >
              {memoryCaption}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 flex flex-wrap justify-center gap-2" role="tablist" aria-label="الذكريات">
        {memories.map((m, i) => (
          <button
            key={m.src}
            role="tab"
            aria-selected={i === index}
            aria-label={`ذكرى ${i + 1}`}
            onClick={() => jump(i)}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>

      <button onClick={() => setPaused((p) => !p)} className="mb-6 text-xs text-muted-foreground underline">
        {paused ? 'شغلي العرض تاني' : 'وقفي العرض'}
      </button>

      <Character who="asmaa" size="sm" mood="happy" says="كل ذكرى فيهم بتضحكني لوحدها 🥹" className="mb-6" />

      <GlowButton onClick={onNext}>ابدأي الرحلة معايا يا أسماء ❤️</GlowButton>
    </section>
  )
}
