import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, MarketData, MarketSentiment, PriceHistory, PortfolioAnalytics, PerformancePoint, SmartAlert, TradingStrategy, WhaleMovement, OnChainMetrics } from './types';

export const NETWORKS = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
};

export function generateMockWallets(): Wallet[] {
  return [
    {
      id: 'wallet-1',
      name: 'Treasury Vault',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      network: 'ethereum',
      type: 'multisig',
      signers: ['0x1234...5678', '0x8765...4321', '0xabcd...efgh'],
      requiredSignatures: 2,
      balance: {
        native: '45.2341',
        usd: '125,432.18',
      },
      tokens: [
        {
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          balance: '50000.00',
          decimals: 6,
          priceUsd: '1.00',
          valueUsd: '50000.00',
        },
        {
          symbol: 'OMNI',
          name: 'Omni Token',
          address: '0x1234567890abcdef',
          balance: '10000.00',
          decimals: 18,
          priceUsd: '2.45',
          valueUsd: '24500.00',
        },
      ],
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'wallet-2',
      name: 'Operating Account',
      address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      network: 'polygon',
      type: 'multisig',
      signers: ['0x1234...5678', '0x8765...4321'],
      requiredSignatures: 1,
      balance: {
        native: '12500.8834',
        usd: '8,234.42',
      },
      tokens: [
        {
          symbol: 'USDT',
          name: 'Tether USD',
          address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
          balance: '15000.00',
          decimals: 6,
          priceUsd: '1.00',
          valueUsd: '15000.00',
        },
      ],
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'wallet-3',
      name: 'DeFi Strategy Wallet',
      address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      network: 'arbitrum',
      type: 'single',
      balance: {
        native: '2.8934',
        usd: '8,024.15',
      },
      tokens: [],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockTransactions(): Transaction[] {
  return [
    {
      id: 'tx-1',
      walletId: 'wallet-1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x9876543210fedcba',
      value: '5000.00',
      token: 'USDC',
      network: 'ethereum',
      status: 'pending',
      signatures: [
        {
          signer: '0x1234...5678',
          signature: '0xabcdef...',
          signedAt: Date.now() - 2 * 60 * 60 * 1000,
        },
      ],
      requiredSignatures: 2,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      expiresAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
      description: 'Supplier payment for Q4 services',
      riskAssessment: {
        level: 'low',
        score: 15,
        factors: ['Known counterparty', 'Regular transaction pattern'],
        recommendations: [],
      },
    },
    {
      id: 'tx-2',
      walletId: 'wallet-1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x1234567890abcdef',
      value: '1.5',
      network: 'ethereum',
      status: 'confirmed',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      signatures: [
        {
          signer: '0x1234...5678',
          signature: '0xabcdef...',
          signedAt: Date.now() - 5 * 60 * 60 * 1000,
        },
        {
          signer: '0x8765...4321',
          signature: '0x123456...',
          signedAt: Date.now() - 4 * 60 * 60 * 1000,
        },
      ],
      requiredSignatures: 2,
      createdAt: Date.now() - 6 * 60 * 60 * 1000,
      executedAt: Date.now() - 4 * 60 * 60 * 1000,
      expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
      description: 'Employee bonus payout',
      riskAssessment: {
        level: 'low',
        score: 10,
        factors: ['Internal transfer', 'Below threshold'],
        recommendations: [],
      },
    },
    {
      id: 'tx-3',
      walletId: 'wallet-2',
      from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0xhighriskabc123',
      value: '25000.00',
      token: 'USDT',
      network: 'polygon',
      status: 'pending',
      signatures: [],
      requiredSignatures: 1,
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000,
      description: 'Large transfer to new address',
      riskAssessment: {
        level: 'high',
        score: 85,
        factors: ['First-time recipient', 'Large amount', 'Address flagged by threat intelligence'],
        recommendations: ['Verify recipient identity', 'Consider splitting transaction', 'Enable time lock'],
      },
    },
  ];
}

export function generateMockDeFiPositions(): DeFiPosition[] {
  return [
    {
      id: 'defi-1',
      protocol: 'Aave V3',
      type: 'lending',
      asset: 'USDC',
      amount: '25000.00',
      valueUsd: '25000.00',
      apy: 5.2,
      rewards: '1.42',
      healthFactor: 2.5,
      network: 'ethereum',
    },
    {
      id: 'defi-2',
      protocol: 'Lido',
      type: 'staking',
      asset: 'ETH',
      amount: '10.5',
      valueUsd: '29,115.00',
      apy: 3.8,
      rewards: '0.045',
      network: 'ethereum',
    },
    {
      id: 'defi-3',
      protocol: 'Uniswap V3',
      type: 'liquidity',
      asset: 'ETH-USDC',
      amount: '50000.00',
      valueUsd: '50000.00',
      apy: 12.5,
      rewards: '68.50',
      network: 'ethereum',
    },
  ];
}

export function generateMockPayments(): PaymentRequest[] {
  return [
    {
      id: 'pay-1',
      merchantId: 'merchant-1',
      amount: 299.99,
      currency: 'USD',
      channel: 'stripe',
      status: 'completed',
      description: 'Enterprise Plan - Annual',
      completedAt: Date.now() - 2 * 60 * 60 * 1000,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      id: 'pay-2',
      merchantId: 'merchant-1',
      amount: 5000,
      currency: 'CNY',
      channel: 'alipay',
      status: 'pending',
      description: 'Product Purchase Order #12345',
      paymentUrl: 'https://payment.omnicore.io/pay-2',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      createdAt: Date.now() - 30 * 60 * 1000,
      expiresAt: Date.now() + 30 * 60 * 1000,
    },
  ];
}

export function generateMockDCAStrategies(): DCAStrategy[] {
  return [
    {
      id: 'dca-1',
      name: 'ETH Accumulation',
      sourceToken: 'USDC',
      targetToken: 'ETH',
      amountPerInterval: '1000.00',
      intervalHours: 168,
      lastExecutedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      nextExecutionAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
      totalInvested: '12000.00',
      totalReceived: '4.523',
      enabled: true,
    },
    {
      id: 'dca-2',
      name: 'BTC Monthly Buy',
      sourceToken: 'USDT',
      targetToken: 'WBTC',
      amountPerInterval: '2500.00',
      intervalHours: 720,
      lastExecutedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      nextExecutionAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
      totalInvested: '25000.00',
      totalReceived: '0.285',
      enabled: true,
    },
  ];
}

export function generateMockOmniStats(): OmniTokenStats {
  return {
    price: 2.45,
    marketCap: 245000000,
    totalSupply: '1000000000',
    circulatingSupply: '400000000',
    stakedAmount: '150000000',
    stakingApy: 8.5,
    yourBalance: '10000.00',
    yourStaked: '5000.00',
    yourRewards: '42.50',
  };
}

export function generateMockNotifications(): NotificationItem[] {
  return [
    {
      id: 'notif-1',
      type: 'approval',
      title: 'Signature Required',
      message: 'Treasury Vault transaction needs your approval (5000 USDC to supplier)',
      read: false,
      createdAt: Date.now() - 30 * 60 * 1000,
      actionUrl: '/transactions/tx-1',
    },
    {
      id: 'notif-2',
      type: 'risk',
      title: 'High Risk Transaction Detected',
      message: 'Large transfer to flagged address - immediate review recommended',
      read: false,
      createdAt: Date.now() - 15 * 60 * 1000,
      actionUrl: '/transactions/tx-3',
    },
    {
      id: 'notif-3',
      type: 'transaction',
      title: 'Transaction Confirmed',
      message: 'Employee bonus payout completed successfully',
      read: true,
      createdAt: Date.now() - 4 * 60 * 60 * 1000,
      actionUrl: '/transactions/tx-2',
    },
    {
      id: 'notif-4',
      type: 'payment',
      title: 'Payment Received',
      message: 'Enterprise Plan subscription renewed - $299.99',
      read: true,
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
    },
  ];
}

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatCurrency(amount: string | number, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'completed': return 'text-green-600';
    case 'pending':
    case 'signed': return 'text-yellow-600';
    case 'broadcasting': return 'text-blue-600';
    case 'failed':
    case 'expired': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

// AI Assistant Mock Data

export function generateMockAICapabilities(): AICapability[] {
  return [
    {
      id: 'cap-1',
      name: '对话记忆',
      description: '记住用户偏好和历史交互，提供个性化服务',
      icon: 'Brain',
      enabled: true,
      category: 'memory',
    },
    {
      id: 'cap-2',
      name: '交易模式学习',
      description: '分析并学习用户的交易习惯和模式',
      icon: 'ChartLine',
      enabled: true,
      category: 'memory',
    },
    {
      id: 'cap-3',
      name: '自然语言理解',
      description: '理解多语言输入，解析用户意图',
      icon: 'ChatCircle',
      enabled: true,
      category: 'language',
    },
    {
      id: 'cap-4',
      name: '智能回复生成',
      description: '生成上下文相关的智能回复',
      icon: 'Robot',
      enabled: true,
      category: 'language',
    },
    {
      id: 'cap-5',
      name: '钱包管理',
      description: '创建、查询和管理加密钱包',
      icon: 'Wallet',
      enabled: true,
      category: 'control',
    },
    {
      id: 'cap-6',
      name: '交易执行',
      description: '发起和签署交易操作',
      icon: 'ArrowsLeftRight',
      enabled: true,
      category: 'control',
    },
    {
      id: 'cap-7',
      name: 'DeFi策略',
      description: '管理DeFi头寸和收益策略',
      icon: 'ChartLine',
      enabled: true,
      category: 'control',
    },
    {
      id: 'cap-8',
      name: '风险分析',
      description: '实时评估交易和地址风险',
      icon: 'ShieldCheck',
      enabled: true,
      category: 'control',
    },
  ];
}

export function generateMockAIMemories(): AIMemoryItem[] {
  return [
    {
      id: 'mem-1',
      type: 'preference',
      key: '首选网络',
      value: 'Ethereum 和 Polygon',
      confidence: 0.95,
      learnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      usageCount: 45,
    },
    {
      id: 'mem-2',
      type: 'transaction_pattern',
      key: '常用交易金额',
      value: '通常在 $1,000 - $10,000 范围内',
      confidence: 0.88,
      learnedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      usageCount: 23,
    },
    {
      id: 'mem-3',
      type: 'contact',
      key: '常用收款地址',
      value: '供应商钱包 0x9876...3210',
      confidence: 0.92,
      learnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      usageCount: 12,
    },
    {
      id: 'mem-4',
      type: 'insight',
      key: '风险偏好',
      value: '倾向于低风险DeFi策略，APY < 15%',
      confidence: 0.85,
      learnedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      usageCount: 8,
    },
    {
      id: 'mem-5',
      type: 'preference',
      key: '语言偏好',
      value: '中文优先，英文备选',
      confidence: 0.98,
      learnedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      usageCount: 156,
    },
  ];
}

export function generateMockAIConversation(): AIMessage[] {
  return [
    {
      id: 'msg-1',
      role: 'assistant',
      content: '您好！我是 OmniCore 智能助手。我可以帮助您管理钱包、执行交易、分析风险，并根据您的历史操作提供个性化建议。请问有什么可以帮到您？',
      timestamp: Date.now() - 10 * 60 * 1000,
    },
    {
      id: 'msg-2',
      role: 'user',
      content: '帮我查看一下我的钱包余额',
      timestamp: Date.now() - 9 * 60 * 1000,
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: '根据我的记录，您有3个活跃钱包：\n\n📊 **Treasury Vault** (Ethereum)\n- ETH: 45.23 ($125,432.18)\n- USDC: 50,000\n- OMNI: 10,000\n\n📊 **Operating Account** (Polygon)\n- MATIC: 12,500.88 ($8,234.42)\n- USDT: 15,000\n\n📊 **DeFi Strategy Wallet** (Arbitrum)\n- ETH: 2.89 ($8,024.15)\n\n💰 **总资产价值**: ~$231,690.75\n\n需要我帮您执行任何操作吗？',
      timestamp: Date.now() - 8 * 60 * 1000,
      action: {
        type: 'wallet_query',
        status: 'completed',
        result: '成功检索钱包信息',
      },
    },
    {
      id: 'msg-4',
      role: 'user',
      content: '有什么好的DeFi策略推荐吗？',
      timestamp: Date.now() - 5 * 60 * 1000,
    },
    {
      id: 'msg-5',
      role: 'assistant',
      content: '根据您的风险偏好（低风险，APY < 15%），我推荐以下策略：\n\n1. **Aave V3 稳定币借贷** ⭐\n   - 资产: USDC\n   - 预期 APY: 5.2%\n   - 风险等级: 低\n   - 当前您已存入 $25,000\n\n2. **Lido ETH 质押**\n   - 资产: ETH\n   - 预期 APY: 3.8%\n   - 风险等级: 低\n   - 当前您已质押 10.5 ETH\n\n3. **新推荐: Compound V3 USDT**\n   - 预期 APY: 4.5%\n   - 风险等级: 低\n   - 推荐投入: $10,000\n\n需要我帮您设置自动投资策略吗？',
      timestamp: Date.now() - 4 * 60 * 1000,
      action: {
        type: 'defi_manage',
        status: 'completed',
        result: '分析完成，生成个性化推荐',
      },
    },
  ];
}

export function generateMockAIAssistantState(): AIAssistantState {
  return {
    isActive: true,
    currentConversation: generateMockAIConversation(),
    memories: generateMockAIMemories(),
    capabilities: generateMockAICapabilities(),
    lastActiveAt: Date.now() - 4 * 60 * 1000,
  };
}

// Native AI Model Configuration Mock Data - 原生态大模型配置

export function generateMockAIModelConfigs(): AIModelConfig[] {
  return [
    {
      id: 'model-1',
      name: 'OmniCore 本地模型',
      provider: 'local',
      modelName: 'omnicore-7b',
      apiEndpoint: 'http://localhost:11434/api/generate',
      enabled: true,
      isDefault: true,
      maxTokens: 4096,
      temperature: 0.7,
      systemPrompt: '你是 OmniCore 钱包的智能助手，专注于加密货币钱包管理、DeFi 策略和风险分析。请用专业且友好的方式回答用户问题。',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'model-2',
      name: 'Ollama Llama3',
      provider: 'ollama',
      modelName: 'llama3:8b',
      apiEndpoint: 'http://localhost:11434/api/generate',
      enabled: true,
      isDefault: false,
      maxTokens: 8192,
      temperature: 0.8,
      systemPrompt: '你是一个专业的加密货币和区块链顾问。',
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'model-3',
      name: '自定义模型接口',
      provider: 'custom',
      modelName: 'custom-finance-llm',
      apiEndpoint: 'https://api.your-company.com/v1/chat',
      apiKey: 'sk-***',
      enabled: false,
      isDefault: false,
      maxTokens: 2048,
      temperature: 0.5,
      systemPrompt: '你是金融科技领域的专家助手。',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockCustomEndpoints(): CustomEndpoint[] {
  return [
    {
      id: 'endpoint-1',
      name: '企业内部API',
      url: 'https://internal-ai.company.com/v1/completions',
      headers: {
        'Authorization': 'Bearer ***',
        'Content-Type': 'application/json',
      },
      enabled: true,
    },
    {
      id: 'endpoint-2',
      name: '测试环境',
      url: 'http://192.168.1.100:8080/api/generate',
      headers: {},
      enabled: false,
    },
  ];
}

export function generateMockAIModelSettings(): AIModelSettings {
  const models = generateMockAIModelConfigs();
  return {
    models,
    defaultModelId: models[0].id,
    enableLocalProcessing: true,
    enableSecondaryDevelopment: true,
    customEndpoints: generateMockCustomEndpoints(),
  };
}

// Financial Intelligent Agent Mock Data - 金融智能体模拟数据

export function generateMockMarketData(): MarketData[] {
  return [
    {
      id: 'market-btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43256.78,
      change24h: 1245.32,
      changePercent24h: 2.96,
      volume24h: 28456000000,
      marketCap: 847000000000,
      high24h: 43890.00,
      low24h: 41850.00,
      lastUpdated: Date.now(),
    },
    {
      id: 'market-eth',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2345.67,
      change24h: 78.45,
      changePercent24h: 3.46,
      volume24h: 12340000000,
      marketCap: 281000000000,
      high24h: 2398.00,
      low24h: 2256.00,
      lastUpdated: Date.now(),
    },
    {
      id: 'market-bnb',
      symbol: 'BNB',
      name: 'BNB',
      price: 312.45,
      change24h: -5.23,
      changePercent24h: -1.65,
      volume24h: 890000000,
      marketCap: 48000000000,
      high24h: 320.00,
      low24h: 308.00,
      lastUpdated: Date.now(),
    },
    {
      id: 'market-sol',
      symbol: 'SOL',
      name: 'Solana',
      price: 98.76,
      change24h: 8.92,
      changePercent24h: 9.93,
      volume24h: 2450000000,
      marketCap: 42000000000,
      high24h: 102.00,
      low24h: 88.50,
      lastUpdated: Date.now(),
    },
    {
      id: 'market-omni',
      symbol: 'OMNI',
      name: 'Omni Token',
      price: 2.45,
      change24h: 0.12,
      changePercent24h: 5.15,
      volume24h: 12500000,
      marketCap: 245000000,
      high24h: 2.58,
      low24h: 2.31,
      lastUpdated: Date.now(),
    },
  ];
}

export function generateMockMarketSentiment(): MarketSentiment {
  return {
    overall: 'bullish',
    fearGreedIndex: 68,
    socialMentions: 125400,
    newsScore: 72,
    technicalSignals: {
      rsi: 58.5,
      macd: 'buy',
      movingAverage: 'above',
    },
  };
}

export function generateMockPriceHistory(days: number = 30): PriceHistory[] {
  const history: PriceHistory[] = [];
  const basePrice = 43000;
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const randomChange = (Math.random() - 0.5) * 2000;
    history.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      price: basePrice + randomChange + (days - i) * 50,
      volume: 20000000000 + Math.random() * 10000000000,
    });
  }
  
  return history;
}

export function generateMockPortfolioAnalytics(): PortfolioAnalytics {
  return {
    totalValue: 231690.75,
    totalCost: 195000.00,
    totalPnl: 36690.75,
    pnlPercent: 18.82,
    allocation: [
      { asset: 'Ethereum', symbol: 'ETH', value: 125432.18, percentage: 54.1, color: '#627EEA' },
      { asset: 'USDC', symbol: 'USDC', value: 50000.00, percentage: 21.6, color: '#2775CA' },
      { asset: 'OMNI Token', symbol: 'OMNI', value: 24500.00, percentage: 10.6, color: '#8B5CF6' },
      { asset: 'Polygon', symbol: 'MATIC', value: 23234.42, percentage: 10.0, color: '#8247E5' },
      { asset: 'Other', symbol: 'OTHER', value: 8524.15, percentage: 3.7, color: '#94A3B8' },
    ],
    performanceHistory: generateMockPerformanceHistory(),
    riskMetrics: {
      var95: 18500.00,
      var99: 28200.00,
      sharpeRatio: 1.85,
      volatility: 24.5,
      maxDrawdown: -15.2,
      beta: 1.12,
      correlationToBtc: 0.78,
    },
  };
}

function generateMockPerformanceHistory(): PerformancePoint[] {
  const history: PerformancePoint[] = [];
  const baseValue = 195000;
  const now = Date.now();
  
  for (let i = 90; i >= 0; i--) {
    const growth = (90 - i) * 400 + (Math.random() - 0.3) * 5000;
    history.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      value: baseValue + growth,
      pnl: growth,
    });
  }
  
  return history;
}

export function generateMockSmartAlerts(): SmartAlert[] {
  return [
    {
      id: 'alert-1',
      name: 'BTC价格突破',
      type: 'price',
      symbol: 'BTC',
      condition: { operator: 'above', value: 45000 },
      status: 'active',
      notificationChannels: ['push', 'email'],
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      lastCheckedAt: Date.now() - 60 * 1000,
    },
    {
      id: 'alert-2',
      name: 'ETH跌破支撑',
      type: 'price',
      symbol: 'ETH',
      condition: { operator: 'below', value: 2200 },
      status: 'active',
      notificationChannels: ['push'],
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      lastCheckedAt: Date.now() - 30 * 1000,
    },
    {
      id: 'alert-3',
      name: '大额转账监控',
      type: 'whale',
      condition: { operator: 'above', value: 1000000 },
      status: 'active',
      notificationChannels: ['push', 'email', 'webhook'],
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      lastCheckedAt: Date.now() - 120 * 1000,
    },
    {
      id: 'alert-4',
      name: 'OMNI暴涨',
      type: 'price',
      symbol: 'OMNI',
      condition: { operator: 'change_percent', value: 20, timeframe: '1h' },
      status: 'triggered',
      notificationChannels: ['push'],
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      triggeredAt: Date.now() - 2 * 60 * 60 * 1000,
      lastCheckedAt: Date.now() - 2 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockTradingStrategies(): TradingStrategy[] {
  return [
    {
      id: 'strategy-1',
      name: 'ETH网格交易',
      type: 'grid',
      enabled: true,
      config: {
        pair: 'ETH/USDC',
        investmentAmount: 10000,
        maxPositionSize: 5000,
        stopLoss: 15,
        takeProfit: 30,
        gridLevels: 10,
      },
      performance: {
        totalTrades: 156,
        winRate: 68.5,
        totalPnl: 2340.50,
        averagePnl: 15.00,
        runningDays: 45,
      },
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      lastExecutedAt: Date.now() - 4 * 60 * 60 * 1000,
    },
    {
      id: 'strategy-2',
      name: 'BTC定投策略',
      type: 'dca',
      enabled: true,
      config: {
        pair: 'BTC/USDC',
        investmentAmount: 1000,
        maxPositionSize: 50000,
        intervalHours: 168,
      },
      performance: {
        totalTrades: 12,
        winRate: 75.0,
        totalPnl: 1850.00,
        averagePnl: 154.17,
        runningDays: 84,
      },
      createdAt: Date.now() - 84 * 24 * 60 * 60 * 1000,
      lastExecutedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'strategy-3',
      name: '组合再平衡',
      type: 'rebalance',
      enabled: false,
      config: {
        pair: 'PORTFOLIO',
        investmentAmount: 100000,
        maxPositionSize: 100000,
        rebalanceThreshold: 5,
      },
      performance: {
        totalTrades: 8,
        winRate: 87.5,
        totalPnl: 4520.00,
        averagePnl: 565.00,
        runningDays: 120,
      },
      createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      lastExecutedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockWhaleMovements(): WhaleMovement[] {
  return [
    {
      id: 'whale-1',
      type: 'exchange_outflow',
      token: 'BTC',
      amount: '2,500',
      valueUsd: 108141950,
      from: 'Binance',
      to: '0x7a250...dca2',
      timestamp: Date.now() - 30 * 60 * 1000,
      significance: 'high',
    },
    {
      id: 'whale-2',
      type: 'transfer',
      token: 'ETH',
      amount: '15,000',
      valueUsd: 35185050,
      from: '0x8ba1f...dba7',
      to: '0x742d3...beef',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      significance: 'medium',
    },
    {
      id: 'whale-3',
      type: 'exchange_inflow',
      token: 'USDT',
      amount: '50,000,000',
      valueUsd: 50000000,
      from: '0x5aae...dead',
      to: 'Coinbase',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      significance: 'high',
    },
  ];
}

export function generateMockOnChainMetrics(): OnChainMetrics {
  return {
    activeAddresses24h: 1245678,
    transactionCount24h: 2456789,
    avgTransactionValue: 2850.45,
    gasPrice: 35.5,
    networkHashrate: 450000000,
    stakingRatio: 26.5,
  };
}
