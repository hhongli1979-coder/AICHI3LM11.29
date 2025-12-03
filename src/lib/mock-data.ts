/**
 * OmniCore Wallet - Mock Data Generators
 * 
 * This file contains mock data generators and utility functions for the OmniCore Wallet platform.
 * All mock data is used for frontend prototyping and development purposes.
 * 
 * @module mock-data
 */

import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, Fiat24Account, Fiat24CashBalance, Fiat24Limits, Fiat24Transaction, Fiat24CardApproval, Fiat24Contact, Fiat24State, Fiat24ExchangeQuote } from './types';

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
// Fiat24 Banking Integration Mock Data
// ============================================================================

/**
 * Fiat24 contract addresses on Arbitrum
 * These are the official contract addresses from the Fiat24 documentation
 */
export const FIAT24_CONTRACTS = {
  arbitrum: {
    // ERC-721 NFT Account Contract
    account: '0x133CAEecA096cA54889db71956c7f75862Ead7A0',
    // ERC-20 Cash Token Contracts
    USD24: '0xbE00f3db78688d9704BCb4e0a827aea3a9Cc0D62',
    CHF24: '0xd41F1f0cf89fD239ca4c1F8E8ADA46345c86b0a4',
    EUR24: '0x2c5d06f591D0d8cd43Ac232c2B654475a142c7DA',
    CNH24: '0x7288Ac74d211735374A23707D1518DCbbc0144fd',
    // F24 Utility Token
    F24: '0x22043fDdF353308B4F2e7dA2e5284E4D087449e1',
    // Crypto Deposit/FX Contract
    cryptoDeposit: '0x4582f67698843Dfb6A9F195C0dDee05B0A8C973F',
    // Card Authorization Contract
    cardAuthorizer: '0xe2e3B88B9893e18D0867c08f9cA93f8aB5935b14',
    // Official USDC on Arbitrum
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    // WETH on Arbitrum
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  mantle: {
    // Mantle network contracts (to be filled when available)
    account: '',
    USD24: '',
    CHF24: '',
    EUR24: '',
    CNH24: '',
  },
};

/**
 * Fiat24 currency metadata
 */
export const FIAT24_CURRENCIES = {
  USD24: { name: 'US Dollar', symbol: '$', decimals: 2, icon: '🇺🇸', color: '#22C55E' },
  EUR24: { name: 'Euro', symbol: '€', decimals: 2, icon: '🇪🇺', color: '#3B82F6' },
  CHF24: { name: 'Swiss Franc', symbol: 'CHF', decimals: 2, icon: '🇨🇭', color: '#EF4444' },
  CNH24: { name: 'Chinese Yuan (Offshore)', symbol: '¥', decimals: 2, icon: '🇨🇳', color: '#F59E0B' },
};

/**
 * Generate mock Fiat24 account data
 */
export function generateMockFiat24Account(): Fiat24Account {
  return {
    tokenId: 102365,
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    status: 'live',
    iban: 'CH93 0024 1102 3650 0001 E',
    isWalletProvider: false,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    isPremium: false,
    network: 'arbitrum',
  };
}

/**
 * Generate mock Fiat24 cash balances
 */
export function generateMockFiat24Balances(): Fiat24CashBalance[] {
  return [
    {
      currency: 'USD24',
      contractAddress: FIAT24_CONTRACTS.arbitrum.USD24,
      balance: '15234.56',
      balanceUsd: '15234.56',
      exchangeRateUsd: 1.0,
    },
    {
      currency: 'EUR24',
      contractAddress: FIAT24_CONTRACTS.arbitrum.EUR24,
      balance: '8750.00',
      balanceUsd: '9537.50',
      exchangeRateUsd: 1.09,
    },
    {
      currency: 'CHF24',
      contractAddress: FIAT24_CONTRACTS.arbitrum.CHF24,
      balance: '5000.00',
      balanceUsd: '5650.00',
      exchangeRateUsd: 1.13,
    },
    {
      currency: 'CNH24',
      contractAddress: FIAT24_CONTRACTS.arbitrum.CNH24,
      balance: '25000.00',
      balanceUsd: '3472.22',
      exchangeRateUsd: 0.139,
    },
  ];
}

/**
 * Generate mock Fiat24 account limits
 */
export function generateMockFiat24Limits(): Fiat24Limits {
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return {
    clientLimit: 10000000, // 100,000 CHF in cents
    usedLimit: 2500000,    // 25,000 CHF used
    startLimitDate: now - 15 * 24 * 60 * 60 * 1000,
    restartLimitDate: now + 15 * 24 * 60 * 60 * 1000,
  };
}

/**
 * Generate mock Fiat24 transactions
 */
export function generateMockFiat24Transactions(): Fiat24Transaction[] {
  return [
    {
      id: 'f24-tx-1',
      type: 'crypto_deposit',
      from: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      to: '102365',
      amount: 52345,
      currency: 'USD24',
      status: 'confirmed',
      hash: '0xabc123...def456',
      description: '0.5 ETH converted to USD24',
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      network: 'arbitrum',
    },
    {
      id: 'f24-tx-2',
      type: 'p2p_transfer',
      from: '102365',
      to: '89012',
      amount: 100000,
      currency: 'EUR24',
      status: 'confirmed',
      hash: '0x789abc...123def',
      description: 'Payment to supplier',
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
      network: 'arbitrum',
    },
    {
      id: 'f24-tx-3',
      type: 'card_payment',
      from: '102365',
      to: 'Card Payment',
      amount: 4599,
      currency: 'EUR24',
      status: 'confirmed',
      description: 'Online purchase',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      network: 'arbitrum',
    },
    {
      id: 'f24-tx-4',
      type: 'exchange',
      from: 'USD24',
      to: 'EUR24',
      amount: 50000,
      currency: 'USD24',
      status: 'confirmed',
      hash: '0xdef789...abc123',
      description: 'Currency exchange',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      network: 'arbitrum',
    },
    {
      id: 'f24-tx-5',
      type: 'cash_payout',
      from: '102365',
      to: '9102',
      amount: 200000,
      currency: 'CHF24',
      status: 'pending',
      description: 'Bank transfer to external account',
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      network: 'arbitrum',
    },
  ];
}

/**
 * Generate mock Fiat24 card approvals
 */
export function generateMockFiat24CardApprovals(): Fiat24CardApproval[] {
  return [
    {
      authorizerAddress: FIAT24_CONTRACTS.arbitrum.cardAuthorizer,
      currency: 'EUR24',
      approvedAmount: 500000,
      remainingAmount: 345600,
      approvedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    {
      authorizerAddress: FIAT24_CONTRACTS.arbitrum.cardAuthorizer,
      currency: 'USD24',
      approvedAmount: 1000000,
      remainingAmount: 750000,
      approvedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
  ];
}

/**
 * Generate mock Fiat24 whitelisted contacts
 */
export function generateMockFiat24Contacts(): Fiat24Contact[] {
  return [
    {
      contactId: 'EA-00000739',
      name: 'Payward Ltd.',
      platform: 'Kraken',
      currencies: ['EUR24'],
      enabled: true,
    },
    {
      contactId: 'EA-00000740',
      name: 'UAB Bifinity',
      platform: 'Binance',
      currencies: ['EUR24'],
      enabled: true,
    },
    {
      contactId: 'EA-00000741',
      name: 'CB Payments Ltd.',
      platform: 'Coinbase',
      currencies: ['EUR24'],
      enabled: true,
    },
    {
      contactId: 'EA-00000742',
      name: 'Bitstamp Europe SA',
      platform: 'Bitstamp',
      currencies: ['EUR24'],
      enabled: true,
    },
    {
      contactId: 'EA-00000738',
      name: 'Payward Trading Ltd.',
      platform: 'Kraken',
      currencies: ['CHF24'],
      enabled: true,
    },
  ];
}

/**
 * Generate mock Fiat24 exchange rate quote
 */
export function generateMockFiat24ExchangeQuote(
  inputCurrency: 'USD24' | 'EUR24' | 'CHF24' | 'CNH24',
  outputCurrency: 'USD24' | 'EUR24' | 'CHF24' | 'CNH24'
): Fiat24ExchangeQuote {
  // Mock exchange rates (relative to USD)
  const rates: Record<string, number> = {
    'USD24': 1.0,
    'EUR24': 0.92,
    'CHF24': 0.88,
    'CNH24': 7.2,
  };
  
  const inputRate = rates[inputCurrency];
  const outputRate = rates[outputCurrency];
  const rate = Math.round((inputRate / outputRate) * 10000);
  
  return {
    inputCurrency,
    outputCurrency,
    rate,
    spread: 9950, // 0.5% spread (10000 - 50)
    reverseSpread: 10050, // 0.5% reverse spread
    timestamp: Date.now(),
  };
}

/**
 * Generate complete Fiat24 state
 */
export function generateMockFiat24State(): Fiat24State {
  return {
    account: generateMockFiat24Account(),
    balances: generateMockFiat24Balances(),
    limits: generateMockFiat24Limits(),
    transactions: generateMockFiat24Transactions(),
    cardApprovals: generateMockFiat24CardApprovals(),
    contacts: generateMockFiat24Contacts(),
    isConnected: true,
    network: 'arbitrum',
  };
}

/**
 * Format Fiat24 amount (cents to display value)
 * @param amount Amount in cents (integer)
 * @param currency Currency code
 * @returns Formatted string with currency symbol
 */
export function formatFiat24Amount(amount: number, currency: 'USD24' | 'EUR24' | 'CHF24' | 'CNH24'): string {
  const currencyInfo = FIAT24_CURRENCIES[currency];
  const value = amount / 100;
  return `${currencyInfo.symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Get Fiat24 account status display info
 */
export function getFiat24StatusInfo(status: string): { label: string; color: string; description: string } {
  switch (status) {
    case 'live':
      return { label: 'Live', color: 'text-green-600', description: 'Verified user with full access' };
    case 'tourist':
      return { label: 'Tourist', color: 'text-yellow-600', description: 'Unverified user with limited access' };
    case 'softBlocked':
      return { label: 'Soft Blocked', color: 'text-orange-600', description: 'Can receive only, cannot send' };
    case 'blocked':
      return { label: 'Blocked', color: 'text-red-600', description: 'Account frozen' };
    case 'closed':
      return { label: 'Closed', color: 'text-gray-600', description: 'Account closed' };
    default:
      return { label: 'Unknown', color: 'text-gray-600', description: 'Unknown status' };
  }
}

/**
 * Get Fiat24 transaction type display info
 */
export function getFiat24TransactionTypeInfo(type: string): { label: string; icon: string; color: string } {
  switch (type) {
    case 'p2p_transfer':
      return { label: 'P2P Transfer', icon: 'ArrowsLeftRight', color: 'text-blue-600' };
    case 'crypto_deposit':
      return { label: 'Crypto Deposit', icon: 'CurrencyBtc', color: 'text-green-600' };
    case 'cash_deposit':
      return { label: 'Cash Deposit', icon: 'Bank', color: 'text-green-600' };
    case 'cash_payout':
      return { label: 'Cash Payout', icon: 'Wallet', color: 'text-orange-600' };
    case 'card_payment':
      return { label: 'Card Payment', icon: 'CreditCard', color: 'text-purple-600' };
    case 'exchange':
      return { label: 'Exchange', icon: 'ArrowsClockwise', color: 'text-indigo-600' };
    default:
      return { label: 'Transaction', icon: 'Receipt', color: 'text-gray-600' };
  }
}
