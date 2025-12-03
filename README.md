# OmniCore Wallet

<p align="center">
  <strong>Enterprise-Grade Multi-Chain Smart Wallet Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#documentation">Documentation</a>
</p>

<p align="center">
  <a href="./README-zh.md">🇨🇳 中文文档</a>
</p>

---

## Overview

OmniCore Wallet is an enterprise-grade SaaS platform for managing crypto assets, multi-signature wallets, global payments, and DeFi integrations with a native OMNI token economy. It bridges traditional finance with Web3, enabling enterprises to seamlessly manage multi-chain crypto assets through an intuitive interface.

**This is a frontend prototype using mock data (no backend).**

---

## Features

- 🔐 **Multi-Signature Wallets** - Create and manage multi-sig wallets across multiple blockchains with customizable approval thresholds
- 📝 **Transaction Approval Workflow** - Multi-level approval system with customizable rules based on amount, recipient, and time locks
- 💳 **Global Payment Gateway** - Accept payments via crypto, credit cards, Alipay, WeChat Pay, and UnionPay
- 📈 **DeFi Treasury Automation** - Automated yield farming, staking, and DCA strategies for idle assets
- 🪙 **OMNI Token Economy** - Native platform token for fee discounts, governance voting, and revenue sharing
- 🤖 **AI Risk Intelligence** - Real-time transaction risk analysis using machine learning
- 👥 **Organization Management** - Multi-tenant SaaS with role-based permissions and team invitations
- 📊 **Real-Time Dashboard** - Unified view of all assets, transactions, and DeFi positions across chains

---

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/omnicore-wallet.git
cd omnicore-wallet

# Install dependencies (use --legacy-peer-deps due to peer dependency conflicts)
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | TypeScript compile and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint code linting |
| `npm run kill` | Free port 5000 if stuck |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI Framework |
| TypeScript | 5.7 | Type Safety |
| Vite | 7.x | Build Tool |
| Tailwind CSS | 4.x | Styling |
| Radix UI | Latest | Headless UI Components |
| Phosphor Icons | 2.x | Icon Library |
| Sonner | 2.x | Toast Notifications |
| GitHub Spark | 0.42 | Platform Framework |

### AI Deep Learning Engines

The platform supports multiple AI model providers:

| Engine | Description |
|--------|-------------|
| OmniCore Local | Built-in local AI model |
| Ollama | Open source local LLM runtime |
| Omega-AI | Java-based deep learning framework with auto-differentiation, multi-GPU training, CUDA/CUDNN support |
| Custom Models | Support for OpenAI-compatible APIs |

#### Omega-AI Deep Learning Engine

[Omega-AI](https://gitee.com/dromara/omega-ai) is a Java-based deep learning framework that helps you quickly build neural networks for model inference and training.

**Key Features:**
- 🧠 Neural Network Building - Quickly build various deep learning models
- 🔄 Automatic Differentiation - Built-in autodiff engine
- 🚀 Multi-GPU Training - Distributed training acceleration
- ⚡ CUDA/CUDNN Support - GPU-accelerated inference and training

---

## Project Structure

```
src/
├── App.tsx                    # Main app shell and tabs
├── main.tsx                   # Spark initialization + ErrorBoundary
├── components/
│   ├── ui/                    # shadcn/ui base components
│   ├── dashboard/             # Dashboard components
│   ├── wallet/                # Wallet management
│   ├── transaction/           # Transaction components
│   ├── defi/                  # DeFi components
│   ├── token/                 # Token components
│   ├── organization/          # Organization management
│   ├── addressbook/           # Address book
│   └── ai-assistant/          # AI assistant components
├── lib/
│   ├── types.ts               # TypeScript type definitions
│   ├── mock-data.ts           # Mock data generators and utilities
│   └── utils.ts               # Utility functions
├── hooks/                     # Custom React Hooks
└── styles/                    # Theme and global styles
```

---

## Supported Networks

| Network | Key | Icon |
|---------|-----|------|
| Ethereum | `ethereum` | ⟠ |
| Polygon | `polygon` | ⬡ |
| BNB Chain | `bsc` | ◆ |
| Arbitrum | `arbitrum` | ◭ |
| Optimism | `optimism` | ◉ |
| Avalanche | `avalanche` | ▲ |

---

## Documentation

- [中文文档](./README-zh.md) - Chinese documentation
- [PRD.md](./PRD.md) - Product Requirements Document
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution Guidelines
- [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) - Secondary Development Guide (二开指南)
- [DEVELOPMENT-GUIDE-zh.md](./DEVELOPMENT-GUIDE-zh.md) - 二次开发指南（中文版）

---

## Development Guidelines

### Import Aliases

Use `@/` alias for the `src/` directory:

```typescript
import { WalletCard } from '@/components/wallet/WalletCard';
import type { Wallet } from '@/lib/types';
```

### Type Definitions

All types are centralized in `src/lib/types.ts`. Always import types from there:

```typescript
import type { Wallet, Transaction, DeFiPosition } from '@/lib/types';
```

### Icons

Use Phosphor Icons (`@phosphor-icons/react`) with `weight="duotone"` or `weight="bold"`:

```typescript
import { Wallet, ChartLine } from '@phosphor-icons/react';
<Wallet size={24} weight="duotone" />
```

### Styling

- Use Tailwind CSS classes and CSS variables
- Use semantic tokens like `bg-accent-9`, `text-muted-foreground`
- Dark mode via `[data-appearance="dark"]` selector

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.