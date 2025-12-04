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

// Multi-Agent Global Payment Platform Types - 多智能体全球收款平台

export type AgentType = 'routing' | 'compliance' | 'risk' | 'settlement' | 'reconciliation' | 'analytics';

export type AgentStatus = 'active' | 'idle' | 'processing' | 'error';

export type PaymentCurrency = 'USD' | 'EUR' | 'GBP' | 'CNY' | 'JPY' | 'KRW' | 'SGD' | 'HKD' | 'AUD' | 'CAD' | 'CHF' | 'INR' | 'BRL' | 'MXN' | 'RUB' | 'ZAR' | 'AED' | 'THB' | 'VND' | 'PHP' | 'IDR' | 'MYR' | 'TWD' | 'NZD' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'CZK' | 'HUF' | 'TRY' | 'ILS' | 'SAR' | 'QAR' | 'KWD' | 'BHD' | 'OMR' | 'EGP' | 'PKR' | 'BDT' | 'NGN';

export type LocalPaymentMethod = 'alipay' | 'wechat_pay' | 'paynow' | 'promptpay' | 'grabpay' | 'dana' | 'ovo' | 'gopay' | 'kakaopay' | 'linepay' | 'pix' | 'boleto' | 'upi' | 'paytm' | 'bnpl_klarna' | 'bnpl_afterpay' | 'bnpl_affirm' | 'ideal' | 'bancontact' | 'giropay' | 'sofort' | 'eps' | 'przelewy24';

export interface IntelligentAgent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  status: AgentStatus;
  lastActiveAt: number;
  processedCount: number;
  successRate: number;
  avgProcessingTime: number;
  isEnabled: boolean;
}

export interface AgentCollaboration {
  id: string;
  triggerAgent: AgentType;
  collaboratingAgents: AgentType[];
  decision: string;
  timestamp: number;
  processingTime: number;
  outcome: 'success' | 'pending' | 'failed';
}

export interface GlobalPaymentRoute {
  id: string;
  sourceCurrency: PaymentCurrency;
  targetCurrency: PaymentCurrency;
  paymentMethod: LocalPaymentMethod | 'crypto' | 'wire' | 'card';
  exchangeRate: number;
  fee: number;
  estimatedTime: string;
  isOptimal: boolean;
  riskScore: number;
  complianceStatus: 'approved' | 'pending' | 'flagged';
}

export interface GlobalPaymentAccount {
  id: string;
  currency: PaymentCurrency;
  balance: string;
  availableBalance: string;
  accountNumber: string;
  bankName: string;
  country: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: number;
}

export interface GlobalPaymentTransaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: string;
  sourceCurrency: PaymentCurrency;
  targetCurrency: PaymentCurrency;
  exchangeRate: number;
  fee: string;
  paymentMethod: LocalPaymentMethod | 'crypto' | 'wire' | 'card';
  status: 'initiated' | 'processing' | 'compliance_review' | 'settled' | 'failed';
  routeId: string;
  agentDecisions: AgentDecision[];
  createdAt: number;
  settledAt?: number;
  estimatedSettlement: string;
}

export interface AgentDecision {
  agentType: AgentType;
  decision: string;
  confidence: number;
  timestamp: number;
  details?: string;
}

export interface ComplianceLicense {
  id: string;
  country: string;
  licenseType: string;
  licenseName: string;
  issueDate: number;
  expiryDate: number;
  status: 'active' | 'pending' | 'expired' | 'renewal';
}

export interface RiskMetrics {
  fraudRate: number;
  blockedTransactions: number;
  flaggedTransactions: number;
  avgRiskScore: number;
  realTimeMonitoring: boolean;
  lastScanAt: number;
}

export interface ReconciliationReport {
  id: string;
  period: string;
  totalTransactions: number;
  matchedTransactions: number;
  discrepancies: number;
  autoReconciled: number;
  manualReview: number;
  status: 'completed' | 'in_progress' | 'pending';
  generatedAt: number;
}

export interface A2APaymentProtocol {
  id: string;
  name: string;
  version: string;
  description: string;
  isEnabled: boolean;
  supportedAgents: string[];
  transactionCount: number;
}

export interface DAOGovernance {
  id: string;
  proposalTitle: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endDate: number;
  createdAt: number;
}

export interface MultiAgentPlatformStats {
  totalAgents: number;
  activeAgents: number;
  totalTransactionsToday: number;
  totalVolumeToday: string;
  avgSettlementTime: string;
  supportedCurrencies: number;
  supportedPaymentMethods: number;
  complianceLicenses: number;
  fraudRatePercent: string;
  efficiencyImprovement: string;
}
