"use client"

import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { Wallet } from "lucide-react"

export default function ConnectWalletButton() {
  const { login, ready } = usePrivy()

  if (!ready) {
    return (
      <button className="relative px-8 py-3 rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed" disabled>
        <span className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Loading...
        </span>
      </button>
    )
  }

  return (
    <motion.button
      className="relative px-8 py-3 rounded-lg bg-purple-700 text-white font-bold neon-border"
      onClick={login}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="absolute inset-0 rounded-lg bg-purple-600 opacity-0"
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />
      <span className="flex items-center gap-2">
        <Wallet className="h-5 w-5" />
        Connect Wallet
      </span>
    </motion.button>
  )
}
