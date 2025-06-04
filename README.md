# 🪙 Flip-a-Coin Web3 Game

A Web3 coin flipping game where users stake ETH, choose heads or tails, and win or lose based on a random result. Built with **Next.js**, **Privy**, **Viem**, and deployed on **Base Sepolia**.

---

## 🚀 Features

- 🔐 Auth & wallet with [Privy](https://www.privy.io)
- 🧠 Smart contract interactions using [Privy](https://www.privy.io) and [Viem](https://viem.sh/)
- 🎮 Game logic: heads/tails + stake ETH
- 🕹️ Flip animation and gamified UI
- 📊 Wallet balance tracking
- 🎵 Win/Lose sound effects
- 🌐 Deployed on [Base Sepolia](https://sepolia.basescan.org/)

---

## 🧱 Tech Stack

- **Frontend:** Next.js 14 / App Router, Tailwind CSS, Framer Motion
- **Web3 Auth & Wallet:** Privy (Embedded + MetaMask)
- **Chain:** Base Sepolia
- **UI Components:** Custom + ShadCN

---

## 📁 Project Structure

```
app/
├─ game/
│  └─ page.jsx           # Main game page
├─ profile/
│  └─ page.jsx           # Profile page
components/              # UI components (Navbar, FlipCard, Modals, etc.)
lib/
│  └─ contract.js        # Contract address & ABI
public/                  # Game sounds (win, lose, flip)
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/MadhuVarshaP/FlipCoinGame.git
cd FlipCoinGame
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Create `.env.local`

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

> You can get your `PRIVY_APP_ID` from the [Privy Dashboard](https://dashboard.privy.io/)

---

## 🔗 Smart Contract Info

- **Network:** Base Sepolia
- **Contract Address:** `0xccF79BFEd4BA608cA9E39094A21fB529f0F4fbd8`
- **Functions Used:**
  - `playGame(uint8 _choice)` — stakes ETH and records result
- **Events:**
  - `GamePlayed(address player, uint8 choice, uint8 result, bool win, uint256 reward)`

> Contract ABI and address are stored in `lib/contract.js`

---

## 🧪 Testing the Game

1. Connect via Privy (embedded wallet or MetaMask)
2. Choose Heads or Tails
3. Stake ≥ `0.0001 ETH`
4. Click **Flip Coin**
5. Wait for transaction confirmation
6. View result modal and hear win/lose sound

---

## 📦 Build & Deploy

### Build

```bash
npm run build
```

### Start (Production)

```bash
npm run dev
```

> Deployed this to [https://flip-coins-game.vercel.app/](https://flip-coins-game.vercel.app/).

---

## 📸 Screenshots

<img width="1464" alt="image" src="https://github.com/user-attachments/assets/fbbfe545-35da-4524-9edd-5cfc01c873ff" />

<img width="1465" alt="image" src="https://github.com/user-attachments/assets/4268a25d-3569-4d1f-95e6-aac5e04dc02b" />


