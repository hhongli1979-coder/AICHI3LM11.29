import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, IntelligentAgent, AgentCollaboration, GlobalPaymentRoute, GlobalPaymentAccount, GlobalPaymentTransaction, ComplianceLicense, RiskMetrics, ReconciliationReport, A2APaymentProtocol, DAOGovernance, MultiAgentPlatformStats } from './types';

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

// Multi-Agent Global Payment Platform Mock Data - 多智能体全球收款平台

export function generateMockIntelligentAgents(): IntelligentAgent[] {
  return [
    {
      id: 'agent-1',
      type: 'routing',
      name: '路由智能体',
      description: '根据实时费率、到账速度和合规要求动态选择最优收款路径',
      status: 'active',
      lastActiveAt: Date.now() - 5 * 1000,
      processedCount: 15234,
      successRate: 99.8,
      avgProcessingTime: 120,
      isEnabled: true,
    },
    {
      id: 'agent-2',
      type: 'compliance',
      name: '合规智能体',
      description: '自动验证贸易材料真实性，实现分钟级开户审核',
      status: 'active',
      lastActiveAt: Date.now() - 15 * 1000,
      processedCount: 8456,
      successRate: 99.5,
      avgProcessingTime: 180,
      isEnabled: true,
    },
    {
      id: 'agent-3',
      type: 'risk',
      name: '风控智能体',
      description: '秒级审核支付订单，将欺诈风险率控制在万分之一以下',
      status: 'processing',
      lastActiveAt: Date.now() - 2 * 1000,
      processedCount: 45678,
      successRate: 99.99,
      avgProcessingTime: 50,
      isEnabled: true,
    },
    {
      id: 'agent-4',
      type: 'settlement',
      name: '结算智能体',
      description: '自动执行资金结算，优化跨境资金流转效率',
      status: 'active',
      lastActiveAt: Date.now() - 30 * 1000,
      processedCount: 12890,
      successRate: 99.9,
      avgProcessingTime: 200,
      isEnabled: true,
    },
    {
      id: 'agent-5',
      type: 'reconciliation',
      name: '对账智能体',
      description: '智能对账系统，自动匹配交易记录与银行流水',
      status: 'idle',
      lastActiveAt: Date.now() - 60 * 1000,
      processedCount: 5678,
      successRate: 99.7,
      avgProcessingTime: 300,
      isEnabled: true,
    },
    {
      id: 'agent-6',
      type: 'analytics',
      name: '分析智能体',
      description: '实时分析交易数据，生成多维业财报表和洞察',
      status: 'active',
      lastActiveAt: Date.now() - 10 * 1000,
      processedCount: 3456,
      successRate: 99.6,
      avgProcessingTime: 150,
      isEnabled: true,
    },
  ];
}

export function generateMockAgentCollaborations(): AgentCollaboration[] {
  return [
    {
      id: 'collab-1',
      triggerAgent: 'routing',
      collaboratingAgents: ['compliance', 'risk'],
      decision: '选择香港->新加坡路径，费率最优0.15%，预计2小时到账',
      timestamp: Date.now() - 5 * 60 * 1000,
      processingTime: 350,
      outcome: 'success',
    },
    {
      id: 'collab-2',
      triggerAgent: 'risk',
      collaboratingAgents: ['compliance', 'analytics'],
      decision: '检测到异常交易模式，触发二次验证流程',
      timestamp: Date.now() - 15 * 60 * 1000,
      processingTime: 120,
      outcome: 'pending',
    },
    {
      id: 'collab-3',
      triggerAgent: 'settlement',
      collaboratingAgents: ['routing', 'reconciliation'],
      decision: '批量结算完成，自动匹配1,234笔交易',
      timestamp: Date.now() - 30 * 60 * 1000,
      processingTime: 2500,
      outcome: 'success',
    },
    {
      id: 'collab-4',
      triggerAgent: 'compliance',
      collaboratingAgents: ['risk', 'analytics'],
      decision: '新客户KYC审核通过，风险评级：低',
      timestamp: Date.now() - 45 * 60 * 1000,
      processingTime: 180,
      outcome: 'success',
    },
  ];
}

export function generateMockGlobalPaymentRoutes(): GlobalPaymentRoute[] {
  return [
    {
      id: 'route-1',
      sourceCurrency: 'USD',
      targetCurrency: 'CNY',
      paymentMethod: 'wire',
      exchangeRate: 7.24,
      fee: 0.15,
      estimatedTime: '2-4小时',
      isOptimal: true,
      riskScore: 12,
      complianceStatus: 'approved',
    },
    {
      id: 'route-2',
      sourceCurrency: 'EUR',
      targetCurrency: 'GBP',
      paymentMethod: 'wire',
      exchangeRate: 0.86,
      fee: 0.10,
      estimatedTime: '即时',
      isOptimal: true,
      riskScore: 5,
      complianceStatus: 'approved',
    },
    {
      id: 'route-3',
      sourceCurrency: 'USD',
      targetCurrency: 'JPY',
      paymentMethod: 'wire',
      exchangeRate: 149.50,
      fee: 0.12,
      estimatedTime: '1-2小时',
      isOptimal: false,
      riskScore: 8,
      complianceStatus: 'approved',
    },
    {
      id: 'route-4',
      sourceCurrency: 'CNY',
      targetCurrency: 'USD',
      paymentMethod: 'alipay',
      exchangeRate: 0.138,
      fee: 0.08,
      estimatedTime: '即时',
      isOptimal: true,
      riskScore: 10,
      complianceStatus: 'approved',
    },
  ];
}

