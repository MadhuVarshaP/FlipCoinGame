'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import SoundEffects from "@/components/sound-effects";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

export default function ClientProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
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
      </WagmiProvider>
    </QueryClientProvider>
  );
}
