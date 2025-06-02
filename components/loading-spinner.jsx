"use client"

import { motion } from "framer-motion"

export default function LoadingSpinner() {
  return (
    <motion.div
      className="h-5 w-5 rounded-full border-2 border-t-transparent border-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    />
  )
}
