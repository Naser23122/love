'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Volume2, VolumeX } from 'lucide-react'
import { setSfxMuted } from '@/lib/sfx'
import { Starfield } from './starfield'
import { GatewayStage } from './stages/gateway'
import { IntroStage } from './stages/intro'
import { RunawayStage } from './stages/runaway'
import { HeartbeatStage } from './stages/heartbeat'
import { MixtapeStage } from './stages/mixtape'
import { VaultStage } from './stages/vault'
import { TriviaStage } from './stages/trivia'
import { WheelStage } from './stages/wheel'
import { VowsStage } from './stages/vows'
import { GameStage } from './stages/game'
import { CapsulesStage } from './stages/capsules'
import { DreamTreeStage } from './stages/dream-tree'
import { ConstellationStage } from './stages/constellation'
import { FinaleStage } from './stages/finale'

const MAIN_SONG = '/audio/albumaty.com_mhi_ftwny_agml_frht.mp3'
const FINAL_SONG = '/audio/albumaty.com_lygy_sy_syby_nfsk_khals.mp3'
const TOTAL = 14
const VOLUME = 0.55

const middleStages = [
  IntroStage,
  RunawayStage,
  HeartbeatStage,
  MixtapeStage,
  VaultStage,
  TriviaStage,
  WheelStage,
  VowsStage,
  GameStage,
  CapsulesStage,
  DreamTreeStage,
  ConstellationStage,
]

function fade(audio: HTMLAudioElement, to: number, ms: number, onEnd?: () => void) {
  const from = audio.volume
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms)
    audio.volume = from + (to - from) * t
    if (t < 1) requestAnimationFrame(step)
    else onEnd?.()
  }
  requestAnimationFrame(step)
}

export function Journey() {
  const [stage, setStage] = useState(1)
  const [muted, setMuted] = useState(false)
  const mainRef = useRef<HTMLAudioElement>(null)
  const finalRef = useRef<HTMLAudioElement>(null)

  const go = useCallback((n: number) => {
    setStage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function unlock() {
    const main = mainRef.current
    if (main) {
      main.volume = 0
      main.play().catch(() => {})
      fade(main, VOLUME, 2000)
    }
    go(2)
  }

  useEffect(() => {
    if (stage !== TOTAL) return
    const main = mainRef.current
    const fin = finalRef.current
    if (!main || !fin) return
    fade(main, 0, 2500, () => main.pause())
    fin.currentTime = 0
    fin.volume = 0
    fin.play().catch(() => {})
    fade(fin, VOLUME, 2500)
  }, [stage])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    setSfxMuted(next)
    if (mainRef.current) mainRef.current.muted = next
    if (finalRef.current) finalRef.current.muted = next
  }

  function replay() {
    const main = mainRef.current
    const fin = finalRef.current
    if (fin) fade(fin, 0, 1200, () => fin.pause())
    if (main) {
      main.currentTime = 0
      main.volume = 0
      main.play().catch(() => {})
      fade(main, VOLUME, 1500)
    }
    go(2)
  }

  const Middle = stage >= 2 && stage < TOTAL ? middleStages[stage - 2] : null

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Starfield />
      <audio ref={mainRef} src={MAIN_SONG} loop preload="auto" />
      <audio ref={finalRef} src={FINAL_SONG} loop preload="auto" />

      {stage > 1 && (
        <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 py-3">
          <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
            <span className="text-xs font-bold text-nowrap" dir="ltr">
              {stage} / {TOTAL}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/15 sm:w-40" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={stage} aria-label="تقدم الرحلة">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${(stage / TOTAL) * 100}%` }} />
            </div>
          </div>
          <button onClick={toggleMute} aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'} className="glass grid size-10 place-items-center rounded-full">
            {muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
          </button>
        </header>
      )}

      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-5 pt-20 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {stage === 1 && <GatewayStage onUnlock={unlock} />}
            {Middle && <Middle onNext={() => go(stage + 1)} />}
            {stage === TOTAL && <FinaleStage onReplay={replay} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
