/**
 * OmniCore Wallet - Mock Data Generators
 * 
 * This file contains mock data generators and utility functions for the OmniCore Wallet platform.
 * All mock data is used for frontend prototyping and development purposes.
 * 
 * @module mock-data
 */

import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, PaymentPurpose, CountryWithCities, Fiat24BankInfo, BankPayment, Fiat24FXRate } from './types';

// ============================================================================
// Network Configuration
// ============================================================================

/**
 * Supported blockchain networks with display information
 * 
 * @example
 * ```typescript
 * const network = NETWORKS['ethereum'];
 * console.log(network.name); // 'Ethereum'
 * console.log(network.color); // '#627EEA'
 * ```
 */
export const NETWORKS = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
};

// ============================================================================
// Wallet Mock Data
// ============================================================================

/**
 * Generate mock wallet data for development
 * 
 * @returns Array of mock Wallet objects
 * 
 * @example
 * ```typescript
 * const wallets = generateMockWallets();
 * console.log(wallets.length); // 3
 * ```
 */
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

/**
 * Generate mock transaction data for development
 * 
 * @returns Array of mock Transaction objects
 */
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

/**
 * Generate mock DeFi positions for development
 * 
 * @returns Array of mock DeFiPosition objects
 */
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

/**
 * Generate mock payment requests for development
 * 
 * @returns Array of mock PaymentRequest objects
 */
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

/**
 * Generate mock DCA strategies for development
 * 
 * @returns Array of mock DCAStrategy objects
 */
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

/**
 * Generate mock OMNI token statistics
 * 
 * @returns Mock OmniTokenStats object
 */
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

/**
 * Generate mock notification data
 * 
 * @returns Array of mock NotificationItem objects
 */
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

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format a blockchain address for display (truncated)
 * 
 * @param address - Full blockchain address
 * @param chars - Number of characters to show at start/end (default: 4)
 * @returns Truncated address string (e.g., "0x1234...5678")
 * 
 * @example
 * ```typescript
 * formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
 * // Returns: "0x742d...0bEb"
 * ```
 */
