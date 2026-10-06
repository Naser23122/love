'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { heartBurst, playChime } from '@/lib/sfx'
import { Character, GlowButton, NextButton, StageHeader, type StageProps } from '../shared'

const teases = ['هههه مش هتعرفي 😜', 'لأ مش هسيبك تدوسي 😂', 'ارجعي للزرار التاني', 'بتحاولي ليه؟ 🌚', 'مستحيل يا بطتي']

export function RunawayStage({ onNext }: StageProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [escapes, setEscapes] = useState(0)
  const [answered, setAnswered] = useState(false)

  function runAway() {
    const w = window.innerWidth
    const h = window.innerHeight
    setPos({ x: 20 + Math.random() * (w - 220), y: 80 + Math.random() * (h - 200) })
    setEscapes((n) => n + 1)
  }

  function yes() {
    setAnswered(true)
    playChime()
    heartBurst(80)
  }

  const says = answered
    ? 'كنت عارف! وأنا بحبك أكتر من الدنيا والآخرة ❤️'
    : escapes > 0
      ? teases[escapes % teases.length]
      : 'سؤال مهم جداً ومصيري..'

  const runaway = (
    <motion.button
      type="button"
      onPointerEnter={runAway}
      onPointerDown={(e) => {
        e.preventDefault()
        runAway()
      }}
      onFocus={runAway}
      initial={false}
      animate={pos ? { left: pos.x, top: pos.y } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      style={pos ? { position: 'fixed', zIndex: 50, left: pos.x, top: pos.y } : undefined}
      className="glass touch-none rounded-full px-6 py-3 font-bold"
      dir="rtl"
    >
      شوية صغيرين / لأ 😜
    </motion.button>
  )

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٣ — التحدي" title="بتحبيني قد إيه يا بطتي؟" />
      <Character who="abdo" size="lg" mood={answered ? 'happy' : 'curious'} says={says} className="mb-10 flex-col" />

      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <GlowButton onClick={yes} className="w-full">
          أكتر من الدنيا كلها بحالها! ❤️
        </GlowButton>
        {!answered && !pos && runaway}
        {!answered && pos && createPortal(runaway, document.body)}
      </div>

      <NextButton show={answered} onClick={onNext} />
    </section>
  )
}
