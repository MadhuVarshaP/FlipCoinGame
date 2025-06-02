"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WalletBalance() {
  const [balance, setBalance] = useState("1.245")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshBalance = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Simulate slight balance change
    const newBalance = (Number.parseFloat(balance) + (Math.random() - 0.5) * 0.1).toFixed(3)
    setBalance(newBalance)
    setIsRefreshing(false)
  }

  return (
    <motion.div
      className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-purple-900/30 backdrop-blur-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-purple-400" />
        <div>
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-lg font-bold text-white">{balance} ETH</p>
        </div>
      </div>

      <Button variant="ghost" size="icon" onClick={refreshBalance} disabled={isRefreshing} className="ml-auto">
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>
    </motion.div>
  )
}
