"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useToast } from "@/components/ui/use-toast"
import { parseEther, encodeFunctionData } from "viem"
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
  const { ready, authenticated, user, createWallet } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [choice, setChoice] = useState(null)
  const [stakeAmount, setStakeAmount] = useState("0.01")
  const [isFlipping, setIsFlipping] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [resultCoinSide, setResultCoinSide] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [gameStats, setGameStats] = useState({
    totalGames: 5,
    wins: 3,
    totalStaked: 0.25,
    netProfit: 0.05,
  })

  const userAddress = wallets.length > 0 ? wallets[0].address : null

  useEffect(() => {
    setMounted(true)
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  // Create wallet if user doesn't have one
  useEffect(() => {
    const ensureWallet = async () => {
      if (ready && authenticated && wallets.length === 0) {
        try {
          console.log("Creating embedded wallet...")
          await createWallet()
          console.log("Embedded wallet created successfully")
        } catch (error) {
          console.error("Failed to create wallet:", error)
          toast({
            title: "Wallet Creation Failed",
            description: "Failed to create embedded wallet. Please try refreshing the page.",
            variant: "destructive",
          })
        }
      }
    }
    
    ensureWallet()
  }, [ready, authenticated, wallets.length, createWallet, toast])

  // Debug wallet state
  useEffect(() => {
    console.log("Wallet state:", { ready, authenticated, walletsCount: wallets.length, wallets })
  }, [ready, authenticated, wallets])

  // Poll for transaction receipt and events
  const pollForTransactionResult = async (txHash) => {
    try {
      // Wait for transaction to be mined
      const receipt = await waitForTransactionReceipt(txHash)
      console.log("Transaction confirmed", txHash)
      
      // Parse events from the receipt
      const gamePlayedEvent = receipt.logs.find(log => 
        log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
      )
      
      if (gamePlayedEvent) {
        // Decode the event data (simplified - you might need to properly decode based on your ABI)
        // For now, we'll simulate the result
        const win = Math.random() > 0.5 // Temporary - replace with actual event parsing
        const resultNum = Math.floor(Math.random() * 2)
        
        setResult(win ? "win" : "lose")
        setResultCoinSide(resultNum === 0 ? "heads" : "tails")
        setIsFlipping(false)
        setShowResult(true)

        if (typeof window !== "undefined") {
          if (win && window.playWinSound) window.playWinSound()
          else if (!win && window.playLoseSound) window.playLoseSound()
        }
      }
    } catch (error) {
      console.error("Transaction error:", error)
      setIsFlipping(false)
      toast({
        title: "Transaction failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Helper function to wait for transaction receipt
  const waitForTransactionReceipt = async (txHash) => {
    if (!wallets.length) throw new Error("No wallet available")
    
    const wallet = wallets[0]
    const provider = await wallet.getEthereumProvider()
    let receipt = null
    let attempts = 0
    const maxAttempts = 60 // 60 seconds timeout
    
    while (!receipt && attempts < maxAttempts) {
      try {
        receipt = await provider.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        })
        if (receipt) break
      } catch (error) {
        // Transaction not yet mined
      }
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      attempts++
    }
    
    if (!receipt) {
      throw new Error("Transaction timeout")
    }
    
    return receipt
  }

  const handleFlip = async () => {
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

    if (wallets.length === 0) {
      toast({
        title: "No wallet found",
        description: "Please wait for wallet creation or refresh the page",
        variant: "destructive",
      })
      return
    }

    try {
      setIsFlipping(true)

      if (typeof window !== "undefined" && window.playFlipSound) {
        window.playFlipSound()
      }

      // Encode the function call data
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: "playGame",
        args: [choice === "heads" ? 0 : 1],
      })

      // Get the wallet and send transaction directly
      const wallet = wallets[0]
      const provider = await wallet.getEthereumProvider()
      
      // Send transaction using the wallet's provider
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: wallet.address,
          to: CONTRACT_ADDRESS,
          value: `0x${parseEther(stakeAmount).toString(16)}`,
          data: data,
        }],
      })

      setTxHash(txHash)
      
      // Poll for transaction result
      await pollForTransactionResult(txHash)
      
    } catch (err) {
      console.error(err)
      setIsFlipping(false)
      toast({
        title: "Transaction failed",
        description: err.message || "Failed to send transaction",
        variant: "destructive",
      })
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

          <ChoiceButtons
            choice={choice}
            setChoice={setChoice}
            disabled={isFlipping}
          />

          <div className="my-8">
            <FlipCard isFlipping={isFlipping} resultSide={resultCoinSide} />
          </div>

          <StakeInput
            value={stakeAmount}
            onChange={setStakeAmount}
            disabled={isFlipping}
          />

          <motion.button
            className={`mt-6 px-8 py-3 rounded-lg text-lg font-bold transition-all
              ${isFlipping
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-600 neon-border"}`}
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

      {showResult && (
        <FlipResultModal
          result={result}
          stakeAmount={stakeAmount}
          onClose={resetGame}
        />
      )}
    </div>
  )
}
