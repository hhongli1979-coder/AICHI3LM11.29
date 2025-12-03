/**
 * OmniCore Wallet - Type Definitions
 * 
 * This file contains all TypeScript type definitions for the OmniCore Wallet platform.
 * All types should be imported from this file to maintain consistency across the codebase.
 * 
 * @module types
 */

// ============================================================================
// Blockchain & Network Types
// ============================================================================

/** Supported blockchain networks */
export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism' | 'avalanche';

/** Supported payment channels for the payment gateway */
export type PaymentChannel = 'crypto' | 'stripe' | 'alipay' | 'wechat' | 'unionpay';

/** Transaction status lifecycle */
export type TransactionStatus = 'pending' | 'signed' | 'broadcasting' | 'confirmed' | 'failed' | 'expired';

/** Risk assessment levels for transactions and addresses */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/** User roles within an organization */
export type UserRole = 'owner' | 'admin' | 'signer' | 'viewer';

// ============================================================================
// Wallet Types
// ============================================================================

/** Wallet entity representing a blockchain wallet */
export interface Wallet {
  /** Unique identifier */
  id: string;
  /** User-friendly wallet name */
  name: string;
  /** Blockchain address (0x prefixed) */
  address: string;
  /** Target blockchain network */
  network: BlockchainNetwork;
  /** Wallet type: single-key or multi-signature */
  type: 'single' | 'multisig';
  /** List of signer addresses (for multisig) */
  signers?: string[];
  /** Number of signatures required (for multisig) */
  requiredSignatures?: number;
  /** Wallet balance in native token and USD */
  balance: {
    native: string;
    usd: string;
  };
  /** ERC-20/BEP-20 token balances */
  tokens: TokenBalance[];
  /** Unix timestamp of wallet creation */
  createdAt: number;
}

