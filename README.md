# OmniCore Wallet

Enterprise-grade Multi-Chain Smart Wallet Platform for managing crypto assets, multi-signature wallets, global payments, and DeFi integrations.

## Overview

OmniCore is a comprehensive digital asset management platform that bridges traditional finance with Web3, enabling enterprises to seamlessly manage multi-chain crypto assets, process global payments, and automate treasury operations through an intuitive SaaS interface.

## Features

- **Multi-Signature Wallet Management** - Create and manage multi-sig wallets across multiple blockchains
- **Transaction Approval Workflow** - Multi-level approval system with customizable rules
- **Global Payment Gateway** - Accept payments via crypto, credit cards, Alipay, WeChat Pay, UnionPay
- **DeFi Treasury Automation** - Automated yield farming, staking, and DCA strategies
- **OMNI Token Economy** - Native platform token for fee discounts and governance
- **AI Risk Intelligence** - Real-time transaction risk analysis
- **Organization & Team Management** - Multi-tenant SaaS with role-based permissions
- **Real-Time Dashboard** - Unified view of all assets and analytics

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + Radix Colors
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Phosphor Icons

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Docker

### Using Docker Hub / GitHub Container Registry

Pull and run the pre-built image:

```bash
# Pull the latest image from GitHub Container Registry
docker pull ghcr.io/hhongli1979-coder/aichi3lm11.29:latest

# Run the container
docker run -d -p 8080:80 --name omnicore-wallet ghcr.io/hhongli1979-coder/aichi3lm11.29:latest
```

### Building Locally

Build and run the Docker image locally:

```bash
# Build the image
docker build -t omnicore-wallet .

# Run the container
docker run -d -p 8080:80 --name omnicore-wallet omnicore-wallet
```

Access the application at `http://localhost:8080`

### Docker Compose (optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  omnicore-wallet:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:

```bash
docker compose up -d
```

## Project Structure

```
├── src/
│   ├── components/      # UI components
│   │   ├── ui/          # Base shadcn components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── wallet/      # Wallet management
│   │   ├── defi/        # DeFi features
│   │   └── ...
│   ├── lib/             # Utilities, types, mock data
│   ├── styles/          # Global styles and theme
│   └── App.tsx          # Main application
├── public/              # Static assets
├── PRD.md              # Product Requirements Document
└── package.json
```

## License

MIT License - see [LICENSE](LICENSE) for details