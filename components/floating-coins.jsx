"use client"

import { motion } from "framer-motion"

export default function FloatingCoins() {
  // Generate random positions for coins
  const coins = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 20,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border-2 border-yellow-600"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: coin.size,
            height: coin.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: [0, -100, -200],
            rotate: [0, 360],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5 + 5,
          }}
        />
      ))}
    </div>
  )
}
