"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

const FULL_LETTER = `حبيبتي أسماء،

كل خطوة وكل لحظة عشناها سوا كانت هي أجمل حاجة حصلت في حياتي.
أنتِ النعمة والونس والأمان اللي دايماً بحمد ربنا عليه.
وجودك جنبي بيخلي كل صعب يهون، وأملي وفرحتي في الدنيا إننا نفضل سوا دايماً وفي كل خطوة جاية.

بحبك من كل قلبي ❤️`

export default function Stage14Proposal() {
  const [displayedText, setDisplayedText] = useState("")
  const [isFinished, setIsFinished] = useState(false)

  // تأثير الألعاب النارية والقلوب
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff4d6d", "#ff758f", "#ffb3c1", "#ffffff"]
      })
    } catch (e) {
      // تجنب حدوث خطأ لو المكتبة غير محملة
    }
  }

  // كتابة النص تدريجياً تلقائياً
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < FULL_LETTER.length) {
        setDisplayedText(FULL_LETTER.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsFinished(true)
        triggerCelebration()
      }
    }, 45)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] p-4 text-center overflow-hidden">
      {/* خلفية بتلات الورد المتساقطة */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/30 text-xl"
            initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 0 }}
            animate={{
              y: 800,
              x: Math.random() * 400 - 200,
              opacity: [0, 0.8, 0],
              rotate: 360,
            }}
            transition={{
              duration: 7 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            style={{ left: `${Math.random() * 100}%` }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-pink-300/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl"
          >
            💌
          </motion.div>
        </div>

        {/* عرض النص مع تأثير الآلة الكاتبة */}
        <div 
          className="text-right whitespace-pre-line text-pink-50 text-base sm:text-lg leading-relaxed font-sans mb-6 min-h-[160px]"
          dir="rtl"
        >
          {displayedText}
          {!isFinished && (
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="inline-block w-1.5 h-5 bg-pink-400 mr-1 align-middle"
            />
          )}
        </div>

        {/* ظهور الصورة والاحتفال النهائي */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-pink-200/20"
            >
              <div className="relative w-36 h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-pink-500 to-rose-300 shadow-lg">
                <img
                  src="/final.jpg"
                  alt="Us"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // في حال عدم وجود ملف الصورة يتم وضع خلفية بديلة
                    (e.target as HTMLElement).style.display = "none"
                  }}
                />
              </div>

              <motion.h2 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-2xl font-bold text-pink-200 mt-2 font-serif"
              >
                بحبك يا أسماء ❤️
              </motion.h2>

              <button
                onClick={triggerCelebration}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-md hover:opacity-90 active:scale-95 transition-all mt-2"
              >
                🎉 احتفال
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
