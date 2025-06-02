"use client"

import { useEffect, useRef } from "react"

export default function SoundEffects() {
  const audioContextRef = useRef(null)

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }, [])

  const playFlipSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Create a "whoosh" sound for coin flip
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }

  const playWinSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current

    // Play a series of ascending notes for win
    const frequencies = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.2)

      oscillator.start(ctx.currentTime + index * 0.1)
      oscillator.stop(ctx.currentTime + index * 0.1 + 0.2)
    })
  }

  const playLoseSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Create a descending "sad" sound
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5)

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
  }

  // Expose functions globally for use in other components
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.playFlipSound = playFlipSound
      window.playWinSound = playWinSound
      window.playLoseSound = playLoseSound
    }
  }, [])

  return null
}
