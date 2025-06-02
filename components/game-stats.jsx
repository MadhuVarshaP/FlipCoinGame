"use client"

import { motion } from "framer-motion"
import { TrendingUp, Target, Coins, Trophy } from "lucide-react"

export default function GameStats({ stats = {} }) {
  const { totalGames = 0, wins = 0, totalStaked = 0, netProfit = 0 } = stats

  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0

  const statItems = [
    {
      icon: Target,
      label: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: Trophy,
      label: "Games Won",
      value: wins,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      icon: Coins,
      label: "Total Staked",
      value: `${totalStaked.toFixed(2)} ETH`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: TrendingUp,
      label: "Net Profit",
      value: `${netProfit >= 0 ? "+" : ""}${netProfit.toFixed(2)} ETH`,
      color: netProfit >= 0 ? "text-green-500" : "text-red-500",
      bgColor: netProfit >= 0 ? "bg-green-500/10" : "bg-red-500/10",
      borderColor: netProfit >= 0 ? "border-green-500/30" : "border-red-500/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          className={`p-4 rounded-lg border ${item.bgColor} ${item.borderColor} backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon className={`h-5 w-5 ${item.color}`} />
            <span className="text-sm text-gray-400">{item.label}</span>
          </div>
          <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
        </motion.div>
      ))}
    </div>
  )
}
