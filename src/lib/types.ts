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

// LLM Model Integration Types

export type LLMProvider = 'mock' | 'iflytek-spark' | 'openai' | 'custom';

export interface LLMModelConfig {
  id: string;
  provider: LLMProvider;
  name: string;
  description: string;
  apiEndpoint?: string;
  apiKey?: string;
  appId?: string;
  apiSecret?: string;
  modelVersion?: string;
  maxTokens?: number;
  temperature?: number;
  enabled: boolean;
}

export interface IFlytekSparkConfig {
  appId: string;
  apiKey: string;
  apiSecret: string;
  modelVersion: 'v1.5' | 'v2.0' | 'v3.0' | 'v3.5' | 'v4.0' | '13B';
  domain: string;
  sparkUrl: string;
}

export interface LLMRequestMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMRequestMessage[];
  maxTokens?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
}

export interface LLMResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
