/**
 * OmniCore Wallet - Mock Data Generators
 * 
 * This file contains mock data generators and utility functions for the OmniCore Wallet platform.
 * All mock data is used for frontend prototyping and development purposes.
 * 
 * @module mock-data
 */

import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint } from './types';

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
    {
      id: 'model-4',
      name: 'Omega-AI 深度学习引擎',
      provider: 'omega-ai',
      modelName: 'omega-ai-transformer',
      apiEndpoint: 'http://localhost:8080/api/inference',
      enabled: true,
      isDefault: false,
      maxTokens: 4096,
      temperature: 0.6,
      systemPrompt: '你是基于Omega-AI深度学习框架的智能助手，专注于金融风险分析和智能决策。支持自动求导、多GPU训练和CUDA/CUDNN加速。',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
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
// Multi-Agent System Mock Data - 多智能体系统模拟数据
// ============================================================================

import type { AIAgent, WebSearchResult, KnowledgeEntry, EvolutionEvent, AgentTask, MultiAgentSystemState, AgentSpecialization, EvolutionStage } from './types';

/**
 * Generate mock AI agents for the multi-agent system
 */
export function generateMockAgents(): AIAgent[] {
  return [
    {
      id: 'agent-1',
      name: '数据分析师 Alpha',
      specialization: 'data_analyst',
      status: 'working',
      evolutionStage: 'advanced',
      experiencePoints: 8500,
      experienceToNextStage: 10000,
      tasksCompleted: 342,
      successRate: 94.5,
      capabilities: ['市场数据分析', '价格预测', '交易量分析', '趋势识别'],
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      lastActiveAt: Date.now() - 5 * 60 * 1000,
      enabled: true,
      learnedSkills: [
        {
          id: 'skill-1-1',
          name: 'K线形态识别',
          description: '识别常见的K线形态并预测价格走势',
          proficiency: 92,
          usageCount: 156,
          learnedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'skill-1-2',
          name: '链上数据分析',
          description: '分析区块链上的交易数据和地址行为',
          proficiency: 88,
          usageCount: 98,
          learnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        },
      ],
    },
    {
      id: 'agent-2',
      name: '网络探索者 Beta',
      specialization: 'web_searcher',
      status: 'idle',
      evolutionStage: 'intermediate',
      experiencePoints: 4200,
      experienceToNextStage: 5000,
      tasksCompleted: 189,
      successRate: 91.2,
      capabilities: ['实时新闻搜索', '项目研究', '社交媒体监控', '舆情分析'],
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      lastActiveAt: Date.now() - 30 * 60 * 1000,
      enabled: true,
      learnedSkills: [
        {
          id: 'skill-2-1',
          name: '多源信息整合',
          description: '从多个来源收集和整合相关信息',
          proficiency: 85,
          usageCount: 234,
          learnedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
        },
      ],
    },
    {
      id: 'agent-3',
      name: '风险卫士 Gamma',
      specialization: 'risk_assessor',
      status: 'learning',
      evolutionStage: 'expert',
      experiencePoints: 15200,
      experienceToNextStage: 20000,
      tasksCompleted: 567,
      successRate: 97.8,
      capabilities: ['交易风险评估', '地址信誉分析', '智能合约审计', '异常检测'],
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      lastActiveAt: Date.now() - 2 * 60 * 1000,
      enabled: true,
      learnedSkills: [
        {
          id: 'skill-3-1',
          name: '智能合约漏洞检测',
          description: '检测智能合约中的常见安全漏洞',
          proficiency: 96,
          usageCount: 312,
          learnedAt: Date.now() - 75 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'skill-3-2',
          name: '反洗钱分析',
          description: '识别可疑的资金流动模式',
          proficiency: 94,
          usageCount: 187,
          learnedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'skill-3-3',
          name: '实时风险预警',
          description: '实时监控并预警潜在风险',
          proficiency: 91,
          usageCount: 445,
          learnedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
        },
      ],
    },
    {
      id: 'agent-4',
      name: 'DeFi优化师 Delta',
      specialization: 'defi_optimizer',
      status: 'working',
      evolutionStage: 'advanced',
      experiencePoints: 7800,
      experienceToNextStage: 10000,
      tasksCompleted: 256,
      successRate: 93.1,
      capabilities: ['收益优化', '流动性分析', '协议对比', '策略推荐'],
      createdAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
      lastActiveAt: Date.now() - 10 * 60 * 1000,
      enabled: true,
      learnedSkills: [
        {
          id: 'skill-4-1',
          name: '无损收益策略',
          description: '识别和推荐低风险高收益的DeFi策略',
          proficiency: 89,
          usageCount: 156,
          learnedAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
        },
      ],
    },
    {
      id: 'agent-5',
      name: '知识管理者 Epsilon',
      specialization: 'knowledge_manager',
      status: 'idle',
      evolutionStage: 'intermediate',
      experiencePoints: 3500,
      experienceToNextStage: 5000,
      tasksCompleted: 128,
      successRate: 96.5,
      capabilities: ['知识整理', '文档生成', '学习路径规划', '信息检索'],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      lastActiveAt: Date.now() - 1 * 60 * 60 * 1000,
      enabled: true,
      learnedSkills: [
        {
          id: 'skill-5-1',
          name: '跨领域知识关联',
          description: '发现不同知识领域之间的关联',
          proficiency: 82,
          usageCount: 89,
          learnedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
        },
      ],
    },
    {
      id: 'agent-6',
      name: '协调者 Omega',
      specialization: 'coordinator',
      status: 'working',
      evolutionStage: 'master',
      experiencePoints: 25000,
      experienceToNextStage: 30000,
      tasksCompleted: 1024,
      successRate: 98.2,
      capabilities: ['任务分配', '智能体协调', '优先级管理', '冲突解决'],
      createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      lastActiveAt: Date.now(),
      enabled: true,
      learnedSkills: [
        {
          id: 'skill-6-1',
          name: '多智能体协同',
          description: '协调多个智能体共同完成复杂任务',
          proficiency: 98,
          usageCount: 512,
          learnedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'skill-6-2',
          name: '自适应任务分配',
          description: '根据智能体能力动态分配任务',
          proficiency: 96,
          usageCount: 423,
          learnedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        },
      ],
    },
  ];
}

/**
 * Generate mock web search results
 */
export function generateMockWebSearchResults(): WebSearchResult[] {
  return [
    {
      id: 'search-1',
      query: 'ETH 2.0 质押收益率',
      title: 'Ethereum 2.0 Staking: 2024年最新收益率分析',
      url: 'https://example.com/eth-staking-yields',
      snippet: '根据最新数据，ETH 2.0 质押年化收益率约为 4.5-5.2%，较去年有所下降...',
      relevanceScore: 95,
      sourceType: 'news',
      searchedAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 'search-2',
      query: 'Aave V3 安全审计报告',
      title: 'Aave V3 Protocol Security Audit Report',
      url: 'https://example.com/aave-v3-audit',
      snippet: 'Aave V3 已通过多家安全公司审计，包括 OpenZeppelin 和 Trail of Bits...',
      relevanceScore: 92,
      sourceType: 'documentation',
      searchedAt: Date.now() - 5 * 60 * 60 * 1000,
    },
    {
      id: 'search-3',
      query: 'Layer 2 扩容方案对比',
      title: 'Arbitrum vs Optimism vs zkSync: 2024年最佳L2选择',
      url: 'https://example.com/l2-comparison',
      snippet: '本文深入对比三大 Layer 2 解决方案的性能、费用和生态系统...',
      relevanceScore: 88,
      sourceType: 'blog',
      searchedAt: Date.now() - 12 * 60 * 60 * 1000,
    },
    {
      id: 'search-4',
      query: 'DeFi 监管政策更新',
      title: 'SEC最新DeFi监管框架解读',
      url: 'https://example.com/sec-defi-regulation',
      snippet: '美国证券交易委员会（SEC）近期发布了关于去中心化金融的新监管指南...',
      relevanceScore: 85,
      sourceType: 'official',
      searchedAt: Date.now() - 24 * 60 * 60 * 1000,
    },
  ];
}

/**
 * Generate mock knowledge base entries
 */
export function generateMockKnowledgeBase(): KnowledgeEntry[] {
  return [
    {
      id: 'kb-1',
      category: 'defi',
      title: 'Impermanent Loss 计算公式',
      content: '无常损失 = 2 * sqrt(price_ratio) / (1 + price_ratio) - 1。当价格变化 2 倍时，损失约 5.7%；变化 5 倍时，损失约 25.5%。',
      source: '学习自用户交易历史分析',
      confidence: 0.95,
      referenceCount: 45,
      addedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      tags: ['DeFi', '流动性挖矿', '风险'],
    },
    {
      id: 'kb-2',
      category: 'security',
      title: '常见智能合约攻击向量',
      content: '包括重入攻击、闪电贷攻击、价格操纵、前端运行、治理攻击等。建议使用 Reentrancy Guard 和 时间锁定等防护措施。',
      source: '安全审计报告汇总',
      confidence: 0.98,
      referenceCount: 78,
      addedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      tags: ['安全', '智能合约', '审计'],
    },
    {
      id: 'kb-3',
      category: 'market',
      title: 'BTC/ETH 相关性分析',
      content: 'BTC 与 ETH 的价格相关性通常在 0.7-0.9 之间。在市场高波动期，相关性会降低，提供潜在的对冲机会。',
      source: '历史数据分析',
      confidence: 0.88,
      referenceCount: 34,
      addedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      tags: ['市场', '相关性', '分析'],
    },
    {
      id: 'kb-4',
      category: 'technology',
      title: 'EIP-4844 Proto-Danksharding',
      content: 'EIP-4844 引入 blob 交易，大幅降低 L2 数据可用性成本，预计可将 L2 交易费用降低 10-100 倍。',
      source: '以太坊官方文档',
      confidence: 0.96,
      referenceCount: 56,
      addedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      tags: ['技术', '以太坊', '扩容'],
    },
    {
      id: 'kb-5',
      category: 'crypto',
      title: '跨链桥安全最佳实践',
      content: '推荐使用多签验证的桥协议，避免单点故障。检查桥的TVL、审计报告和运行历史。',
      source: '安全研究报告',
      confidence: 0.92,
      referenceCount: 42,
      addedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      tags: ['跨链', '安全', '桥'],
    },
  ];
}

/**
 * Generate mock evolution events
 */
export function generateMockEvolutionEvents(): EvolutionEvent[] {
  return [
    {
      id: 'evo-1',
      agentId: 'agent-3',
      fromStage: 'advanced',
      toStage: 'expert',
      skillsGained: ['实时风险预警', '高级威胁检测'],
      evolvedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'evo-2',
      agentId: 'agent-1',
      fromStage: 'intermediate',
      toStage: 'advanced',
      skillsGained: ['链上数据分析', '预测模型优化'],
      evolvedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'evo-3',
      agentId: 'agent-6',
      fromStage: 'expert',
      toStage: 'master',
      skillsGained: ['自适应任务分配', '全局优化决策'],
      evolvedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'evo-4',
      agentId: 'agent-4',
      fromStage: 'intermediate',
      toStage: 'advanced',
      skillsGained: ['无损收益策略', 'Gas优化'],
      evolvedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    },
  ];
}

/**
 * Generate mock agent tasks
 */
export function generateMockAgentTasks(): AgentTask[] {
  return [
    {
      id: 'task-1',
      description: '分析最近24小时的以太坊Gas价格趋势',
      assignedAgentId: 'agent-1',
      priority: 3,
      status: 'completed',
      result: 'Gas价格在过去24小时内平均为35 Gwei，峰值出现在UTC 14:00左右',
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      completedAt: Date.now() - 1 * 60 * 60 * 1000,
    },
    {
      id: 'task-2',
      description: '搜索并汇总Arbitrum最新生态项目',
      assignedAgentId: 'agent-2',
      priority: 2,
      status: 'in_progress',
      createdAt: Date.now() - 30 * 60 * 1000,
    },
    {
      id: 'task-3',
      description: '评估地址0x742d35Cc...的风险等级',
      assignedAgentId: 'agent-3',
      priority: 5,
      status: 'completed',
      result: '风险等级: 低。该地址是已验证的知名协议合约，无异常交易记录。',
      createdAt: Date.now() - 15 * 60 * 1000,
      completedAt: Date.now() - 10 * 60 * 1000,
    },
    {
      id: 'task-4',
      description: '优化当前DeFi策略组合的收益率',
      assignedAgentId: 'agent-4',
      priority: 4,
      status: 'in_progress',
      createdAt: Date.now() - 45 * 60 * 1000,
    },
    {
      id: 'task-5',
      description: '将最新的安全研究发现添加到知识库',
      assignedAgentId: 'agent-5',
      priority: 2,
      status: 'pending',
      createdAt: Date.now() - 5 * 60 * 1000,
    },
  ];
}

/**
 * Generate complete multi-agent system state
 */
export function generateMockMultiAgentState(): MultiAgentSystemState {
  const agents = generateMockAgents();
  const tasks = generateMockAgentTasks();
  
  return {
    agents,
    tasks,
    knowledgeBase: generateMockKnowledgeBase(),
    searchHistory: generateMockWebSearchResults(),
    evolutionHistory: generateMockEvolutionEvents(),
    stats: {
      totalTasksCompleted: agents.reduce((sum, a) => sum + a.tasksCompleted, 0),
      averageSuccessRate: agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length,
      knowledgeBaseSize: 5,
      totalEvolutions: 4,
    },
  };
}

/**
 * Get agent specialization label in Chinese
 */
export function getAgentSpecializationLabel(spec: AgentSpecialization): string {
  switch (spec) {
    case 'data_analyst': return '数据分析';
    case 'web_searcher': return '网络搜索';
    case 'code_generator': return '代码生成';
    case 'risk_assessor': return '风险评估';
    case 'defi_optimizer': return 'DeFi优化';
    case 'transaction_monitor': return '交易监控';
    case 'knowledge_manager': return '知识管理';
    case 'coordinator': return '协调者';
    default: return spec;
  }
}

/**
 * Get evolution stage label in Chinese
 */
export function getEvolutionStageLabel(stage: EvolutionStage): string {
  switch (stage) {
    case 'basic': return '基础';
    case 'intermediate': return '中级';
    case 'advanced': return '高级';
    case 'expert': return '专家';
    case 'master': return '大师';
    default: return stage;
  }
}
