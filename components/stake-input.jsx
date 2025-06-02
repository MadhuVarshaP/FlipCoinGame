"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function StakeInput({ value, onChange, disabled }) {
  const [focused, setFocused] = useState(false)

  const handleIncrement = () => {
    const currentValue = Number.parseFloat(value)
    onChange((currentValue + 0.01).toFixed(2))
  }

  const handleDecrement = () => {
    const currentValue = Number.parseFloat(value)
    const newValue = Math.max(0.01, currentValue - 0.01)
    onChange(newValue.toFixed(2))
  }

  const handleSliderChange = (newValue) => {
    onChange(newValue[0].toFixed(2))
  }

  return (
    <motion.div
      className={`w-full max-w-xs ${disabled ? "opacity-70" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <label className="block text-sm font-medium text-gray-300 mb-2">Stake Amount (ETH)</label>

      <div className="relative">
        <motion.div
          className={`flex rounded-lg border ${
            focused ? "border-purple-500 neon-border" : "border-gray-700"
          } bg-gray-900 overflow-hidden`}
          animate={{ scale: focused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50"
            onClick={handleDecrement}
            disabled={disabled || Number.parseFloat(value) <= 0.01}
          >
            <Minus className="h-4 w-4" />
          </button>

          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="border-0 bg-transparent text-center focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />

          <button
            className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50"
            onClick={handleIncrement}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      <div className="mt-4 px-1">
        <Slider
          defaultValue={[0.01]}
          min={0.01}
          max={1}
          step={0.01}
          value={[Number.parseFloat(value)]}
          onValueChange={handleSliderChange}
          disabled={disabled}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.01</span>
          <span>0.5</span>
          <span>1.0</span>
        </div>
      </div>
    </motion.div>
  )
}
