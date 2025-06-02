"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import FlipCard from "@/components/flip-card"
import StakeInput from "@/components/stake-input"
import ChoiceButtons from "@/components/choice-buttons"
import FlipResultModal from "@/components/flip-result-modal"
import LoadingSpinner from "@/components/loading-spinner"
import BackgroundGrid from "@/components/background-grid"
import GameStats from "@/components/game-stats"
import WalletBalance from "@/components/wallet-balance"

export default function GamePage() {
  const router = useRouter()
  const { authenticated, ready } = usePrivy()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [choice, setChoice] = useState(null) // "heads" or "tails"
  const [stakeAmount, setStakeAmount] = useState("0.01")
  const [isFlipping, setIsFlipping] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null) // "win" or "lose"
  const [resultCoinSide, setResultCoinSide] = useState(null) // "heads" or "tails"
  const [gameStats, setGameStats] = useState({
    totalGames: 5,
    wins: 3,
    totalStaked: 0.25,
    netProfit: 0.05,
  })

  useEffect(() => {
    setMounted(true)
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  const handleFlip = () => {
    if (!choice) {
      toast({
        title: "Choose a side",
        description: "Please select Heads or Tails first",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(stakeAmount) < 0.01) {
      toast({
        title: "Invalid stake",
        description: "Minimum stake is 0.01 ETH",
        variant: "destructive",
      })
      return
    }

    setIsFlipping(true)

    // Play flip sound
    if (typeof window !== "undefined" && window.playFlipSound) {
      window.playFlipSound()
    }

    // Simulate blockchain transaction
    setTimeout(() => {
      // Random result (50% chance)
      const flipResult = Math.random() > 0.5 ? "heads" : "tails"
      const userWon = flipResult === choice

      setResultCoinSide(flipResult)
      setResult(userWon ? "win" : "lose")
      setIsFlipping(false)
      setShowResult(true)

      // Play result sound
      if (typeof window !== "undefined") {
        if (userWon && window.playWinSound) {
          window.playWinSound()
        } else if (!userWon && window.playLoseSound) {
          window.playLoseSound()
        }
      }
    }, 3000)
  }

  const resetGame = () => {
    setChoice(null)
    setStakeAmount("0.01")
    setShowResult(false)
    setResult(null)
    setResultCoinSide(null)
  }

  if (!mounted || !ready || !authenticated) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <BackgroundGrid />
      <Navbar />

      <main className="container relative z-10 mx-auto px-4 py-8">
        <WalletBalance />

        <motion.div
          className="flex flex-col items-center justify-center gap-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold text-center neon-text"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Flip The Coin
          </motion.h1>

          <GameStats stats={gameStats} />

          <ChoiceButtons choice={choice} setChoice={setChoice} disabled={isFlipping} />

          <div className="my-8">
            <FlipCard isFlipping={isFlipping} resultSide={resultCoinSide} />
          </div>

          <StakeInput value={stakeAmount} onChange={setStakeAmount} disabled={isFlipping} />

          <motion.button
            className={`mt-6 px-8 py-3 rounded-lg text-lg font-bold transition-all
              ${isFlipping ? "bg-gray-700 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600 neon-border"}`}
            onClick={handleFlip}
            disabled={isFlipping}
            whileHover={!isFlipping ? { scale: 1.05 } : {}}
            whileTap={!isFlipping ? { scale: 0.95 } : {}}
          >
            {isFlipping ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span>Flipping...</span>
              </div>
            ) : (
              "Flip Coin"
            )}
          </motion.button>
        </motion.div>
      </main>

      {showResult && <FlipResultModal result={result} stakeAmount={stakeAmount} onClose={resetGame} />}
    </div>
  )
}