/** Token balance information for ERC-20/BEP-20 tokens */
export interface TokenBalance {
  /** Token symbol (e.g., USDC, USDT) */
  symbol: string;
  /** Full token name */
  name: string;
  /** Token contract address */
  address: string;
  /** Token balance as string (to preserve precision) */
  balance: string;
  /** Token decimals */
  decimals: number;
  /** Current price in USD */
  priceUsd: string;
  /** Total value in USD */
  valueUsd: string;
  /** Optional logo URL */
  logo?: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

/** Transaction entity representing a blockchain transaction */
export interface Transaction {
  /** Unique identifier */
  id: string;
  /** Source wallet ID */
  walletId: string;
  /** Sender address */
  from: string;
  /** Recipient address */
  to: string;
  /** Transaction value as string */
  value: string;
  /** Token symbol (undefined for native token transfers) */
  token?: string;
  /** Target blockchain network */
  network: BlockchainNetwork;
  /** Current transaction status */
  status: TransactionStatus;
  /** On-chain transaction hash (after broadcast) */
  hash?: string;
  /** Collected signatures for multi-sig */
  signatures: Signature[];
  /** Number of signatures required */
  requiredSignatures: number;
  /** Unix timestamp of creation */
  createdAt: number;
  /** Unix timestamp of execution (if confirmed) */
  executedAt?: number;
  /** Unix timestamp when transaction expires */
  expiresAt: number;
  /** Human-readable description */
  description?: string;
  /** AI risk assessment result */
  riskAssessment?: RiskAssessment;
}

/** Signature collected from a signer */
export interface Signature {
  /** Signer's address */
  signer: string;
  /** Cryptographic signature */
  signature: string;
  /** Unix timestamp when signed */
  signedAt: number;
}

/** AI-generated risk assessment for transactions */
export interface RiskAssessment {
  /** Overall risk level */
  level: RiskLevel;
  /** Numerical risk score (0-100) */
  score: number;
  /** Risk factors identified */
  factors: string[];
  /** Recommended actions */
  recommendations: string[];
}

// ============================================================================
// Payment Types
// ============================================================================

/** Payment request for the payment gateway */
export interface PaymentRequest {
  /** Unique identifier */
  id: string;
  /** Merchant identifier */
  merchantId: string;
  /** Payment amount */
  amount: number;
  /** Currency code (USD, CNY, etc.) */
  currency: string;
  /** Payment channel */
  channel: PaymentChannel;
  /** Payment status */
  status: 'pending' | 'completed' | 'failed' | 'expired';
  /** Payment description */
  description: string;
  /** Payment URL (for redirect-based payments) */
  paymentUrl?: string;
  /** QR code data (for scan-based payments) */
  qrCode?: string;
  /** Unix timestamp when payment expires */
  expiresAt: number;
  /** Unix timestamp of creation */
  createdAt: number;
  /** Unix timestamp of completion */
  completedAt?: number;
}

// ============================================================================
// DeFi Types
// ============================================================================

/** DeFi position representing deposited assets in protocols */
export interface DeFiPosition {
  /** Unique identifier */
  id: string;
  /** Protocol name (e.g., Aave, Lido) */
  protocol: string;
  /** Position type */
  type: 'lending' | 'staking' | 'liquidity' | 'farming';
  /** Asset or LP token name */
  asset: string;
  /** Amount deposited */
  amount: string;
  /** Current value in USD */
  valueUsd: string;
  /** Annual percentage yield */
  apy: number;
  /** Accumulated rewards */
  rewards: string;
  /** Health factor for collateralized positions */
  healthFactor?: number;
  /** Target blockchain network */
  network: BlockchainNetwork;
}

/** Dollar-Cost Averaging (DCA) strategy configuration */
export interface DCAStrategy {
  /** Unique identifier */
  id: string;
  /** Strategy name */
  name: string;
  /** Source token to sell */
  sourceToken: string;
  /** Target token to buy */
  targetToken: string;
  /** Amount per interval */
  amountPerInterval: string;
  /** Interval in hours */
  intervalHours: number;
  /** Unix timestamp of last execution */
  lastExecutedAt?: number;
  /** Unix timestamp of next execution */
  nextExecutionAt: number;
  /** Total amount invested */
  totalInvested: string;
  /** Total amount received */
  totalReceived: string;
  /** Whether strategy is active */
  enabled: boolean;
}

// ============================================================================
// Organization Types
// ============================================================================

/** Organization entity for multi-tenant management */
export interface Organization {
  /** Unique identifier */
  id: string;
  /** Organization name */
  name: string;
  /** Subscription plan */
  plan: 'starter' | 'professional' | 'enterprise';
  /** Organization members */
  members: OrganizationMember[];
  /** Associated wallet IDs */
  wallets: string[];
  /** Unix timestamp of creation */
  createdAt: number;
}

/** Organization member with role and permissions */
export interface OrganizationMember {
  /** User identifier */
  userId: string;
  /** User email address */
  email: string;
  /** Member role */
  role: UserRole;
  /** Specific permissions granted */
  permissions: string[];
  /** Unix timestamp when joined */
  joinedAt: number;
}

// ============================================================================
// OMNI Token Types
// ============================================================================

/** OMNI token statistics and user holdings */
export interface OmniTokenStats {
  /** Current token price in USD */
  price: number;
  /** Total market capitalization */
  marketCap: number;
  /** Total token supply */
  totalSupply: string;
  /** Circulating supply */
  circulatingSupply: string;
  /** Total staked amount */
  stakedAmount: string;
  /** Current staking APY */
  stakingApy: number;
  /** User's token balance */
  yourBalance: string;
  /** User's staked amount */
  yourStaked: string;
  /** User's pending rewards */
  yourRewards: string;
}

// ============================================================================
// Notification Types
// ============================================================================

/** Notification item for the notification center */
export interface NotificationItem {
  /** Unique identifier */
  id: string;
  /** Notification type */
  type: 'transaction' | 'approval' | 'payment' | 'risk' | 'system';
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Whether notification has been read */
  read: boolean;
  /** Unix timestamp of creation */
  createdAt: number;
  /** Optional action URL */
  actionUrl?: string;
}

// ============================================================================
// AI Assistant Types - Memory, NLP, and Control
// ============================================================================

/** Role of a message in the AI conversation */
export type AIMessageRole = 'user' | 'assistant' | 'system';

/** Types of actions the AI assistant can perform */
export type AIActionType = 
  | 'wallet_query'
  | 'transaction_create'
  | 'defi_manage'
  | 'payment_process'
  | 'risk_analyze'
  | 'settings_update'
  | 'general_chat';

/** Message in an AI conversation */
export interface AIMessage {
  /** Unique identifier */
  id: string;
  /** Message role */
  role: AIMessageRole;
  /** Message content (supports markdown) */
  content: string;
  /** Unix timestamp of message */
  timestamp: number;
  /** Associated action (if any) */
  action?: AIAction;
}

/** Action performed by the AI assistant */
export interface AIAction {
  /** Action type */
  type: AIActionType;
  /** Target entity (wallet ID, address, etc.) */
  target?: string;
  /** Action parameters */
  parameters?: Record<string, unknown>;
  /** Execution status */
  status: 'pending' | 'executing' | 'completed' | 'failed';
  /** Result message */
  result?: string;
}

/** Memory item learned by the AI assistant */
export interface AIMemoryItem {
  /** Unique identifier */
  id: string;
  /** Memory type */
  type: 'preference' | 'transaction_pattern' | 'contact' | 'insight';
  /** Memory key/label */
  key: string;
  /** Memory value */
  value: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Unix timestamp when learned */
  learnedAt: number;
  /** Number of times this memory was used */
  usageCount: number;
}

/** Overall AI assistant state */
export interface AIAssistantState {
  /** Whether assistant is active */
  isActive: boolean;
  /** Current conversation messages */
  currentConversation: AIMessage[];
  /** Learned memories */
  memories: AIMemoryItem[];
  /** Available capabilities */
  capabilities: AICapability[];
  /** Unix timestamp of last activity */
  lastActiveAt: number;
}

/** AI assistant capability */
export interface AICapability {
  /** Unique identifier */
  id: string;
  /** Capability name */
  name: string;
  /** Capability description */
  description: string;
  /** Icon name (Phosphor icon) */
  icon: string;
  /** Whether capability is enabled */
  enabled: boolean;
  /** Capability category */
  category: 'memory' | 'language' | 'control';
}

// ============================================================================
// Native AI Model Configuration Types - 原生态大模型配置
// ============================================================================

/** Supported AI model providers */
export type AIModelProvider = 'openai' | 'anthropic' | 'ollama' | 'custom' | 'local';

/** AI model configuration */
export interface AIModelConfig {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model provider */
  provider: AIModelProvider;
  /** Model name/ID */
  modelName: string;
  /** API endpoint URL */
  apiEndpoint: string;
  /** API key (if required) */
  apiKey?: string;
  /** Whether model is enabled */
  enabled: boolean;
  /** Whether this is the default model */
  isDefault: boolean;
  /** Maximum tokens per request */
  maxTokens: number;
  /** Sampling temperature (0-2) */
  temperature: number;
  /** System prompt for the model */
  systemPrompt: string;
  /** Unix timestamp of creation */
  createdAt: number;
  /** Unix timestamp of last update */
  updatedAt: number;
}

/** AI model settings for the platform */
export interface AIModelSettings {
  /** Configured models */
  models: AIModelConfig[];
  /** Default model ID */
  defaultModelId: string | null;
  /** Enable local processing */
  enableLocalProcessing: boolean;
  /** Enable secondary development/customization */
  enableSecondaryDevelopment: boolean;
  /** Custom API endpoints */
  customEndpoints: CustomEndpoint[];
}

/** Custom API endpoint configuration */
export interface CustomEndpoint {
  /** Unique identifier */
  id: string;
  /** Endpoint name */
  name: string;
  /** Endpoint URL */
  url: string;
  /** Custom headers */
  headers: Record<string, string>;
  /** Whether endpoint is enabled */
  enabled: boolean;
}

// ============================================================================
// Fiat24 Bank Payment Types - 银行支付集成
// ============================================================================

/** Fiat24 bank information from IBAN validation */
export interface Fiat24BankInfo {
  /** Bank name */
  name: string;
  /** Primary bank code */
  bankCode: string;
  /** Array of all bank codes */
  bankCodes: string[];
  /** BIC/SWIFT code */
  bic: string;
  /** Country code (ISO-2) */
  country: string;
  /** Account mask for display */
  accountMask: string;
  /** Account placeholder for input */
  accountPlaceholder: string;
  /** Account notice/instructions */
  accountNotice: string;
}

/** Fiat24 bank validation error */
export interface Fiat24BankError {
  /** Error message */
  error: string;
}

/** Payment purpose option from Fiat24 API */
export interface PaymentPurpose {
  /** Purpose ID value */
  value: number;
  /** Purpose description */
  name: string;
}

/** Payment purposes response from Fiat24 API */
export interface PaymentPurposesResponse {
  /** Array of payment purposes */
  purposes: PaymentPurpose[];
}

/** Country with cities for recipient address */
export interface CountryWithCities {
  /** Country name */
  name: string;
  /** ISO-3 country code */
  iso3: string;
  /** Regular expression for postal code validation */
  postalCodeRegEx: string;
  /** Array of city names */
  cities: string[];
}

/** Country/cities API response */
export interface CountryCitiesResponse {
  /** Last update timestamp */
  lastUpdateAt: number;
  /** Countries mapped by ISO-3 code */
  countries: Record<string, CountryWithCities>;
}

/** Creditor/recipient information for bank payment */
export interface BankPaymentCreditor {
  /** Recipient name */
  name: string;
  /** Street address */
  street: string;
  /** City name (from /country-cities API) */
  city: string;
  /** Postal/ZIP code */
  zip: string;
  /** Country ISO-3 code */
  country: string;
}

/** Bank payment request structure */
export interface BankPaymentRequest {
  /** IBAN account number */
  account: string;
  /** Bank name (from /banks API) */
  bankName: string;
  /** BIC/SWIFT code (from /banks API) */
  bic: string;
  /** Payment purpose ID (from /payment-purposes API) */
  purpose: number;
  /** Optional reference/memo */
  reference?: string;
  /** Creditor info - "BR" for same owner or full creditor object */
  creditor: 'BR' | BankPaymentCreditor;
}

/** Bank payment verification response */
export interface BankPaymentVerifyResponse {
  /** Contact ID for smart contract call */
  contactId: string;
  /** Purpose ID for smart contract call */
  purposeId: number;
  /** Reference for smart contract call */
  ref: string;
}

/** Fiat24 IBAN calculation result */
export interface Fiat24IBAN {
  /** Calculated IBAN */
  iban: string;
}

/** Fiat24 eligible countries response */
export interface Fiat24CountriesResponse {
  /** Eligible domiciles for account registration */
  eligibleDomiciles: string[];
  /** Eligible domiciles for card issuance */
  eligibleDomicilesForCards: string[];
  /** Blacklisted nationalities */
  blacklistNationalities: string[];
}

/** Fiat24 FX rate */
export interface Fiat24FXRate {
  /** Interbank rate */
  rate: number;
  /** Bid rate */
  bid: number;
  /** Ask rate */
  ask: number;
  /** Last update timestamp */
  lastUpdateAt: number;
}

/** Fiat24 FX rates response */
export interface Fiat24RatesResponse {
  /** Rates mapped by currency pair (e.g., "USDCHF") */
  [pair: string]: Fiat24FXRate;
}

/** Fiat24 KYC status */
export type Fiat24KYCStatus = 
  | 'NOT_INIT'
  | 'CA_COMPLETED_PENDING_SCAN'
  | 'PROCESSING_SCAN'
  | 'PENDING_ACTION'
  | 'COMPLETED'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'INTERNAL_ERROR';

/** Fiat24 email availability check response */
export interface Fiat24EmailAvailability {
  /** HTTP status */
  status: number;
  /** Availability data */
  data: {
    /** Whether email is already registered */
    email: boolean;
    /** Whether email is registered for cards (optional) */
    cardEmail?: boolean;
  };
}

/** Bank payment status */
export type BankPaymentStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

/** Bank payment record */
export interface BankPayment {
  /** Unique identifier */
  id: string;
  /** IBAN account */
  account: string;
  /** Bank name */
  bankName: string;
  /** BIC code */
  bic: string;
  /** Payment amount */
  amount: string;
  /** Currency (EUR or CHF) */
  currency: 'EUR' | 'CHF';
  /** Payment purpose ID */
  purposeId: number;
  /** Payment purpose name */
  purposeName: string;
  /** Optional reference */
  reference?: string;
  /** Creditor information */
  creditor: 'BR' | BankPaymentCreditor;
  /** Payment status */
  status: BankPaymentStatus;
  /** Transaction hash (after smart contract call) */
  txHash?: string;
  /** Created timestamp */
  createdAt: number;
  /** Executed timestamp */
  executedAt?: number;
}
