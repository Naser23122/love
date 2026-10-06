'use client'

import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type CharacterProps = {
  who: 'abdo' | 'asmaa'
  says?: string
  size?: 'sm' | 'md' | 'lg'
  mood?: 'idle' | 'happy' | 'curious' | 'salute'
  className?: string
}

const sizes = { sm: 'size-16', md: 'size-24', lg: 'size-32 md:size-36' }

export function Character({ who, says, size = 'md', mood = 'idle', className }: CharacterProps) {
  const name = who === 'abdo' ? 'عبده' : 'أسماء'
  const animate =
    mood === 'happy'
      ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] }
      : mood === 'curious'
        ? { rotate: [0, -6, 0, 6, 0] }
        : mood === 'salute'
          ? { scale: [1, 1.12, 1], rotate: [0, -8, 0] }
          : { y: [0, -6, 0] }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.div
        animate={animate}
        transition={{ duration: mood === 'idle' ? 3 : 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-white to-pink-100 ring-4 ring-primary/60 shadow-[0_0_30px_-4px] shadow-primary',
          sizes[size],
        )}
      >
        <Image
          src={who === 'abdo' ? '/characters/abdo.png' : '/characters/asmaa.png'}
          alt={`شخصية ${name} الكرتونية`}
          fill
          sizes="160px"
          className="origin-[50%_16%] scale-[2.3] object-cover"
        />
      </motion.div>
      <AnimatePresence mode="wait">
        {says && (
          <motion.p
            key={says}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass relative max-w-64 rounded-2xl rounded-br-sm px-4 py-2 text-sm leading-relaxed text-pretty"
          >
            <span className="mb-0.5 block text-xs font-bold text-primary">{name}</span>
            {says}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function StageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <header className="mb-6 text-center">
      <p className="mb-2 text-xs font-bold tracking-widest text-accent">{eyebrow}</p>
      <h2 className="font-display text-3xl leading-tight text-balance text-glow md:text-5xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground text-pretty md:text-base">{subtitle}</p>}
    </header>
  )
}

export function GlowButton({
  children,
  className,
  variant = 'primary',
  ...props
}: React.ComponentProps<typeof motion.button> & { variant?: 'primary' | 'ghost' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary'
          ? 'bg-gradient-to-l from-primary to-fuchsia-500 text-primary-foreground shadow-[0_0_30px_-5px] shadow-primary'
          : 'glass text-foreground hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function NextButton({ show, onClick, label = 'كملي الرحلة ❤️' }: { show: boolean; onClick: () => void; label?: string }) {
  return (
    <div className="mt-8 flex h-14 justify-center">
      <AnimatePresence>
        {show && (
          <GlowButton initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={onClick}>
            {label}
          </GlowButton>
        )}
      </AnimatePresence>
    </div>
  )
}

export type StageProps = { onNext: () => void }
