import { Lexend } from "next/font/google";
import "./globals.css";
import ClientProvider from "../components/client-layout";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata = {
  title: "Flip-a-Coin | Stake ETH. Flip Fate.",
  description: "A Web3 coin flip game where you can stake ETH and test your luck.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.className} bg-black text-white overflow-x-hidden`}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
