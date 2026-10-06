'use client'

import { useEffect, useRef, useState } from 'react'
import { Disc3, Pause, Play } from 'lucide-react'
import { tracks } from '@/lib/content'
import { cn } from '@/lib/utils'
import { NextButton, StageHeader, type StageProps } from '../shared'

export const DUCK_EVENT = 'love:duck'

function duck(on: boolean) {
  window.dispatchEvent(new CustomEvent(DUCK_EVENT, { detail: on }))
}

function Reel({ spinning }: { spinning: boolean }) {
  return (
    <div
      className="relative grid size-16 place-items-center rounded-full border-4 border-neutral-300 bg-neutral-800 md:size-20"
      style={{ animation: spinning ? 'reel 1.6s linear infinite' : undefined }}
    >
      {[0, 60, 120].map((deg) => (
        <span key={deg} className="absolute h-full w-1.5 bg-neutral-300" style={{ transform: `rotate(${deg}deg)` }} />
      ))}
      <span className="relative size-5 rounded-full bg-neutral-200" />
    </div>
  )
}

export function MixtapeStage({ onNext }: StageProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [heard, setHeard] = useState<Set<number>>(new Set())

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      duck(false)
    }
  }, [])

  function select(i: number) {
    const audio = audioRef.current
    if (!audio) return
    if (active === i) {
      if (audio.paused) audio.play().catch(() => {})
      else audio.pause()
      return
    }
    setActive(i)
    setProgress(0)
    setHeard((s) => new Set(s).add(i))
    audio.src = tracks[i].src
    audio.play().catch(() => {})
  }

  const track = active !== null ? tracks[active] : null

  return (
    <section className="flex flex-col items-center">
      <StageHeader eyebrow="المحطة ٥ — شريط الكاسيت" title="ميكس تيب عبده وأسماء" subtitle="دوسي على أي تراك واسمعي صوتي ❤️" />

      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => {
          setPlaying(true)
          duck(true)
        }}
        onPause={() => {
          setPlaying(false)
          duck(false)
        }}
        onEnded={() => {
          setPlaying(false)
          duck(false)
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget
          if (a.duration) setProgress(a.currentTime / a.duration)
        }}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-rose-300 to-pink-500 p-4 shadow-[0_20px_60px_-15px] shadow-primary">
        <div className="rounded-lg bg-parchment px-4 py-2 text-center font-display text-xl text-ink">
          {track ? `${track.side} — ${track.title}` : 'Asmaa ♥ Abdo — Vol. 1'}
        </div>
        <div className="mt-4 flex items-center justify-around rounded-xl bg-neutral-900/90 py-4" dir="ltr">
          <Reel spinning={playing} />
          <div className="h-10 w-24 overflow-hidden rounded-md border border-white/20 bg-neutral-700/60">
            <div className="h-full bg-primary/60 transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
          <Reel spinning={playing} />
        </div>
        <div className="mx-auto mt-3 h-4 w-2/3 rounded-t-lg bg-neutral-900/30" />
      </div>

      <ul className="mt-6 grid w-full max-w-md gap-2">
        {tracks.map((t, i) => {
          const isActive = active === i
          const isPlaying = isActive && playing
          return (
            <li key={t.src}>
              <button
                onClick={() => select(i)}
                aria-pressed={isPlaying}
                className={cn(
                  'glass flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition-colors hover:bg-white/10',
                  isActive && 'ring-2 ring-primary',
                )}
              >
                <Disc3 className={cn('size-5 shrink-0 text-primary', isPlaying && 'animate-spin')} aria-hidden="true" />
                <span className="flex-1 font-bold">{t.title}</span>
                {isPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
                <span className="sr-only">{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <NextButton show={heard.size >= 1} onClick={onNext} />
    </section>
  )
}
