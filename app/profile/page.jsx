"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { formatEther } from "viem"
import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import BackgroundGrid from "@/components/background-grid"



export default function ProfilePage() {
  const router = useRouter()
  const { authenticated, ready, user, exportWallet } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [walletBalance, setWalletBalance] = useState(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)


  useEffect(() => {
    setMounted(true)
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!wallets.length) return
    
    setIsLoadingBalance(true)
    try {
      const wallet = wallets[0]
      const provider = await wallet.getEthereumProvider()
      
      const balanceHex = await provider.request({
        method: "eth_getBalance",
        params: [wallet.address, "latest"],
      })
      
      const balanceWei = BigInt(balanceHex)
      setWalletBalance(balanceWei)
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }



  useEffect(() => {
    if (ready && authenticated && wallets.length) {
      fetchWalletBalance()
    }
  }, [ready, authenticated, wallets.length])

  // Debug: Log user and wallet data
  useEffect(() => {
    if (ready && authenticated) {
      console.log("User data:", user)
      console.log("Wallets data:", wallets)
    }
  }, [ready, authenticated, user, wallets])

  // Utility functions
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      })
    }
  }

  const openInExplorer = (addressOrTx, type = 'address') => {
    const baseUrl = 'https://sepolia.etherscan.io'
    const explorerUrl = type === 'tx' 
      ? `${baseUrl}/tx/${addressOrTx}`
      : `${baseUrl}/address/${addressOrTx}`
    window.open(explorerUrl, '_blank')
  }

  const handleExportWallet = async () => {
    try {
      await exportWallet()
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export wallet",
        variant: "destructive",
      })
    }
  }

  if (!mounted || !ready || !authenticated) return null

  const walletAddress = wallets.length > 0 ? wallets[0].address : null
  const formattedBalance = walletBalance ? parseFloat(formatEther(walletBalance)).toFixed(4) : "0.0000"
  
  // Get wallet connection details
  const getWalletConnectionStatus = () => {
    if (!wallets.length) return { status: "No Wallet", color: "text-red-400" }
    
    const wallet = wallets[0]
    if (wallet.connectorType === "embedded") {
      return { status: "Embedded Wallet", color: "text-green-400" }
    } else if (wallet.connectorType === "injected") {
      return { status: "Browser Wallet", color: "text-blue-400" }
    } else {
      return { status: "External Wallet", color: "text-purple-400" }
    }
  }
  
  const walletStatus = getWalletConnectionStatus()
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "N/A"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }



  return (
    <div className="min-h-screen bg-black text-white">
      <BackgroundGrid />
      <Navbar />

      <main className="container relative z-10 mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold mb-8 neon-text text-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Profile
          </motion.h1>

          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900 border border-purple-900 neon-border">
              <CardHeader>
                <CardTitle className="text-purple-300">Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Connected Address</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-mono text-sm truncate flex-1">
                        {walletAddress || "No wallet connected"}
                      </p>
                      {walletAddress && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(walletAddress)}
                            className="h-6 w-6 p-0 text-purple-400 hover:text-purple-300"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openInExplorer(walletAddress)}
                            className="h-6 w-6 p-0 text-purple-400 hover:text-purple-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xl font-bold">
                        {isLoadingBalance ? "Loading..." : `${formattedBalance} ETH`}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={fetchWalletBalance}
                        disabled={isLoadingBalance}
                        className="h-6 w-6 p-0 text-purple-400 hover:text-purple-300"
                      >
                        <RefreshCw className={`h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Network</p>
                    <p className="text-sm font-bold mt-1 text-cyan-400">Sepolia Testnet</p>
                  </div>

                  {walletAddress && (
                    <div className="pt-2 space-y-2">
                      <Button
                        onClick={handleExportWallet}
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/20"
                      >
                        Export Private Key
                      </Button>
                      <Button
                        onClick={fetchWalletBalance}
                        variant="outline"
                        size="sm"
                        className="w-full border-cyan-700 text-cyan-300 hover:bg-cyan-900/20"
                        disabled={isLoadingBalance}
                      >
                        {isLoadingBalance ? "Refreshing..." : "Refresh Balance"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
