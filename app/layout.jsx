import { Inter } from "next/font/google"
import "./globals.css"
import { PrivyProvider } from "@privy-io/react-auth"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SoundEffects from "@/components/sound-effects"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Flip-a-Coin | Stake ETH. Flip Fate.",
  description: "A Web3 coin flip game where you can stake ETH and test your luck.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white overflow-x-hidden`}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID }
          config={{
            loginMethods: ["wallet", "email"],
            appearance: {
              theme: "dark",
              accentColor: "#7000FF",
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <SoundEffects />
            {children}
            <Toaster />
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}