export function generateMockGlobalPaymentAccounts(): GlobalPaymentAccount[] {
  return [
    {
      id: 'gpa-1',
      currency: 'USD',
      balance: '1,234,567.89',
      availableBalance: '1,200,000.00',
      accountNumber: '****3456',
      bankName: 'JP Morgan Chase',
      country: '美国',
      status: 'active',
      createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'gpa-2',
      currency: 'EUR',
      balance: '856,234.56',
      availableBalance: '850,000.00',
      accountNumber: '****7890',
      bankName: 'Deutsche Bank',
      country: '德国',
      status: 'active',
      createdAt: Date.now() - 300 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'gpa-3',
      currency: 'CNY',
      balance: '5,678,901.23',
      availableBalance: '5,500,000.00',
      accountNumber: '****1234',
      bankName: '中国银行',
      country: '中国',
      status: 'active',
      createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'gpa-4',
      currency: 'GBP',
      balance: '456,789.12',
      availableBalance: '450,000.00',
      accountNumber: '****5678',
      bankName: 'HSBC',
      country: '英国',
      status: 'active',
      createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'gpa-5',
      currency: 'SGD',
      balance: '234,567.89',
      availableBalance: '230,000.00',
      accountNumber: '****9012',
      bankName: 'DBS Bank',
      country: '新加坡',
      status: 'active',
      createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockGlobalPaymentTransactions(): GlobalPaymentTransaction[] {
  return [
    {
      id: 'gpt-1',
      fromAccount: 'gpa-1',
      toAccount: 'external-supplier-1',
      amount: '50,000.00',
      sourceCurrency: 'USD',
      targetCurrency: 'CNY',
      exchangeRate: 7.24,
      fee: '75.00',
      paymentMethod: 'wire',
      status: 'settled',
      routeId: 'route-1',
      agentDecisions: [
        { agentType: 'routing', decision: '选择最优路径', confidence: 0.98, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
        { agentType: 'compliance', decision: '合规审核通过', confidence: 0.99, timestamp: Date.now() - 2 * 60 * 60 * 1000 + 5000 },
        { agentType: 'risk', decision: '风险评分：低', confidence: 0.97, timestamp: Date.now() - 2 * 60 * 60 * 1000 + 8000 },
      ],
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      settledAt: Date.now() - 1 * 60 * 60 * 1000,
      estimatedSettlement: '2小时',
    },
    {
      id: 'gpt-2',
      fromAccount: 'gpa-2',
      toAccount: 'external-client-1',
      amount: '25,000.00',
      sourceCurrency: 'EUR',
      targetCurrency: 'GBP',
      exchangeRate: 0.86,
      fee: '25.00',
      paymentMethod: 'wire',
      status: 'processing',
      routeId: 'route-2',
      agentDecisions: [
        { agentType: 'routing', decision: '选择SEPA即时路径', confidence: 0.99, timestamp: Date.now() - 30 * 60 * 1000 },
        { agentType: 'compliance', decision: '验证中', confidence: 0.85, timestamp: Date.now() - 25 * 60 * 1000 },
      ],
      createdAt: Date.now() - 45 * 60 * 1000,
      estimatedSettlement: '30分钟',
    },
    {
      id: 'gpt-3',
      fromAccount: 'gpa-3',
      toAccount: 'external-supplier-2',
      amount: '100,000.00',
      sourceCurrency: 'CNY',
      targetCurrency: 'USD',
      exchangeRate: 0.138,
      fee: '80.00',
      paymentMethod: 'alipay',
      status: 'compliance_review',
      routeId: 'route-4',
      agentDecisions: [
        { agentType: 'routing', decision: '选择支付宝跨境支付', confidence: 0.96, timestamp: Date.now() - 20 * 60 * 1000 },
        { agentType: 'risk', decision: '大额交易，需人工复核', confidence: 0.75, timestamp: Date.now() - 15 * 60 * 1000 },
      ],
      createdAt: Date.now() - 25 * 60 * 1000,
      estimatedSettlement: '1-2小时',
    },
  ];
}

export function generateMockComplianceLicenses(): ComplianceLicense[] {
  return [
    {
      id: 'license-1',
      country: '美国',
      licenseType: 'MSB',
      licenseName: 'Money Services Business License',
      issueDate: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
      expiryDate: Date.now() + 1 * 365 * 24 * 60 * 60 * 1000,
      status: 'active',
    },
    {
      id: 'license-2',
      country: '欧盟',
      licenseType: 'EMI',
      licenseName: 'Electronic Money Institution License',
      issueDate: Date.now() - 3 * 365 * 24 * 60 * 60 * 1000,
      expiryDate: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000,
      status: 'active',
    },
    {
      id: 'license-3',
      country: '英国',
      licenseType: 'FCA',
      licenseName: 'FCA Authorized Payment Institution',
      issueDate: Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000,
      expiryDate: Date.now() + 1.5 * 365 * 24 * 60 * 60 * 1000,
      status: 'active',
    },
    {
      id: 'license-4',
      country: '新加坡',
      licenseType: 'MPI',
      licenseName: 'Major Payment Institution License',
      issueDate: Date.now() - 2.5 * 365 * 24 * 60 * 60 * 1000,
      expiryDate: Date.now() + 0.5 * 365 * 24 * 60 * 60 * 1000,
      status: 'renewal',
    },
    {
      id: 'license-5',
      country: '香港',
      licenseType: 'MSO',
      licenseName: 'Money Service Operator License',
      issueDate: Date.now() - 1 * 365 * 24 * 60 * 60 * 1000,
      expiryDate: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000,
      status: 'active',
    },
    {
      id: 'license-6',
      country: '日本',
      licenseType: 'JFSA',
      licenseName: 'Funds Transfer Service Provider',
      issueDate: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
      expiryDate: Date.now() + 1 * 365 * 24 * 60 * 60 * 1000,
      status: 'active',
    },
  ];
}

export function generateMockRiskMetrics(): RiskMetrics {
  return {
    fraudRate: 0.00008,
    blockedTransactions: 23,
    flaggedTransactions: 156,
    avgRiskScore: 15.5,
    realTimeMonitoring: true,
    lastScanAt: Date.now() - 30 * 1000,
  };
}

export function generateMockReconciliationReports(): ReconciliationReport[] {
  return [
    {
      id: 'recon-1',
      period: '2024年12月',
      totalTransactions: 15678,
      matchedTransactions: 15650,
      discrepancies: 28,
      autoReconciled: 15600,
      manualReview: 78,
      status: 'in_progress',
      generatedAt: Date.now() - 1 * 60 * 60 * 1000,
    },
    {
      id: 'recon-2',
      period: '2024年11月',
      totalTransactions: 14532,
      matchedTransactions: 14532,
      discrepancies: 0,
      autoReconciled: 14500,
      manualReview: 32,
      status: 'completed',
      generatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'recon-3',
      period: '2024年10月',
      totalTransactions: 13890,
      matchedTransactions: 13890,
      discrepancies: 0,
      autoReconciled: 13850,
      manualReview: 40,
      status: 'completed',
      generatedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockA2AProtocols(): A2APaymentProtocol[] {
  return [
    {
      id: 'a2a-1',
      name: 'MCP Protocol',
      version: '2.0',
      description: '多智能体协作协议，支持AI Agent间直接价值交换',
      isEnabled: true,
      supportedAgents: ['routing', 'settlement', 'risk'],
      transactionCount: 5678,
    },
    {
      id: 'a2a-2',
      name: 'DePA Protocol',
      version: '1.5',
      description: '去中心化支付代理协议，一次授权多次免密',
      isEnabled: true,
      supportedAgents: ['settlement', 'compliance'],
      transactionCount: 3456,
    },
    {
      id: 'a2a-3',
      name: 'Agent-to-Agent Direct',
      version: '1.0',
      description: 'AI Agent经济原生支付协议',
      isEnabled: false,
      supportedAgents: ['routing', 'settlement'],
      transactionCount: 1234,
    },
  ];
}

export function generateMockDAOProposals(): DAOGovernance[] {
  return [
    {
      id: 'dao-1',
      proposalTitle: '新增巴西雷亚尔(BRL)收款通道',
      description: '提议新增巴西本地支付方式PIX和Boleto，覆盖拉美市场',
      proposer: '0x1234...5678',
      status: 'active',
      votesFor: 1250000,
      votesAgainst: 320000,
      quorum: 1000000,
      endDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'dao-2',
      proposalTitle: '降低平台手续费至0.1%',
      description: '提议将跨境支付手续费从0.15%降至0.1%以提升竞争力',
      proposer: '0x8765...4321',
      status: 'passed',
      votesFor: 2150000,
      votesAgainst: 450000,
      quorum: 1000000,
      endDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'dao-3',
      proposalTitle: '接入Anthropic Claude模型',
      description: '提议将Claude模型纳入平台AI智能体底座选项',
      proposer: '0xabcd...efgh',
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      quorum: 1000000,
      endDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockMultiAgentPlatformStats(): MultiAgentPlatformStats {
  return {
    totalAgents: 6,
    activeAgents: 5,
    totalTransactionsToday: 2456,
    totalVolumeToday: '$12,345,678',
    avgSettlementTime: '2.5小时',
    supportedCurrencies: 42,
    supportedPaymentMethods: 23,
    complianceLicenses: 65,
    fraudRatePercent: '0.008%',
    efficiencyImprovement: '+30%',
  };
}
