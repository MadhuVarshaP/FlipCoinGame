"use client"

import { motion } from "framer-motion"

export default function ChoiceButtons({ choice, setChoice, disabled }) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.button
        className={`relative px-6 py-3 rounded-lg font-bold transition-all ${
          choice === "heads" ? "bg-cyan-700 text-white neon-border-cyan" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setChoice("heads")}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        disabled={disabled}
      >
        {choice === "heads" && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-cyan-500 opacity-0"
            animate={{
              opacity: [0, 0.2, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        )}
        Heads
      </motion.button>

      <motion.button
        className={`relative px-6 py-3 rounded-lg font-bold transition-all ${
          choice === "tails" ? "bg-pink-700 text-white neon-border-pink" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setChoice("tails")}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        disabled={disabled}
      >
        {choice === "tails" && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-pink-500 opacity-0"
            animate={{
              opacity: [0, 0.2, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        )}
        Tails
      </motion.button>
    </motion.div>
  )
}
