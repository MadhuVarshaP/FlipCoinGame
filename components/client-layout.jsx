'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import SoundEffects from "@/components/sound-effects";

export default function ClientProvider({ children }) {
  return (
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
  );
}
