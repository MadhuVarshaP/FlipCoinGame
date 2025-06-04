"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Wallet, RefreshCw } from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { formatEther } from "viem"
import { Button } from "@/components/ui/button"

export default function WalletBalance() {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [manualRefresh, setManualRefresh] = useState(false)

  const fetchBalance = async () => {
    if (!authenticated || !wallets.length) return
    
    setIsLoading(true)
    try {
      // Get the first wallet (embedded wallet)
      const wallet = wallets[0]
      if (!wallet) {
        console.error("No wallet found")
        return
      }

      // Get the provider from the wallet
      const provider = await wallet.getEthereumProvider()
      
      // Request balance using eth_getBalance
      const balanceHex = await provider.request({
        method: "eth_getBalance",
        params: [wallet.address, "latest"],
      })
      
      const balanceWei = BigInt(balanceHex)
      setBalance(balanceWei)
    } catch (error) {
      console.error("Error fetching balance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (ready && authenticated && wallets.length) {
      fetchBalance()
    }
  }, [ready, authenticated, wallets.length])

  const refreshBalance = async () => {
    setManualRefresh(true)
    await fetchBalance()
    setTimeout(() => setManualRefresh(false), 1000)
  }

  const formatted = balance ? parseFloat(formatEther(balance)).toFixed(4) : "0.0000"
  const isConnected = ready && authenticated && wallets.length > 0

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
          <p className="text-lg font-bold text-white">
            {isConnected && !isLoading ? `${formatted} ETH` : "—"}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={refreshBalance}
        disabled={manualRefresh || isLoading}
        className="ml-auto"
      >
        <RefreshCw className={`h-4 w-4 ${manualRefresh ? "animate-spin" : ""}`} />
      </Button>
    </motion.div>
  )
}
