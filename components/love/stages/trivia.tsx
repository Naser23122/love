'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { trivia } from '@/lib/content'
import { burst, playChime } from '@/lib/sfx'
import { cn } from '@/lib/utils'
import { Character, GlowButton, NextButton, StageHeader, type StageProps } from '../shared'

export function TriviaStage({ onNext }: StageProps) {
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const finished = qIndex >= trivia.length
  const question = trivia[qIndex]

  function pick(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (question.options[i].correct) {
      setScore((s) => s + 1)
      playChime()
      burst({ count: 60, y: 0.7 })
    }
  }

  function next() {
    setPicked(null)
    setQIndex((q) => q + 1)
  }

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٧ — اختبار الحب" title="إنتي فاكرة كويس؟" subtitle={finished ? undefined : `سؤال ${qIndex + 1} من ${trivia.length}`} />

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="glass w-full max-w-md rounded-3xl p-6"
          >
            <h3 className="mb-5 text-center text-xl font-bold leading-relaxed text-balance">{question.q}</h3>
            <div className="grid gap-3">
              {question.options.map((o, i) => {
                const state = picked === null ? 'idle' : o.correct ? 'right' : picked === i ? 'wrong' : 'dim'
                return (
                  <motion.button
                    key={o.text}
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    animate={state === 'wrong' ? { x: [0, -8, 8, -4, 0] } : {}}
                    className={cn(
                      'rounded-2xl border px-4 py-3 font-bold transition-colors',
                      state === 'idle' && 'border-white/20 bg-white/5 hover:bg-white/15',
                      state === 'right' && 'border-emerald-300 bg-emerald-500/30',
                      state === 'wrong' && 'border-rose-300 bg-rose-500/30',
                      state === 'dim' && 'border-white/10 opacity-50',
                    )}
                  >
                    {o.text}
                  </motion.button>
                )
              })}
            </div>
            {picked !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-col items-center gap-4">
                <Character who="abdo" size="sm" mood="happy" says={question.options[picked].reply} />
                <GlowButton onClick={next}>{qIndex === trivia.length - 1 ? 'النتيجة' : 'السؤال الجاي'}</GlowButton>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-md rounded-3xl p-8 text-center">
            <p className="font-display text-6xl text-glow">
              {score} / {trivia.length}
            </p>
            <p className="mt-4 text-lg text-pretty">
              {score === trivia.length ? 'عشرة على عشرة! إنتي حافظاني أكتر من نفسي ❤️' : 'مش مهم الدرجة.. المهم إنك بتضحكي دلوقتي 😂❤️'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <NextButton show={finished} onClick={onNext} />
    </section>
  )
}
