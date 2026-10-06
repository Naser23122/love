'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Coffee, KeyRound, MessageCircleHeart, Star, X } from 'lucide-react'
import { vaultItems } from '@/lib/content'
import { playChime } from '@/lib/sfx'
import { cn } from '@/lib/utils'
import { NextButton, StageHeader, type StageProps } from '../shared'

const icons = { coffee: Coffee, chat: MessageCircleHeart, key: KeyRound, star: Star }

export function VaultStage({ onNext }: StageProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [found, setFound] = useState<Set<string>>(new Set())
  const open = vaultItems.find((v) => v.id === openId)

  function reveal(id: string) {
    setOpenId(id)
    setFound((s) => new Set(s).add(id))
    playChime()
  }

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٦ — خزنة الذكريات" title="دوري على الكنوز المستخبية" subtitle={`لقيتي ${found.size} من ${vaultItems.length}`} />

      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {vaultItems.map((item, i) => {
          const Icon = icons[item.id]
          const isFound = found.has(item.id)
          return (
            <motion.button
              key={item.id}
              onClick={() => reveal(item.id)}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.06, rotate: -3 }}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'glass flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl p-4',
                isFound && 'ring-2 ring-accent',
              )}
            >
              <span className="grid size-16 place-items-center rounded-full bg-primary/20 shadow-[0_0_30px_-5px] shadow-primary">
                <Icon className="size-8 text-primary" aria-hidden="true" />
              </span>
              <span className="font-bold">{item.label}</span>
              {isFound && <span className="text-xs text-accent">اتفتح ✓</span>}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenId(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs rounded-sm bg-white p-3 pb-4 shadow-2xl"
            >
              <button
                onClick={() => setOpenId(null)}
                aria-label="إغلاق"
                className="absolute -top-3 -left-3 z-10 grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <div className="relative h-80 overflow-hidden bg-neutral-900">
                <Image src={open.image || '/placeholder.svg'} alt={open.tag} fill sizes="320px" className="object-cover object-top" />
              </div>
              <p className="mt-3 text-center font-display text-xl text-neutral-800">{open.tag}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NextButton show={found.size === vaultItems.length} onClick={onNext} />
    </section>
  )
}
