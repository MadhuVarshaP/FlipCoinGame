"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { useToast } from "@/components/ui/use-toast"
import { useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useAccount } from "wagmi"
import { parseEther } from "viem"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

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
  const { address } = useAccount()
  const { toast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [choice, setChoice] = useState(null)
  const [stakeAmount, setStakeAmount] = useState("0.01")
  const [isFlipping, setIsFlipping] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [resultCoinSide, setResultCoinSide] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [gameStats, setGameStats] = useState({ totalGames: 5, wins: 3, totalStaked: 0.25, netProfit: 0.05 })

  useEffect(() => {
    setMounted(true)
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  const { writeContractAsync } = useWriteContract()

useWaitForTransactionReceipt({
  hash: txHash,
  onSuccess() {
    console.log("Transaction confirmed", txHash)
    setIsFlipping(false)
  },
  onError(error) {
    console.error("Transaction error:", error)
    setIsFlipping(false)
    toast({ title: "Transaction failed", description: error.message, variant: "destructive" })
  },
})

useWatchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  eventName: "GamePlayed",
  onLogs(logs) {
    console.log("GamePlayed event logs:", logs)
    if (!logs.length) return
    const [player, choiceNum, resultNum, win, reward] = logs[0].args
    if (player.toLowerCase() !== address?.toLowerCase()) {
      console.log("Ignoring event from other player", player)
      return
    }

    setResult(win ? "win" : "lose")
    setResultCoinSide(resultNum === 0 ? "heads" : "tails")
    setIsFlipping(false)
    setShowResult(true)

    if (typeof window !== "undefined") {
      if (win && window.playWinSound) window.playWinSound()
      else if (!win && window.playLoseSound) window.playLoseSound()
    }
  },
})


  const handleFlip = async () => {
    if (!choice) {
      toast({ title: "Choose a side", description: "Please select Heads or Tails first", variant: "destructive" })
      return
    }

    if (Number.parseFloat(stakeAmount) < 0.01) {
      toast({ title: "Invalid stake", description: "Minimum stake is 0.01 ETH", variant: "destructive" })
      return
    }

    try {
      setIsFlipping(true)
      if (typeof window !== "undefined" && window.playFlipSound) {
        window.playFlipSound()
      }

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "playGame",
        args: [choice === "heads" ? 0 : 1],
        value: parseEther(stakeAmount),
      })

      setTxHash(tx.hash)
    } catch (err) {
      console.error(err)
      setIsFlipping(false)
      toast({ title: "Transaction failed", description: err.message, variant: "destructive" })
    }
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