"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Share2, Repeat } from "lucide-react"
import confetti from "canvas-confetti"

export default function FlipResultModal({ result, stakeAmount, onClose }) {
  const isWin = result === "win"

  useEffect(() => {
    if (isWin) {
      // Trigger confetti on win
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [isWin])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
            >
              {isWin ? (
                <CheckCircle className="h-20 w-20 text-green-500" />
              ) : (
                <XCircle className="h-20 w-20 text-red-500" />
              )}
            </motion.div>

            <motion.h2
              className={`mt-4 text-3xl font-bold ${isWin ? "text-green-500" : "text-red-500"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isWin ? "You Won!" : "You Lost"}
            </motion.h2>

            <motion.p
              className="mt-2 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isWin
                ? `You've won ${(Number.parseFloat(stakeAmount) * 3/2).toFixed(4)} ETH!`
                : `You've lost ${stakeAmount} ETH.`}
            </motion.p>

            <div className="mt-8 flex flex-col w-full gap-3">
              <motion.button
                className={`w-full px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
                  isWin ? "bg-green-700 hover:bg-green-600 text-white" : "bg-purple-700 hover:bg-purple-600 text-white"
                }`}
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Repeat className="h-5 w-5" />
                Play Again
              </motion.button>

              <motion.button
                className="w-full px-4 py-3 rounded-lg font-bold bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Share2 className="h-5 w-5" />
                Share Result
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
