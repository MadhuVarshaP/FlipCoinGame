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
import { Progress } from "@/components/ui/progress"
import BackgroundGrid from "@/components/background-grid"

// Mock data - in a real app, this would come from your backend or blockchain events
const mockGameHistory = [
  { id: 1, date: "2023-06-01", choice: "heads", result: "heads", stake: "0.05", outcome: "win" },
  { id: 2, date: "2023-06-01", choice: "tails", result: "heads", stake: "0.1", outcome: "lose" },
  { id: 3, date: "2023-06-02", choice: "heads", result: "tails", stake: "0.02", outcome: "lose" },
  { id: 4, date: "2023-06-03", choice: "tails", result: "tails", stake: "0.05", outcome: "win" },
  { id: 5, date: "2023-06-04", choice: "heads", result: "heads", stake: "0.03", outcome: "win" },
]

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

  // Calculate stats
  const totalGames = mockGameHistory.length
  const wins = mockGameHistory.filter((game) => game.outcome === "win").length
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0

  const totalStaked = mockGameHistory.reduce((sum, game) => sum + Number.parseFloat(game.stake), 0)
  const totalWon = mockGameHistory
    .filter((game) => game.outcome === "win")
    .reduce((sum, game) => sum + Number.parseFloat(game.stake) * 2, 0)
  const netProfit = totalWon - totalStaked

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

          {/* User Info Section */}
          <div className="mb-8">
            <Card className="bg-gray-900 border border-green-900 neon-border-green">
              <CardHeader>
                <CardTitle className="text-green-300">User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium mt-1">
                      {user?.email?.address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="font-mono text-sm mt-1 truncate">
                      {user?.id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created At</p>
                    <p className="text-sm mt-1">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Wallet Type</p>
                    <p className="text-sm mt-1 text-green-400">
                      {wallets.length > 0 ? "Embedded Wallet" : "No Wallet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    <div className="pt-2">
                      <Button
                        onClick={handleExportWallet}
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/20"
                      >
                        Export Private Key
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-cyan-900 neon-border-cyan">
              <CardHeader>
                <CardTitle className="text-cyan-300">Game Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Win Rate</span>
                      <span className="text-sm font-bold">{winRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={winRate} className="h-2 bg-gray-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-400">Games Played</p>
                      <p className="text-xl font-bold">{totalGames}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Net Profit</p>
                      <p className={`text-xl font-bold ${netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {netProfit.toFixed(2)} ETH
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border border-pink-900 neon-border-pink">
            <CardHeader>
              <CardTitle className="text-pink-300">Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Choice</th>
                      <th className="text-left py-3 px-2">Result</th>
                      <th className="text-left py-3 px-2">Stake</th>
                      <th className="text-left py-3 px-2">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockGameHistory.map((game) => (
                      <tr key={game.id} className="border-b border-gray-800">
                        <td className="py-3 px-2">{game.date}</td>
                        <td className="py-3 px-2 capitalize">{game.choice}</td>
                        <td className="py-3 px-2 capitalize">{game.result}</td>
                        <td className="py-3 px-2">{game.stake} ETH</td>
                        <td
                          className={`py-3 px-2 capitalize ${
                            game.outcome === "win" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {game.outcome}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
