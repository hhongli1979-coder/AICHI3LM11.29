// DefiLlama API integration
// API Documentation: https://defillama.com/docs/api

const DEFILLAMA_BASE_URL = 'https://api.llama.fi';
const COINS_BASE_URL = 'https://coins.llama.fi';

export interface Protocol {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  tvl: number;
  change_1d: number;
  change_7d: number;
  category: string;
  logo: string;
  url: string;
}

export interface Chain {
  name: string;
  tvl: number;
  tokenSymbol: string;
  cmcId: number;
}

export interface TokenPrice {
  price: number;
  symbol: string;
  timestamp: number;
  confidence: number;
}

export interface TVLHistory {
  date: number;
  tvl: number;
}

export interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  rewardTokens: string[];
  stablecoin: boolean;
}

/**
 * Get all DeFi protocols with TVL
 */
export async function getProtocols(): Promise<Protocol[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocols`);
    if (!response.ok) throw new Error('Failed to fetch protocols');
    return response.json();
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return [];
  }
}

/**
 * Get TVL for a specific protocol
 */
export async function getProtocolTVL(protocol: string): Promise<TVLHistory[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocol/${protocol}`);
    if (!response.ok) throw new Error('Failed to fetch protocol TVL');
    const data = await response.json();
    return data.tvl || [];
  } catch (error) {
    console.error('Error fetching protocol TVL:', error);
    return [];
  }
}

/**
 * Get all chains with TVL
 */
export async function getChains(): Promise<Chain[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/v2/chains`);
    if (!response.ok) throw new Error('Failed to fetch chains');
    return response.json();
  } catch (error) {
    console.error('Error fetching chains:', error);
    return [];
  }
}

/**
 * Get historical TVL of all DeFi
 */
export async function getHistoricalTVL(): Promise<TVLHistory[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/v2/historicalChainTvl`);
    if (!response.ok) throw new Error('Failed to fetch historical TVL');
    return response.json();
  } catch (error) {
    console.error('Error fetching historical TVL:', error);
    return [];
  }
}

/**
 * Get current token prices
 */
export async function getTokenPrices(tokens: string[]): Promise<Record<string, TokenPrice>> {
  try {
    const tokenString = tokens.join(',');
    const response = await fetch(`${COINS_BASE_URL}/prices/current/${tokenString}`);
    if (!response.ok) throw new Error('Failed to fetch token prices');
    const data = await response.json();
    return data.coins || {};
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}

/**
 * Get yield pools (from DefiLlama Yields)
 */
export async function getYieldPools(): Promise<YieldPool[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) throw new Error('Failed to fetch yield pools');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching yield pools:', error);
    return [];
  }
}

/**
 * Get stablecoins data
 */
export async function getStablecoins(): Promise<unknown[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/stablecoins`);
    if (!response.ok) throw new Error('Failed to fetch stablecoins');
    const data = await response.json();
    return data.peggedAssets || [];
  } catch (error) {
    console.error('Error fetching stablecoins:', error);
    return [];
  }
}

/**
 * Get DEX volumes
 */
export async function getDexVolumes(): Promise<unknown> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/dexs`);
    if (!response.ok) throw new Error('Failed to fetch DEX volumes');
    return response.json();
  } catch (error) {
    console.error('Error fetching DEX volumes:', error);
    return null;
  }
}

/**
 * Get fees/revenue data
 */
export async function getFees(): Promise<unknown> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/fees`);
    if (!response.ok) throw new Error('Failed to fetch fees');
    return response.json();
  } catch (error) {
    console.error('Error fetching fees:', error);
    return null;
  }
}

// Mock data for offline/demo mode
export const mockProtocols: Protocol[] = [
  {
    id: 'lido',
    name: 'Lido',
    symbol: 'LDO',
    chain: 'Ethereum',
    tvl: 23456789012,
    change_1d: 2.5,
    change_7d: 5.2,
    category: 'Liquid Staking',
    logo: 'https://icons.llama.fi/lido.png',
    url: 'https://lido.fi',
  },
  {
    id: 'aave-v3',
    name: 'Aave V3',
    symbol: 'AAVE',
    chain: 'Multi-Chain',
    tvl: 12345678901,
    change_1d: 1.2,
    change_7d: 3.8,
    category: 'Lending',
    logo: 'https://icons.llama.fi/aave-v3.png',
    url: 'https://aave.com',
  },
  {
    id: 'uniswap',
    name: 'Uniswap V3',
    symbol: 'UNI',
    chain: 'Multi-Chain',
    tvl: 5678901234,
    change_1d: -0.5,
    change_7d: 2.1,
    category: 'DEX',
    logo: 'https://icons.llama.fi/uniswap.png',
    url: 'https://uniswap.org',
  },
  {
    id: 'makerdao',
    name: 'MakerDAO',
    symbol: 'MKR',
    chain: 'Ethereum',
    tvl: 7890123456,
    change_1d: 0.8,
    change_7d: -1.2,
    category: 'CDP',
    logo: 'https://icons.llama.fi/makerdao.png',
    url: 'https://makerdao.com',
  },
  {
    id: 'curve-dex',
    name: 'Curve Finance',
    symbol: 'CRV',
    chain: 'Multi-Chain',
    tvl: 2345678901,
    change_1d: 1.5,
    change_7d: 4.2,
    category: 'DEX',
    logo: 'https://icons.llama.fi/curve.png',
    url: 'https://curve.fi',
  },
];

export const mockChains: Chain[] = [
  { name: 'Ethereum', tvl: 58000000000, tokenSymbol: 'ETH', cmcId: 1027 },
  { name: 'Tron', tvl: 8500000000, tokenSymbol: 'TRX', cmcId: 1958 },
  { name: 'BSC', tvl: 5200000000, tokenSymbol: 'BNB', cmcId: 1839 },
  { name: 'Arbitrum', tvl: 3800000000, tokenSymbol: 'ARB', cmcId: 11841 },
  { name: 'Polygon', tvl: 1200000000, tokenSymbol: 'MATIC', cmcId: 3890 },
  { name: 'Solana', tvl: 4500000000, tokenSymbol: 'SOL', cmcId: 5426 },
  { name: 'Avalanche', tvl: 980000000, tokenSymbol: 'AVAX', cmcId: 5805 },
  { name: 'Optimism', tvl: 850000000, tokenSymbol: 'OP', cmcId: 11840 },
];

export const mockYieldPools: YieldPool[] = [
  {
    pool: 'USDC-USDT',
    chain: 'Ethereum',
    project: 'Curve',
    symbol: 'USDC-USDT',
    tvlUsd: 500000000,
    apy: 5.2,
    apyBase: 3.5,
    apyReward: 1.7,
    rewardTokens: ['CRV'],
    stablecoin: true,
  },
  {
    pool: 'stETH',
    chain: 'Ethereum',
    project: 'Lido',
    symbol: 'stETH',
    tvlUsd: 23000000000,
    apy: 3.8,
    apyBase: 3.8,
    apyReward: 0,
    rewardTokens: [],
    stablecoin: false,
  },
  {
    pool: 'USDC',
    chain: 'Ethereum',
    project: 'Aave V3',
    symbol: 'USDC',
    tvlUsd: 2500000000,
    apy: 4.5,
    apyBase: 4.5,
    apyReward: 0,
    rewardTokens: [],
    stablecoin: true,
  },
];
