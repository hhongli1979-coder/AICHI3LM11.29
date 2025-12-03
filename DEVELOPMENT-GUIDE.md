# OmniCore Wallet - Secondary Development Guide

<p align="center">
  <strong>Guide for Customizing and Extending OmniCore Wallet</strong>
</p>

<p align="center">
  <a href="./DEVELOPMENT-GUIDE-zh.md">🇨🇳 中文版本</a>
</p>

---

## Introduction

This guide provides comprehensive instructions for developers who want to customize, extend, or build upon the OmniCore Wallet platform (secondary development / 二开). Whether you want to add new features, integrate with your backend systems, or rebrand the platform, this guide will help you get started.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Architecture](#project-architecture)
- [Quick Setup](#quick-setup)
- [Customization Points](#customization-points)
- [Adding New Features](#adding-new-features)
- [Backend Integration](#backend-integration)
- [Theming & Branding](#theming--branding)
- [Multi-Chain Extension](#multi-chain-extension)
- [AI Model Integration](#ai-model-integration)
- [Testing Your Changes](#testing-your-changes)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting secondary development, ensure you have:

- **Node.js 18.x** or higher
- **npm 9.x** or higher
- Basic knowledge of **React**, **TypeScript**, and **Tailwind CSS**
- Git for version control
- (Optional) VS Code with ESLint and Tailwind CSS IntelliSense extensions

---

## Project Architecture

```
OmniCore Wallet/
├── src/
│   ├── App.tsx                    # Main app shell - add new tabs here
│   ├── main.tsx                   # App initialization
│   ├── components/
│   │   ├── ui/                    # Base UI components (shadcn/ui)
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── wallet/                # Wallet management
│   │   ├── transaction/           # Transaction handling
│   │   ├── defi/                  # DeFi integrations
│   │   ├── token/                 # Token management
│   │   ├── organization/          # Multi-tenant features
│   │   ├── addressbook/           # Contact management
│   │   └── ai-assistant/          # AI features
│   ├── lib/
│   │   ├── types.ts               # ⭐ Type definitions - extend here
│   │   ├── mock-data.ts           # ⭐ Mock data - replace with API calls
│   │   └── utils.ts               # Utility functions
│   ├── hooks/                     # Custom React hooks
│   └── styles/
│       └── theme.css              # ⭐ Theme customization
├── public/                        # Static assets
├── vite.config.ts                 # Build configuration
└── tailwind.config.js             # Tailwind customization
```

### Key Extension Points

| File | Purpose | What to Modify |
|------|---------|----------------|
| `src/lib/types.ts` | Type definitions | Add new entity types |
| `src/lib/mock-data.ts` | Mock data generators | Replace with API calls |
| `src/App.tsx` | Main app shell | Add new tabs/features |
| `src/styles/theme.css` | Theme styles | Customize colors/branding |
| `tailwind.config.js` | Tailwind config | Add custom utilities |

---

## Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/hhongli1979-coder/AICHI3LM11.29.git
cd AICHI3LM11.29

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Open browser at http://localhost:5000
```

---

## Customization Points

### 1. Replacing Mock Data with Real API

The current implementation uses mock data. To connect to your backend:

**Step 1**: Create an API service file:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourservice.com';

export async function fetchWallets(): Promise<Wallet[]> {
  const response = await fetch(`${API_BASE_URL}/wallets`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });
  return response.json();
}

export async function createWallet(config: CreateWalletConfig): Promise<Wallet> {
  const response = await fetch(`${API_BASE_URL}/wallets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(config),
  });
  return response.json();
}
```

**Step 2**: Update components to use API:

```typescript
// Example: src/App.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchWallets } from '@/lib/api';

function App() {
  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWallets,
  });
  
  if (isLoading) return <LoadingSpinner />;
  
  // Use wallets data...
}
```

### 2. Adding New Entity Types

To add new features, first define the types:

```typescript
// src/lib/types.ts

// Add your new type
export interface CustomFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: number;
}
```

### 3. Creating New Components

Follow the existing pattern:

```typescript
// src/components/custom/CustomFeatureCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from '@phosphor-icons/react';
import type { CustomFeature } from '@/lib/types';

interface CustomFeatureCardProps {
  feature: CustomFeature;
  onToggle: (id: string) => void;
}

export function CustomFeatureCard({ feature, onToggle }: CustomFeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star size={20} weight="duotone" />
          {feature.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{feature.description}</p>
        <Button 
          variant={feature.enabled ? "default" : "outline"}
          onClick={() => onToggle(feature.id)}
        >
          {feature.enabled ? 'Enabled' : 'Enable'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 4. Adding New Tabs

Edit `src/App.tsx`:

```typescript
// Add import
import { CustomFeatureList } from '@/components/custom/CustomFeatureList';

// Add tab trigger (in TabsList)
<TabsTrigger value="custom" className="gap-2">
  <Star size={18} weight="duotone" />
  <span className="hidden sm:inline">Custom</span>
</TabsTrigger>

// Add tab content
<TabsContent value="custom" className="space-y-6">
  <CustomFeatureList />
</TabsContent>
```

---

## Backend Integration

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=https://api.yourservice.com
VITE_WS_URL=wss://ws.yourservice.com
VITE_CHAIN_RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_CHAIN_RPC_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### API Integration Pattern

```typescript
// src/lib/api.ts
import type { Wallet, Transaction, DeFiPosition } from './types';

class OmniCoreAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Wallet APIs
  getWallets = () => this.request<Wallet[]>('/api/v1/wallets');
  getWallet = (id: string) => this.request<Wallet>(`/api/v1/wallets/${id}`);
  createWallet = (data: Partial<Wallet>) => 
    this.request<Wallet>('/api/v1/wallets', { method: 'POST', body: JSON.stringify(data) });

  // Transaction APIs
  getTransactions = (walletId?: string) => 
    this.request<Transaction[]>(`/api/v1/transactions${walletId ? `?walletId=${walletId}` : ''}`);
  createTransaction = (data: Partial<Transaction>) =>
    this.request<Transaction>('/api/v1/transactions', { method: 'POST', body: JSON.stringify(data) });
  signTransaction = (id: string, signature: string) =>
    this.request<Transaction>(`/api/v1/transactions/${id}/sign`, { method: 'POST', body: JSON.stringify({ signature }) });

  // DeFi APIs
  getDeFiPositions = () => this.request<DeFiPosition[]>('/api/v1/defi/positions');
}

export const api = new OmniCoreAPI(import.meta.env.VITE_API_BASE_URL || '');
```

---

## Theming & Branding

### 1. Color Scheme

Edit `src/styles/theme.css`:

```css
:root {
  /* Primary brand color */
  --primary: oklch(0.35 0.08 250);
  --primary-foreground: oklch(0.98 0 0);
  
  /* Accent color */
  --accent: oklch(0.60 0.15 195);
  --accent-foreground: oklch(0.98 0 0);
  
  /* Your custom brand colors */
  --brand-primary: #your-color;
  --brand-secondary: #your-color;
}

[data-appearance="dark"] {
  --background: oklch(0.12 0.01 250);
  --foreground: oklch(0.95 0 0);
  /* Dark mode overrides */
}
```

### 2. Logo & Branding

Replace the logo in `src/App.tsx`:

```typescript
// Replace the logo section
<div className="flex items-center gap-3">
  <img src="/your-logo.svg" alt="Your Brand" className="w-10 h-10" />
  <div>
    <h1 className="text-xl font-bold">Your Brand Name</h1>
    <p className="text-xs text-muted-foreground">Your Tagline</p>
  </div>
</div>
```

### 3. Custom Fonts

Edit `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

Update `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Your Font', 'Inter', 'sans-serif'],
      },
    },
  },
}
```

---

## Multi-Chain Extension

### Adding a New Blockchain

**Step 1**: Update types:

```typescript
// src/lib/types.ts
export type BlockchainNetwork = 
  | 'ethereum' 
  | 'polygon' 
  | 'bsc' 
  | 'arbitrum' 
  | 'optimism' 
  | 'avalanche'
  | 'solana'    // New chain
  | 'cosmos';   // New chain
```

**Step 2**: Update network configuration:

```typescript
// src/lib/mock-data.ts
export const NETWORKS: Record<BlockchainNetwork, { name: string; color: string; icon: string }> = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
  // Add new chains
  solana: { name: 'Solana', color: '#00D18C', icon: '◎' },
  cosmos: { name: 'Cosmos', color: '#2E3148', icon: '⚛' },
};
```

**Step 3**: Implement chain-specific handlers:

```typescript
// src/lib/chains/solana.ts
import { Connection, PublicKey } from '@solana/web3.js';

export class SolanaHandler {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
  }

  async getBalance(address: string): Promise<string> {
    const pubKey = new PublicKey(address);
    const balance = await this.connection.getBalance(pubKey);
    return (balance / 1e9).toString(); // Convert lamports to SOL
  }

  async sendTransaction(/* params */) {
    // Implementation
  }
}
```

---

## AI Model Integration

### Connecting Custom AI Models

**Step 1**: Configure in Settings:

```typescript
// src/lib/ai-config.ts
export const AI_MODEL_CONFIGS: AIModelConfig[] = [
  {
    id: 'local-model',
    name: 'Local Model',
    provider: 'local',
    modelName: 'omnicore-local',
    apiEndpoint: 'http://localhost:11434/api',
    enabled: true,
    isDefault: true,
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: 'You are a helpful crypto wallet assistant.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'omega-ai',
    name: 'Omega-AI',
    provider: 'omega-ai',
    modelName: 'omega-7b',
    apiEndpoint: 'http://localhost:8080/omega-ai/v1',
    enabled: true,
    isDefault: false,
    maxTokens: 8192,
    temperature: 0.5,
    systemPrompt: 'You are an AI assistant specialized in blockchain and DeFi.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
```

**Step 2**: Implement AI Service:

```typescript
// src/lib/ai-service.ts
import type { AIModelConfig, AIMessage } from './types';

export class AIService {
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  async chat(messages: AIMessage[]): Promise<AIMessage> {
    const response = await fetch(`${this.config.apiEndpoint}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        model: this.config.modelName,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    const data = await response.json();
    
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.choices[0].message.content,
      timestamp: Date.now(),
    };
  }
}
```

---

## Testing Your Changes

### Running Tests

```bash
# Run linting
npm run lint

# Build the project
npm run build

# Start development server for manual testing
npm run dev
```

### Adding Unit Tests

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatAddress } from '../mock-data';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});

describe('formatAddress', () => {
  it('shortens Ethereum addresses', () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f16ab1';
    expect(formatAddress(address)).toBe('0x742d...6ab1');
  });
});
```

---

## Deployment

### Building for Production

```bash
# Build optimized bundle
npm run build

# Output in /dist folder
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t omnicore-wallet .
docker run -p 8080:80 omnicore-wallet
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Run `npm run kill` or change port in `vite.config.ts` |
| Dependency conflicts | Use `npm install --legacy-peer-deps` |
| Type errors | Check imports from `@/lib/types` |
| Build fails | Clear `node_modules` and reinstall |
| Styles not loading | Ensure Tailwind is properly configured |

### Getting Help

- Check [GitHub Issues](https://github.com/hhongli1979-coder/AICHI3LM11.29/issues)
- Review [CONTRIBUTING.md](./CONTRIBUTING.md)
- Contact the maintainers

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Happy Building! 🚀**

If you build something great with OmniCore Wallet, we'd love to hear about it!
