export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism' | 'avalanche';

export type PaymentChannel = 'crypto' | 'stripe' | 'alipay' | 'wechat' | 'unionpay';

export type TransactionStatus = 'pending' | 'signed' | 'broadcasting' | 'confirmed' | 'failed' | 'expired';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type UserRole = 'owner' | 'admin' | 'signer' | 'viewer';

export interface Wallet {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  type: 'single' | 'multisig';
  signers?: string[];
  requiredSignatures?: number;
  balance: {
    native: string;
    usd: string;
  };
  tokens: TokenBalance[];
  createdAt: number;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  priceUsd: string;
  valueUsd: string;
  logo?: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  from: string;
  to: string;
  value: string;
  token?: string;
  network: BlockchainNetwork;
  status: TransactionStatus;
  hash?: string;
  signatures: Signature[];
  requiredSignatures: number;
  createdAt: number;
  executedAt?: number;
  expiresAt: number;
  description?: string;
  riskAssessment?: RiskAssessment;
}

export interface Signature {
  signer: string;
  signature: string;
  signedAt: number;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: string[];
  recommendations: string[];
}

export interface PaymentRequest {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  channel: PaymentChannel;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  description: string;
  paymentUrl?: string;
  qrCode?: string;
  expiresAt: number;
  createdAt: number;
  completedAt?: number;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'staking' | 'liquidity' | 'farming';
  asset: string;
  amount: string;
  valueUsd: string;
  apy: number;
  rewards: string;
  healthFactor?: number;
  network: BlockchainNetwork;
}

export interface DCAStrategy {
  id: string;
  name: string;
  sourceToken: string;
  targetToken: string;
  amountPerInterval: string;
  intervalHours: number;
  lastExecutedAt?: number;
  nextExecutionAt: number;
  totalInvested: string;
  totalReceived: string;
  enabled: boolean;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  members: OrganizationMember[];
  wallets: string[];
  createdAt: number;
}

export interface OrganizationMember {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  joinedAt: number;
}

export interface OmniTokenStats {
  price: number;
  marketCap: number;
  totalSupply: string;
  circulatingSupply: string;
  stakedAmount: string;
  stakingApy: number;
  yourBalance: string;
  yourStaked: string;
  yourRewards: string;
}

export interface NotificationItem {
  id: string;
  type: 'transaction' | 'approval' | 'payment' | 'risk' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}

// AI Assistant Types - Memory, NLP, and Control

export type AIMessageRole = 'user' | 'assistant' | 'system';

export type AIActionType = 
  | 'wallet_query'
  | 'transaction_create'
  | 'defi_manage'
  | 'payment_process'
  | 'risk_analyze'
  | 'settings_update'
  | 'general_chat';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: number;
  action?: AIAction;
}

export interface AIAction {
  type: AIActionType;
  target?: string;
  parameters?: Record<string, unknown>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: string;
}

export interface AIMemoryItem {
  id: string;
  type: 'preference' | 'transaction_pattern' | 'contact' | 'insight';
  key: string;
  value: string;
  confidence: number;
  learnedAt: number;
  usageCount: number;
}

export interface AIAssistantState {
  isActive: boolean;
  currentConversation: AIMessage[];
  memories: AIMemoryItem[];
  capabilities: AICapability[];
  lastActiveAt: number;
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: 'memory' | 'language' | 'control';
}

// Native AI Model Configuration Types - 原生态大模型配置

export type AIModelProvider = 'openai' | 'anthropic' | 'ollama' | 'custom' | 'local';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIModelProvider;
  modelName: string;
  apiEndpoint: string;
  apiKey?: string;
  enabled: boolean;
  isDefault: boolean;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIModelSettings {
  models: AIModelConfig[];
  defaultModelId: string | null;
  enableLocalProcessing: boolean;
  enableSecondaryDevelopment: boolean;
  customEndpoints: CustomEndpoint[];
}

export interface CustomEndpoint {
  id: string;
  name: string;
  url: string;
  headers: Record<string, string>;
  enabled: boolean;
}

// Financial Intelligent Agent Types - 金融智能体类型

export type MarketTrend = 'bullish' | 'bearish' | 'neutral';
export type AlertType = 'price' | 'whale' | 'contract' | 'volume' | 'news';
export type AlertStatus = 'active' | 'triggered' | 'expired' | 'disabled';
export type TradingStrategyType = 'grid' | 'dca' | 'momentum' | 'arbitrage' | 'rebalance';

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdated: number;
}

export interface MarketSentiment {
  overall: MarketTrend;
  fearGreedIndex: number;
  socialMentions: number;
  newsScore: number;
  technicalSignals: {
    rsi: number;
    macd: 'buy' | 'sell' | 'neutral';
    movingAverage: 'above' | 'below' | 'crossing';
  };
}

export interface PriceHistory {
  timestamp: number;
  price: number;
  volume: number;
}

export interface PortfolioAnalytics {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  pnlPercent: number;
  allocation: AllocationItem[];
  performanceHistory: PerformancePoint[];
  riskMetrics: RiskMetrics;
}

export interface AllocationItem {
  asset: string;
  symbol: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformancePoint {
  timestamp: number;
  value: number;
  pnl: number;
}

export interface RiskMetrics {
  var95: number;
  var99: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  correlationToBtc: number;
}

export interface SmartAlert {
  id: string;
  name: string;
  type: AlertType;
  symbol?: string;
  condition: AlertCondition;
  status: AlertStatus;
  notificationChannels: string[];
  createdAt: number;
  triggeredAt?: number;
  lastCheckedAt: number;
}

export interface AlertCondition {
  operator: 'above' | 'below' | 'equals' | 'change_percent';
  value: number;
  timeframe?: string;
}

export interface TradingStrategy {
  id: string;
  name: string;
  type: TradingStrategyType;
  enabled: boolean;
  config: TradingStrategyConfig;
  performance: StrategyPerformance;
  createdAt: number;
  lastExecutedAt?: number;
}

export interface TradingStrategyConfig {
  pair: string;
  investmentAmount: number;
  maxPositionSize: number;
  stopLoss?: number;
  takeProfit?: number;
  gridLevels?: number;
  intervalHours?: number;
  rebalanceThreshold?: number;
}

export interface StrategyPerformance {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  averagePnl: number;
  runningDays: number;
}

export interface WhaleMovement {
  id: string;
  type: 'transfer' | 'exchange_inflow' | 'exchange_outflow';
  token: string;
  amount: string;
  valueUsd: number;
  from: string;
  to: string;
  timestamp: number;
  significance: 'high' | 'medium' | 'low';
}

export interface OnChainMetrics {
  activeAddresses24h: number;
  transactionCount24h: number;
  avgTransactionValue: number;
  gasPrice: number;
  networkHashrate?: number;
  stakingRatio?: number;
}
