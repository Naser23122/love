'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, LockOpen } from 'lucide-react'
import { fireworks, playChime } from '@/lib/sfx'
import { GlowButton } from '../shared'

export function GatewayStage({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [errorKey, setErrorKey] = useState(0)
  const [unlocked, setUnlocked] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim().toLowerCase() === 'love') {
      setUnlocked(true)
      playChime()
      fireworks(1800)
      window.setTimeout(onUnlock, 1600)
    } else {
      setErrorKey((k) => k + 1)
    }
  }

  return (
    <section className="flex flex-col items-center text-center">
      <motion.div
        animate={unlocked ? { scale: [1, 1.3, 0], rotate: [0, -10, 20], opacity: [1, 1, 0] } : { y: [0, -10, 0] }}
        transition={unlocked ? { duration: 1.4 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-8 grid size-36 place-items-center rounded-full bg-gradient-to-b from-accent/90 to-amber-700/80 shadow-[0_0_80px_-10px] shadow-accent"
      >
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/40" />
        {unlocked ? (
          <LockOpen className="size-16 text-accent-foreground" aria-hidden="true" />
        ) : (
          <Lock className="size-16 text-accent-foreground" aria-hidden="true" />
        )}
      </motion.div>

      <p className="mb-2 text-xs font-bold tracking-widest text-accent">البوابة السرية</p>
      <h1 className="font-display text-4xl leading-tight text-balance text-glow md:text-6xl">Asmaa & Abdo</h1>
      <p className="mt-2 mb-8 text-muted-foreground">حكايتنا محتاجة كلمة سر عشان تتفتح</p>

      <motion.form
        key={errorKey}
        onSubmit={submit}
        animate={errorKey ? { x: [0, -16, 16, -12, 12, -6, 6, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="glass flex w-full max-w-sm flex-col gap-3 rounded-3xl p-4"
      >
        <label htmlFor="password" className="sr-only">
          كلمة السر
        </label>
        <input
          id="password"
          type="password"
          dir="ltr"
          autoComplete="off"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••"
          className="h-12 rounded-full bg-white/10 px-5 text-center text-lg tracking-[0.5em] outline-none ring-primary placeholder:text-white/40 focus:ring-2"
        />
        <GlowButton type="submit">افتحي القفل</GlowButton>
      </motion.form>

      <div className="mt-4 h-8" aria-live="polite">
        <AnimatePresence>
          {errorKey > 0 && !unlocked && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-pink-200">
              {'الباسورد كلمة السر اللي بتجمعنا.. فكري تاني 😉'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