export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number as currency
 * 
 * @param amount - Amount to format (string or number)
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$1,234.56")
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56); // Returns: "$1,234.56"
 * formatCurrency('1000', 'EUR'); // Returns: "€1,000.00"
 * ```
 */
export function formatCurrency(amount: string | number, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format a large number with K/M/B suffix
 * 
 * @param num - Number to format
 * @returns Formatted string with suffix (e.g., "1.23M")
 * 
 * @example
 * ```typescript
 * formatLargeNumber(1234567); // Returns: "1.23M"
 * formatLargeNumber(1500); // Returns: "1.50K"
 * ```
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

/**
 * Format a timestamp as relative time
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time (e.g., "5m ago", "2h ago")
 * 
 * @example
 * ```typescript
 * formatTimeAgo(Date.now() - 300000); // Returns: "5m ago"
 * formatTimeAgo(Date.now() - 86400000); // Returns: "1d ago"
 * ```
 */
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

/**
 * Get Tailwind CSS color class for risk level
 * 
 * @param level - Risk level string
 * @returns Tailwind CSS text color class
 * 
 * @example
 * ```typescript
 * getRiskColor('high'); // Returns: "text-orange-600"
 * ```
 */
export function getRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get Tailwind CSS color class for transaction status
 * 
 * @param status - Transaction status string
 * @returns Tailwind CSS text color class
 * 
 * @example
 * ```typescript
 * getStatusColor('confirmed'); // Returns: "text-green-600"
 * getStatusColor('pending'); // Returns: "text-yellow-600"
 * ```
 */
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

// ============================================================================
// Fiat24 Bank Payment Mock Data - 银行支付集成
// ============================================================================

/**
 * Fixed IBAN prefix for Fiat24
 */
const FIAT24_FIXED_IBAN = "83051";

/**
 * ISO 7064 Mod 97-10 checksum calculation
 */
function iso7064Mod97_10(iban: string): number {
  let remainder = iban;
  let block: string;

  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97) + remainder.slice(block.length);
  }

  return parseInt(remainder, 10) % 97;
}

/**
 * Prepare IBAN for ISO 13616 checksum
 */
function iso13616Prepare(iban: string): string {
  iban = iban.toUpperCase();
  iban = iban.substr(4) + iban.substr(0, 4);
  const A = 'A'.charCodeAt(0);
  const Z = 'Z'.charCodeAt(0);
  return iban.split('').map(function(n) {
    const code = n.charCodeAt(0);
    if (code >= A && code <= Z) {
      return (code - A + 10).toString();
    } else {
      return n;
    }
  }).join('');
}

/**
 * Get checksum with dynamic token ID length
 */
function getChecksumWithDynamicTokenIDLength(fullTokenId: string): string {
  const bban = `${FIAT24_FIXED_IBAN}${fullTokenId}`;
  const remainder = iso7064Mod97_10(iso13616Prepare("CH" + '00' + bban));
  const checkDigit = ('0' + (98 - remainder)).slice(-2);
  return checkDigit;
}

/**
 * Calculate IBAN from NFT token ID
 * 
 * @param tokenId - NFT token ID
 * @returns Swiss IBAN string
 * 
 * @example
 * ```typescript
 * getIBAN(12345); // Returns: "CH6883051000000012345"
 * ```
 */
export function getIBAN(tokenId: number): string {
  const tokenIdS = tokenId.toString();
  let fullTokenId = tokenIdS;
  while (fullTokenId.length < 12) {
    fullTokenId = "0" + fullTokenId;
  }
  const checksum = getChecksumWithDynamicTokenIDLength(fullTokenId);
  return `CH${checksum}${FIAT24_FIXED_IBAN}${fullTokenId}`;
}

/**
 * Validate IBAN format
 * 
 * @param iban - IBAN string to validate
 * @returns boolean indicating if IBAN format is valid
 */
export function validateIBANFormat(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic format check: 2 letters + 2 digits + up to 30 alphanumeric
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  if (!ibanRegex.test(cleanIBAN)) {
    return false;
  }
  
  // Checksum validation
  const prepared = iso13616Prepare(cleanIBAN);
  return iso7064Mod97_10(prepared) === 1;
}

/**
 * Format IBAN for display (groups of 4)
 */
export function formatIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') || iban;
}

/**
 * Generate mock payment purposes from Fiat24 API
 */
export function generateMockPaymentPurposes(): PaymentPurpose[] {
  return [
    { value: 0, name: "Transfer to own account (other bank)" },
    { value: 1, name: "Purchase of goods" },
    { value: 2, name: "Payment for services (leisure, medical, travel, education, insurance, telecom, etc.)" },
    { value: 3, name: "Family support and inheritance" },
    { value: 4, name: "Charity donation" },
    { value: 5, name: "Salary, Benefits, Dividends" },
    { value: 6, name: "Real Estate and rent" },
    { value: 7, name: "Credit / debit card coverage" },
    { value: 8, name: "Investment, securities, trading" },
    { value: 9, name: "Currency exchange" },
    { value: 10, name: "Tax and governmental payments" },
    { value: 11, name: "Loan, Collateral" },
  ];
}

/**
 * Generate mock country/cities data from Fiat24 API
 */
export function generateMockCountryCities(): Record<string, CountryWithCities> {
  return {
    ARG: {
      name: "Argentina",
      iso3: "ARG",
      postalCodeRegEx: "^[A-Z]\\d{4}\\s[A-Z]{3}$",
      cities: [
        "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "San Miguel de Tucumán",
        "La Plata", "Mar del Plata", "Salta", "Santa Fe", "San Juan"
      ]
    },
    CHE: {
      name: "Switzerland",
      iso3: "CHE",
      postalCodeRegEx: "^\\d{4}$",
      cities: [
        "Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Winterthur",
        "Lucerne", "St. Gallen", "Lugano", "Biel/Bienne"
      ]
    },
    DEU: {
      name: "Germany",
      iso3: "DEU",
      postalCodeRegEx: "^\\d{5}$",
      cities: [
        "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
        "Düsseldorf", "Leipzig", "Dortmund", "Essen"
      ]
    },
    FRA: {
      name: "France",
      iso3: "FRA",
      postalCodeRegEx: "^\\d{5}$",
      cities: [
        "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes",
        "Strasbourg", "Montpellier", "Bordeaux", "Lille"
      ]
    },
    GBR: {
      name: "United Kingdom",
      iso3: "GBR",
      postalCodeRegEx: "^[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}$",
      cities: [
        "London", "Birmingham", "Manchester", "Glasgow", "Liverpool",
        "Bristol", "Sheffield", "Leeds", "Edinburgh", "Leicester"
      ]
    },
    ITA: {
      name: "Italy",
      iso3: "ITA",
      postalCodeRegEx: "^\\d{5}$",
      cities: [
        "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa",
        "Bologna", "Florence", "Bari", "Catania"
      ]
    },
    ESP: {
      name: "Spain",
      iso3: "ESP",
      postalCodeRegEx: "^\\d{5}$",
      cities: [
        "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza",
        "Málaga", "Murcia", "Palma", "Bilbao", "Alicante"
      ]
    },
    NLD: {
      name: "Netherlands",
      iso3: "NLD",
      postalCodeRegEx: "^\\d{4}\\s?[A-Z]{2}$",
      cities: [
        "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven",
        "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"
      ]
    },
    AUT: {
      name: "Austria",
      iso3: "AUT",
      postalCodeRegEx: "^\\d{4}$",
      cities: [
        "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck",
        "Klagenfurt", "Villach", "Wels", "St. Pölten", "Dornbirn"
      ]
    },
    BEL: {
      name: "Belgium",
      iso3: "BEL",
      postalCodeRegEx: "^\\d{4}$",
      cities: [
        "Brussels", "Antwerp", "Ghent", "Charleroi", "Liège",
        "Bruges", "Namur", "Leuven", "Mons", "Mechelen"
      ]
    },
    CHN: {
      name: "China",
      iso3: "CHN",
      postalCodeRegEx: "^\\d{6}$",
      cities: [
        "Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Chengdu",
        "Hangzhou", "Wuhan", "Xi'an", "Suzhou", "Nanjing"
      ]
    },
    JPN: {
      name: "Japan",
      iso3: "JPN",
      postalCodeRegEx: "^\\d{3}-\\d{4}$",
      cities: [
        "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo",
        "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama"
      ]
    },
    USA: {
      name: "United States",
      iso3: "USA",
      postalCodeRegEx: "^\\d{5}(-\\d{4})?$",
      cities: [
        "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
        "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
      ]
    },
    SGP: {
      name: "Singapore",
      iso3: "SGP",
      postalCodeRegEx: "^\\d{6}$",
      cities: ["Singapore"]
    },
    HKG: {
      name: "Hong Kong",
      iso3: "HKG",
      postalCodeRegEx: "^$",
      cities: ["Hong Kong", "Kowloon", "New Territories"]
    }
  };
}

/**
 * Generate mock bank info from IBAN validation
 */
export function generateMockBankInfo(iban: string): Fiat24BankInfo | null {
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
  
  // Mock bank data based on country code
  const countryCode = cleanIBAN.substring(0, 2);
  
  const mockBanks: Record<string, Fiat24BankInfo> = {
    'CH': {
      name: "Zürcher Kantonalbank",
      bankCode: "00700",
      bankCodes: ["00700", "00730", "00754", "00755", "30700"],
      bic: "ZKBKCHZZ",
      country: "CH",
      accountMask: "CH00\\0\\07\\0\\0************",
      accountPlaceholder: "CH0000700000000000000",
      accountNotice: ""
    },
    'DE': {
      name: "Deutsche Bank",
      bankCode: "10070000",
      bankCodes: ["10070000", "10070024"],
      bic: "DEUTDEFF",
      country: "DE",
      accountMask: "DE00\\1\\00\\7\\00\\00**********",
      accountPlaceholder: "DE00100700000000000000",
      accountNotice: ""
    },
    'FR': {
      name: "BNP Paribas",
      bankCode: "30004",
      bankCodes: ["30004"],
      bic: "BNPAFRPP",
      country: "FR",
      accountMask: "FR00\\3\\00\\04***********00",
      accountPlaceholder: "FR0030004000000000000000",
      accountNotice: ""
    },
    'GB': {
      name: "Barclays Bank",
      bankCode: "203053",
      bankCodes: ["203053"],
      bic: "BARCGB22",
      country: "GB",
      accountMask: "GB00\\BA\\RC\\20\\30\\53********",
      accountPlaceholder: "GB00BARC20305300000000",
      accountNotice: ""
    },
    'IT': {
      name: "UniCredit",
      bankCode: "02008",
      bankCodes: ["02008"],
      bic: "UNCRITMM",
      country: "IT",
      accountMask: "IT00\\X\\02\\00\\8*************",
      accountPlaceholder: "IT00X0200800000000000000",
      accountNotice: ""
    }
  };
  
  return mockBanks[countryCode] || null;
}

/**
 * Generate mock bank payment history
 */
export function generateMockBankPayments(): BankPayment[] {
  return [
    {
      id: 'bp-1',
      account: 'CH68 8305 1000 0000 12345',
      bankName: 'Zürcher Kantonalbank',
      bic: 'ZKBKCHZZ',
      amount: '5000.00',
      currency: 'CHF',
      purposeId: 1,
      purposeName: 'Purchase of goods',
      reference: 'Invoice #2024-001',
      creditor: {
        name: 'Acme Corporation',
        street: 'Bahnhofstrasse 10',
        city: 'Zurich',
        zip: '8001',
        country: 'CHE'
      },
      status: 'completed',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      executedAt: Date.now() - 6 * 24 * 60 * 60 * 1000
    },
    {
      id: 'bp-2',
      account: 'DE89 3704 0044 0532 0130 00',
      bankName: 'Deutsche Bank',
      bic: 'DEUTDEFF',
      amount: '2500.00',
      currency: 'EUR',
      purposeId: 2,
      purposeName: 'Payment for services',
      reference: 'Consulting Q4',
      creditor: {
        name: 'Tech Solutions GmbH',
        street: 'Friedrichstraße 123',
        city: 'Berlin',
        zip: '10117',
        country: 'DEU'
      },
      status: 'processing',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    {
      id: 'bp-3',
      account: 'CH68 8305 1000 0000 67890',
      bankName: 'Zürcher Kantonalbank',
      bic: 'ZKBKCHZZ',
      amount: '1000.00',
      currency: 'CHF',
      purposeId: 0,
      purposeName: 'Transfer to own account',
      creditor: 'BR',
      status: 'pending',
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    }
  ];
}

/**
 * Generate mock FX rates from Fiat24 API
 */
export function generateMockFXRates(): Record<string, Fiat24FXRate> {
  return {
    USDCHF: {
      rate: 0.8823,
      bid: 0.8740,
      ask: 0.8906,
      lastUpdateAt: Date.now()
    },
    EURCHF: {
      rate: 0.9612,
      bid: 0.9518,
      ask: 0.9706,
      lastUpdateAt: Date.now()
    },
    USDEUR: {
      rate: 0.9179,
      bid: 0.9088,
      ask: 0.9270,
      lastUpdateAt: Date.now()
    },
    GBPCHF: {
      rate: 1.1245,
      bid: 1.1133,
      ask: 1.1357,
      lastUpdateAt: Date.now()
    },
    GBPEUR: {
      rate: 1.1699,
      bid: 1.1582,
      ask: 1.1816,
      lastUpdateAt: Date.now()
    },
    CNHCHF: {
      rate: 0.1203,
      bid: 0.1191,
      ask: 0.1215,
      lastUpdateAt: Date.now()
    },
    USDGBP: {
      rate: 0.7647,
      bid: 0.7571,
      ask: 0.7723,
      lastUpdateAt: Date.now()
    }
  };
}

/**
 * Generate mock eligible countries list
 */
export function generateMockEligibleCountries(): { 
  eligibleDomiciles: string[]; 
  eligibleDomicilesForCards: string[]; 
  blacklistNationalities: string[] 
} {
  return {
    eligibleDomiciles: [
      "ALA", "AUS", "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST",
      "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ITA", "JPN", "LVA",
      "LIE", "LTU", "LUX", "MLT", "NLD", "NOR", "POL", "PRT", "ROU", "SGP",
      "SVK", "SVN", "ESP", "SWE", "CHE", "TWN"
    ],
    eligibleDomicilesForCards: [
      "ALA", "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST",
      "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ITA", "LVA",
      "LIE", "LTU", "LUX", "MLT", "NLD", "NOR", "POL", "PRT", "ROU",
      "SVK", "SVN", "ESP", "SWE", "CHE"
    ],
    blacklistNationalities: [
      "GUM", "IRN", "PRK", "MNP", "PRI", "RUS", "UMI", "USA"
    ]
  };
}
