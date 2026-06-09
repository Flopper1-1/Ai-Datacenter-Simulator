# AI Datacenter Simulator

Welcome to the **AI Datacenter Simulator**, an incremental clicker game where you scale your AI empire at the cost of the environment.

## 🎮 Game Overview

In this simulator, you manage high-performance Large Language Models (LLMs) to generate revenue and reputation. However, every inference task has a cooling cost measured in **Polar Bears Extinguished**.

### Choose Your Core Model
- **GPT:** Fast click cooldown, balanced revenue, and a special protocol to convert money into reputation.
- **Sonnet:** High reward per click, generates reputation over time, but has a significant cooling period.
- **Gemma:** Massive polar bear generation with high click rewards, a special protocol to liquidate reputation for cash, but suffers a -0.09 reputation penalty per second.

## 🚀 Features

### Resource Management
- **Polar Bears Killed:** The environmental cost of your operations.
- **Capital Reserve ($):** Used to fund infrastructure upgrades.
- **Institutional Reputation:** Used for global diplomacy and special model protocols.

### Infrastructure Upgrades
- **Efficiency Boost:** Increase your passive income per second.
- **Cooling Hack:** Reduce the environmental impact per second.
- **Content Generation Tiers:**
  - **AI Image Generation:** Unlocks basic visual tasks.
  - **AI Video Generation:** (Requires Image Gen) Massive increase in processing power.
  - **AI Video Game Generation:** (Requires Video Gen) The pinnacle of AI content.
- **Autonomous Warfare:** A massive late-game boost to processing speed.
- **Autoclicker:** Automates the inference process ($1,000 base).
- **Fast Response:** Shortens the click cooldown by 0.05s ($100 base, doubles each level).

### Dynamic Events
- **Random Events:** Temporary events like "Greenpeace Protests" or "Server Overheat" dynamically affect your rates and reputation. These events last for 2 minutes.

### Global Diplomacy
- **Partnerships:** Leverage your reputation to secure massive passive budget increases.

## 🖥️ Electron Desktop App
The simulator now runs as a standalone desktop application via Electron, featuring a persistent save system that carries over between versions.

## 🛠️ Tech Stack
- **Engine:** Electron
- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Storage:** Electron Store (Cross-version persistence)
- **Styling:** Vanilla CSS (Cyberpunk/Terminal theme)

## 🛠️ Development

To run the project locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the web development server:
   ```bash
   npm run dev
   ```

3. Start the Electron development environment:
   ```bash
   npm run electron:dev
   ```

4. Build the Electron application:
   ```bash
   npm run electron:build
   ```

---
*Disclaimer: This is a satirical simulation of the environmental costs of large-scale AI infrastructure.*
