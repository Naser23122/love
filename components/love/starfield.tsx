'use client'

import { useMemo } from 'react'

function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: seeded(i) * 100,
        top: seeded(i + 100) * 100,
        size: 1 + seeded(i + 200) * 2.2,
        delay: seeded(i + 300) * 5,
        duration: 2 + seeded(i + 400) * 4,
      })),
    [],
  )
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: seeded(i + 500) * 100,
        delay: seeded(i + 600) * 18,
        duration: 14 + seeded(i + 700) * 12,
        size: 8 + seeded(i + 800) * 10,
      })),
    [],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.14_300)_0%,oklch(0.16_0.07_285)_45%,oklch(0.1_0.04_280)_100%)]" />
      <div className="absolute -bottom-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
          }}
        />
      ))}
      {particles.map((p, i) => (
        <span
          key={`p${i}`}
          className="absolute bottom-0 text-primary/60"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {'♥'}
        </span>
      ))}
    </div>
  )
}
