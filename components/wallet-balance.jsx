"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Wallet, RefreshCw } from "lucide-react"
import { useAccount, useBalance } from "wagmi"
import { formatEther } from "viem"
import { Button } from "@/components/ui/button"

export default function WalletBalance() {
  const { address, isConnected } = useAccount()
  const [manualRefresh, setManualRefresh] = useState(false)

  const {
    data,
    isLoading,
    refetch
  } = useBalance({
    address,
    watch: true, 
    enabled: isConnected,
  })

  const refreshBalance = async () => {
    setManualRefresh(true)
    await refetch()
    setTimeout(() => setManualRefresh(false), 1000)
  }

  const formatted = data?.value ? parseFloat(formatEther(data.value)).toFixed(4) : "0.0000"

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

// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Wallet, RefreshCw } from "lucide-react"
// import { useAccount, useBalance } from "wagmi"
// import { formatEther } from "viem"
// import { Button } from "@/components/ui/button"
// import { formatEther as ethersFormatEther } from "ethers" // add ethers to parse hex

// export default function WalletBalance() {
//   const { address, isConnected } = useAccount()
//   const [manualRefresh, setManualRefresh] = useState(false)
//   const [debugBalance, setDebugBalance] = useState(null)

//   const {
//     data,
//     isLoading,
//     refetch
//   } = useBalance({
//     address,
//     watch: true,
//     enabled: isConnected,
//   })

//   const refreshBalance = async () => {
//     setManualRefresh(true)
//     await refetch()
//     setTimeout(() => setManualRefresh(false), 1000)
//   }

//   // Debug function to fetch raw balance from MetaMask directly
//   const debugFetchBalance = async () => {
//     if (!window.ethereum || !address) {
//       alert("No Ethereum provider or address found")
//       return
//     }

//     try {
//       const hexBalance = await window.ethereum.request({
//         method: "eth_getBalance",
//         params: [address, "latest"],
//       })

//       console.log("Raw hex balance:", hexBalance)

//       const ethBalance = ethersFormatEther(hexBalance)
//       console.log("Formatted ETH balance from window.ethereum:", ethBalance)

//       setDebugBalance(ethBalance)
//     } catch (error) {
//       console.error("Error fetching balance from window.ethereum:", error)
//       alert("Error fetching balance from MetaMask console")
//     }
//   }

//   const formatted = data?.value ? parseFloat(formatEther(data.value)).toFixed(4) : "0.0000"

//   return (
//     <>
//       <motion.div
//         className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-purple-900/30 backdrop-blur-sm"
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <div className="flex items-center gap-2">
//           <Wallet className="h-5 w-5 text-purple-400" />
//           <div>
//             <p className="text-sm text-gray-400">Balance</p>
//             <p className="text-lg font-bold text-white">
//               {isConnected && !isLoading ? `${formatted} ETH` : "—"}
//             </p>
//             {debugBalance && (
//               <p className="text-xs text-gray-400 mt-1">MetaMask raw balance: {debugBalance} ETH</p>
//             )}
//           </div>
//         </div>

//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={refreshBalance}
//           disabled={manualRefresh || isLoading}
//           className="ml-auto"
//           title="Refresh Wagmi balance"
//         >
//           <RefreshCw className={`h-4 w-4 ${manualRefresh ? "animate-spin" : ""}`} />
//         </Button>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={debugFetchBalance}
//           className="ml-4"
//           title="Fetch raw MetaMask balance"
//         >
//           Check MetaMask Balance
//         </Button>
//       </motion.div>
//     </>
//   )
// }
