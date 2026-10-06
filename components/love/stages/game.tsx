'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { heartBurst, playChime, playHeartbeat } from '@/lib/sfx'
import { GlowButton, NextButton, StageHeader, type StageProps } from '../shared'

const GOAL = 10
const W = 360
const H = 480

type Thing = { x: number; y: number; kind: 'heart' | 'cloud'; speed: number }

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s / 32, s / 32)
  ctx.beginPath()
  ctx.moveTo(0, 10)
  ctx.bezierCurveTo(-16, -2, -16, -16, -6, -16)
  ctx.bezierCurveTo(-2, -16, 0, -12, 0, -10)
  ctx.bezierCurveTo(0, -12, 2, -16, 6, -16)
  ctx.bezierCurveTo(16, -16, 16, -2, 0, 10)
  ctx.fillStyle = '#ff4d9d'
  ctx.shadowColor = '#ff4d9d'
  ctx.shadowBlur = 16
  ctx.fill()
  ctx.restore()
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.fillStyle = '#5b5876'
  ctx.beginPath()
  ctx.arc(x - 14, y + 4, 12, 0, Math.PI * 2)
  ctx.arc(x, y - 4, 16, 0, Math.PI * 2)
  ctx.arc(x + 15, y + 4, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#f7c873'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y + 12)
  ctx.lineTo(x - 5, y + 22)
  ctx.lineTo(x + 3, y + 22)
  ctx.lineTo(x - 2, y + 32)
  ctx.stroke()
  ctx.restore()
}

export function GameStage({ onNext }: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const playerX = useRef(W / 2)
  const keys = useRef({ left: false, right: false })

  useEffect(() => {
    if (!running) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const avatar = new window.Image()
    avatar.crossOrigin = 'anonymous'
    avatar.src = '/characters/abdo.png'

    let things: Thing[] = []
    let localScore = 0
    let spawn = 0
    let raf = 0
    let last = performance.now()
    let flash = 0

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      spawn -= dt
      if (spawn <= 0) {
        spawn = 0.55 + Math.random() * 0.4
        things.push({
          x: 30 + Math.random() * (W - 60),
          y: -20,
          kind: Math.random() < 0.62 ? 'heart' : 'cloud',
          speed: 130 + Math.random() * 90 + localScore * 8,
        })
      }
      if (keys.current.left) playerX.current -= 320 * dt
      if (keys.current.right) playerX.current += 320 * dt
      playerX.current = Math.max(30, Math.min(W - 30, playerX.current))

      const py = H - 60
      things = things.filter((t) => {
        t.y += t.speed * dt
        const hit = Math.abs(t.x - playerX.current) < 36 && Math.abs(t.y - py) < 36
        if (hit) {
          if (t.kind === 'heart') {
            localScore += 1
            playHeartbeat(0.4)
          } else {
            localScore = Math.max(0, localScore - 1)
            flash = 0.3
          }
          setScore(localScore)
          return false
        }
        return t.y < H + 40
      })

      ctx.clearRect(0, 0, W, H)
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#1a1040')
      grad.addColorStop(1, '#3b1650')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      if (flash > 0) {
        flash -= dt
        ctx.fillStyle = `rgba(255,80,80,${flash})`
        ctx.fillRect(0, 0, W, H)
      }
      things.forEach((t) => (t.kind === 'heart' ? drawHeart(ctx, t.x, t.y, 34) : drawCloud(ctx, t.x, t.y)))

      ctx.save()
      ctx.beginPath()
      ctx.arc(playerX.current, py, 30, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.clip()
      if (avatar.complete && avatar.naturalWidth) {
        const sw = avatar.naturalHeight * 0.32
        ctx.drawImage(avatar, avatar.naturalWidth / 2 - sw / 2, avatar.naturalHeight * 0.04, sw, sw, playerX.current - 30, py - 30, 60, 60)
      }
      ctx.restore()
      ctx.strokeStyle = '#ff4d9d'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(playerX.current, py, 31, 0, Math.PI * 2)
      ctx.stroke()

      if (localScore >= GOAL) {
        setRunning(false)
        setWon(true)
        playChime()
        heartBurst(120)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = true
      if (e.key === 'ArrowRight') keys.current.right = true
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = false
      if (e.key === 'ArrowRight') keys.current.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [running])

  function movePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    playerX.current = ((e.clientX - rect.left) / rect.width) * W
  }

  return (
    <section className="flex flex-col items-center">
      <StageHeader
        eyebrow="المحطة ١٠ — لعبة الوصول"
        title="ساعدي عبده يوصل لأسماء"
        subtitle="حركي عبده يمين وشمال، لمي ١٠ قلوب وابعدي عن سحاب الزعل"
      />

      {!won ? (
        <div className="relative w-full max-w-[360px]">
          <div className="mb-3 flex items-center justify-between text-sm font-bold">
            <span>القلوب: {score} / {GOAL}</span>
            <span className="text-muted-foreground">أسماء مستنياك ❤️</span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-primary transition-all" style={{ width: `${(score / GOAL) * 100}%` }} />
          </div>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerMove={movePointer}
            onPointerDown={movePointer}
            className="aspect-[3/4] w-full touch-none rounded-3xl ring-2 ring-primary/50"
            aria-label="لعبة جمع القلوب"
          />
          {!running && (
            <div className="absolute inset-0 top-12 grid place-items-center rounded-3xl bg-black/40">
              <GlowButton onClick={() => setRunning(true)}>يلا نبدأ</GlowButton>
            </div>
          )}
        </div>
      ) : (
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="w-full max-w-sm text-center">
          <div className="relative aspect-square overflow-hidden rounded-3xl ring-4 ring-primary shadow-[0_0_60px_-10px] shadow-primary">
            <Image src="/characters/hug.png" alt="عبده بيحضن أسماء" fill sizes="384px" className="object-cover" />
          </div>
          <p className="mt-5 font-display text-2xl text-glow">وصلت ليكي أخيراً.. ومش هسيبك تاني 🫂</p>
        </motion.div>
      )}

      <NextButton show={won} onClick={onNext} />
    </section>
  )
}
