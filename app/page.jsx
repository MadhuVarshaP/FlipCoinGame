"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import ConnectWalletButton from "@/components/connect-wallet-button"
import BackgroundGrid from "@/components/background-grid"
import FloatingCoins from "@/components/floating-coins"

export default function Home() {
  const router = useRouter()
  const { authenticated } = usePrivy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (authenticated) {
      router.push("/game")
    }
  }, [authenticated, router])

  if (!mounted) return null

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <BackgroundGrid />
      <FloatingCoins />

      <div className="container relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight neon-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Flip-a-Coin
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl font-medium text-purple-300 neon-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Stake ETH. Flip Fate.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ConnectWalletButton />
        </motion.div>

        <motion.div
          className="mt-12 max-w-md text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>Connect your wallet to start playing. Double your ETH with a lucky flip!</p>
        </motion.div>
      </div>
    </main>
  )
}
