"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function FlipCard({ isFlipping, resultSide }) {

  return (
    <div className="perspective-1000 relative h-48 w-48" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative h-full w-full transition-transform duration-1000"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: isFlipping ? [0, 1080] : resultSide === "heads" ? 0 : 180,
        }}
        transition={{
          duration: isFlipping ? 2 : 0.5,
          ease: "easeOut",
        }}
      >
        {/* Heads */}
        <div className="coin-side absolute h-full w-full rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border-8 border-yellow-600 flex items-center justify-center shadow-lg">
          <div className="text-yellow-800 text-5xl font-bold">H</div>
        </div>

        {/* Tails */}
        <div className="coin-side coin-back absolute h-full w-full rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 border-8 border-yellow-700 flex items-center justify-center shadow-lg">
          <div className="text-yellow-900 text-5xl font-bold">T</div>
        </div>
      </motion.div>

      {/* Coin shadow */}
      <motion.div
        className="absolute -bottom-8 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-black/30 blur-md"
        animate={{
          scaleX: isFlipping ? [1, 0.6, 1] : 1,
          opacity: isFlipping ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{
          duration: isFlipping ? 2 : 0.5,
          ease: "easeInOut",
        }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-0 pointer-events-none"
        animate={{
          opacity: isFlipping ? [0, 0.3, 0] : 0,
        }}
        transition={{
          duration: isFlipping ? 2 : 0.5,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
