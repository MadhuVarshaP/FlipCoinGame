"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { Coins, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = usePrivy()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const walletAddress = user?.wallet?.address
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"

  const navItems = [
    { name: "Game", href: "/game", icon: Coins },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/game">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Coins className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-bold neon-text">Flip-a-Coin</span>
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors
                  ${pathname === item.href ? "bg-purple-900/30 text-purple-300" : "text-gray-400 hover:text-white"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-purple-700 bg-black text-purple-300 hover:bg-purple-900/20">
                <span className="hidden sm:inline mr-2">🔮</span>
                {shortAddress}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-purple-900">
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden border-t border-gray-800 bg-black"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-md
                  ${pathname === item.href ? "bg-purple-900/30 text-purple-300" : "text-gray-400"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  )
}
