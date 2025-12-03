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

// ============================================
// DefiLlama Dimension Adapters Integration
// https://github.com/DefiLlama/dimension-adapters
// ============================================

export interface DimensionData {
  total24h: number;
  total7d: number;
  total30d: number;
  totalAllTime: number;
  change_1d: number;
  change_7d: number;
  change_1m: number;
}

export interface ProtocolDimension {
  name: string;
  displayName: string;
  module: string;
  category: string;
  logo: string;
  chains: string[];
  volume24h?: number;
  fees24h?: number;
  revenue24h?: number;
  change_1d?: number;
}

export interface ChainDimension {
  chain: string;
  total24h: number;
  total7d: number;
  change_1d: number;
  protocols: number;
}

/**
 * Get DEX trading volumes (dimension-adapters/dexs)
 */
export async function getDexVolumes24h(): Promise<{ protocols: ProtocolDimension[]; total: DimensionData }> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`);
    if (!response.ok) throw new Error('Failed to fetch DEX volumes');
    const data = await response.json();
    return {
      protocols: data.protocols || [],
      total: {
        total24h: data.total24h || 0,
        total7d: data.total7d || 0,
        total30d: data.total30d || 0,
        totalAllTime: data.totalAllTime || 0,
        change_1d: data.change_1d || 0,
        change_7d: data.change_7d || 0,
        change_1m: data.change_1m || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching DEX volumes:', error);
    return { protocols: mockDexVolumes, total: mockDimensionTotal };
  }
}

/**
 * Get protocol fees (dimension-adapters/fees)
 */
export async function getProtocolFees(): Promise<{ protocols: ProtocolDimension[]; total: DimensionData }> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`);
    if (!response.ok) throw new Error('Failed to fetch fees');
    const data = await response.json();
    return {
      protocols: data.protocols || [],
      total: {
        total24h: data.total24h || 0,
        total7d: data.total7d || 0,
        total30d: data.total30d || 0,
        totalAllTime: data.totalAllTime || 0,
        change_1d: data.change_1d || 0,
        change_7d: data.change_7d || 0,
        change_1m: data.change_1m || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching fees:', error);
    return { protocols: mockFeesData, total: mockDimensionTotal };
  }
}

/**
 * Get derivatives volumes (dimension-adapters/derivatives)
 */
export async function getDerivativesVolumes(): Promise<{ protocols: ProtocolDimension[]; total: DimensionData }> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/derivatives?excludeTotalDataChart=true`);
    if (!response.ok) throw new Error('Failed to fetch derivatives');
    const data = await response.json();
    return {
      protocols: data.protocols || [],
      total: {
        total24h: data.total24h || 0,
        total7d: data.total7d || 0,
        total30d: data.total30d || 0,
        totalAllTime: data.totalAllTime || 0,
        change_1d: data.change_1d || 0,
        change_7d: data.change_7d || 0,
        change_1m: data.change_1m || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching derivatives:', error);
    return { protocols: mockDerivativesData, total: mockDimensionTotal };
  }
}

/**
 * Get options volumes (dimension-adapters/options)
 */
export async function getOptionsVolumes(): Promise<{ protocols: ProtocolDimension[]; total: DimensionData }> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/options?excludeTotalDataChart=true`);
    if (!response.ok) throw new Error('Failed to fetch options');
    const data = await response.json();
    return {
      protocols: data.protocols || [],
      total: {
        total24h: data.total24h || 0,
        total7d: data.total7d || 0,
        total30d: data.total30d || 0,
        totalAllTime: data.totalAllTime || 0,
        change_1d: data.change_1d || 0,
        change_7d: data.change_7d || 0,
        change_1m: data.change_1m || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching options:', error);
    return { protocols: [], total: mockDimensionTotal };
  }
}

/**
 * Get aggregators volumes (dimension-adapters/aggregators)
 */
export async function getAggregatorsVolumes(): Promise<{ protocols: ProtocolDimension[]; total: DimensionData }> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/aggregators?excludeTotalDataChart=true`);
    if (!response.ok) throw new Error('Failed to fetch aggregators');
    const data = await response.json();
    return {
      protocols: data.protocols || [],
      total: {
        total24h: data.total24h || 0,
        total7d: data.total7d || 0,
        total30d: data.total30d || 0,
        totalAllTime: data.totalAllTime || 0,
        change_1d: data.change_1d || 0,
        change_7d: data.change_7d || 0,
        change_1m: data.change_1m || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching aggregators:', error);
    return { protocols: mockAggregatorsData, total: mockDimensionTotal };
  }
}

/**
 * Get bridge volumes (dimension-adapters/bridges)
 */
export async function getBridgeVolumes(): Promise<{ protocols: ProtocolDimension[]; total: DimensionData }> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/bridges?excludeTotalDataChart=true`);
    if (!response.ok) throw new Error('Failed to fetch bridges');
    const data = await response.json();
    return {
      protocols: data.protocols || [],
      total: {
        total24h: data.total24h || 0,
        total7d: data.total7d || 0,
        total30d: data.total30d || 0,
        totalAllTime: data.totalAllTime || 0,
        change_1d: data.change_1d || 0,
        change_7d: data.change_7d || 0,
        change_1m: data.change_1m || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching bridges:', error);
    return { protocols: mockBridgesData, total: mockDimensionTotal };
  }
}

/**
 * Get chain-specific dimension data
 */
export async function getChainDimensions(dimension: 'dexs' | 'fees' | 'derivatives'): Promise<ChainDimension[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/overview/${dimension}?excludeTotalDataChart=true`);
    if (!response.ok) throw new Error(`Failed to fetch ${dimension} by chain`);
    const data = await response.json();
    
    // Extract chain data
    const chainMap = new Map<string, ChainDimension>();
    for (const protocol of data.protocols || []) {
      for (const chain of protocol.chains || []) {
        if (!chainMap.has(chain)) {
          chainMap.set(chain, {
            chain,
            total24h: 0,
            total7d: 0,
            change_1d: 0,
            protocols: 0
          });
        }
        const existing = chainMap.get(chain)!;
        existing.protocols += 1;
        existing.total24h += protocol.total24h || 0;
        existing.total7d += protocol.total7d || 0;
      }
    }
    
    return Array.from(chainMap.values()).sort((a, b) => b.total24h - a.total24h);
  } catch (error) {
    console.error(`Error fetching ${dimension} by chain:`, error);
    return [];
  }
}

// Mock data for dimension adapters
const mockDimensionTotal: DimensionData = {
  total24h: 5234567890,
  total7d: 38456789012,
  total30d: 156789012345,
  totalAllTime: 12345678901234,
  change_1d: 5.2,
  change_7d: 12.5,
  change_1m: 25.8,
};

const mockDexVolumes: ProtocolDimension[] = [
  {
    name: 'uniswap',
    displayName: 'Uniswap',
    module: 'uniswap',
    category: 'DEX',
    logo: 'https://icons.llama.fi/uniswap.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism', 'Base'],
    volume24h: 1234567890,
    change_1d: 5.2,
  },
  {
    name: 'pancakeswap',
    displayName: 'PancakeSwap',
    module: 'pancakeswap',
    category: 'DEX',
    logo: 'https://icons.llama.fi/pancakeswap.png',
    chains: ['BSC', 'Ethereum', 'Arbitrum'],
    volume24h: 876543210,
    change_1d: -2.1,
  },
  {
    name: 'curve',
    displayName: 'Curve Finance',
    module: 'curve',
    category: 'DEX',
    logo: 'https://icons.llama.fi/curve.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Avalanche'],
    volume24h: 456789012,
    change_1d: 8.5,
  },
  {
    name: 'sushiswap',
    displayName: 'SushiSwap',
    module: 'sushiswap',
    category: 'DEX',
    logo: 'https://icons.llama.fi/sushi.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon'],
    volume24h: 234567890,
    change_1d: 3.2,
  },
];

const mockFeesData: ProtocolDimension[] = [
  {
    name: 'ethereum',
    displayName: 'Ethereum',
    module: 'ethereum',
    category: 'Chain',
    logo: 'https://icons.llama.fi/ethereum.png',
    chains: ['Ethereum'],
    fees24h: 12345678,
    revenue24h: 10234567,
    change_1d: 15.2,
  },
  {
    name: 'lido',
    displayName: 'Lido Finance',
    module: 'lido',
    category: 'Liquid Staking',
    logo: 'https://icons.llama.fi/lido.png',
    chains: ['Ethereum'],
    fees24h: 2345678,
    revenue24h: 234567,
    change_1d: 8.5,
  },
  {
    name: 'uniswap',
    displayName: 'Uniswap',
    module: 'uniswap',
    category: 'DEX',
    logo: 'https://icons.llama.fi/uniswap.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon'],
    fees24h: 1876543,
    revenue24h: 0,
    change_1d: 5.2,
  },
  {
    name: 'aave',
    displayName: 'Aave',
    module: 'aave',
    category: 'Lending',
    logo: 'https://icons.llama.fi/aave-v3.png',
    chains: ['Ethereum', 'Polygon', 'Arbitrum'],
    fees24h: 987654,
    revenue24h: 345678,
    change_1d: -2.1,
  },
];

const mockDerivativesData: ProtocolDimension[] = [
  {
    name: 'gmx',
    displayName: 'GMX',
    module: 'gmx',
    category: 'Derivatives',
    logo: 'https://icons.llama.fi/gmx.png',
    chains: ['Arbitrum', 'Avalanche'],
    volume24h: 567890123,
    fees24h: 1234567,
    change_1d: 12.5,
  },
  {
    name: 'dydx',
    displayName: 'dYdX',
    module: 'dydx',
    category: 'Derivatives',
    logo: 'https://icons.llama.fi/dydx.png',
    chains: ['dYdX'],
    volume24h: 456789012,
    fees24h: 987654,
    change_1d: -5.2,
  },
  {
    name: 'hyperliquid',
    displayName: 'Hyperliquid',
    module: 'hyperliquid',
    category: 'Derivatives',
    logo: 'https://icons.llama.fi/hyperliquid.png',
    chains: ['Hyperliquid'],
    volume24h: 345678901,
    fees24h: 876543,
    change_1d: 25.8,
  },
];

const mockAggregatorsData: ProtocolDimension[] = [
  {
    name: '1inch',
    displayName: '1inch',
    module: '1inch',
    category: 'Aggregator',
    logo: 'https://icons.llama.fi/1inch-network.png',
    chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum'],
    volume24h: 234567890,
    change_1d: 8.5,
  },
  {
    name: 'paraswap',
    displayName: 'ParaSwap',
    module: 'paraswap',
    category: 'Aggregator',
    logo: 'https://icons.llama.fi/paraswap.png',
    chains: ['Ethereum', 'Polygon', 'Arbitrum'],
    volume24h: 123456789,
    change_1d: 3.2,
  },
  {
    name: 'cowswap',
    displayName: 'CoW Swap',
    module: 'cowswap',
    category: 'Aggregator',
    logo: 'https://icons.llama.fi/cow-swap.png',
    chains: ['Ethereum', 'Gnosis'],
    volume24h: 98765432,
    change_1d: 15.2,
  },
];

const mockBridgesData: ProtocolDimension[] = [
  {
    name: 'stargate',
    displayName: 'Stargate',
    module: 'stargate',
    category: 'Bridge',
    logo: 'https://icons.llama.fi/stargate.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon', 'BSC', 'Avalanche', 'Optimism'],
    volume24h: 123456789,
    change_1d: 5.2,
  },
  {
    name: 'across',
    displayName: 'Across',
    module: 'across',
    category: 'Bridge',
    logo: 'https://icons.llama.fi/across.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism'],
    volume24h: 87654321,
    change_1d: 12.5,
  },
  {
    name: 'hop',
    displayName: 'Hop Protocol',
    module: 'hop',
    category: 'Bridge',
    logo: 'https://icons.llama.fi/hop-protocol.png',
    chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism'],
    volume24h: 56789012,
    change_1d: -2.1,
  },
];

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

// ============================================
// DefiLlama-Adapters Integration
// https://github.com/DefiLlama/DefiLlama-Adapters
// ============================================

export interface AdapterProtocol {
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string | null;
  forkedFrom: string[];
  oracles: string[];
  listedAt: number;
  methodology: string;
  tvl: number;
  chainTvls: Record<string, number>;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  mcap: number | null;
}

export interface AdapterTVLBreakdown {
  [key: string]: {
    [token: string]: number;
  };
}

/**
 * Get all protocols with full adapter data
 * This mirrors the data from DefiLlama-Adapters
 */
export async function getAdapterProtocols(): Promise<AdapterProtocol[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocols`);
    if (!response.ok) throw new Error('Failed to fetch adapter protocols');
    return response.json();
  } catch (error) {
    console.error('Error fetching adapter protocols:', error);
    return mockAdapterProtocols;
  }
}

/**
 * Get protocol TVL breakdown by chain and token
 */
export async function getProtocolTVLBreakdown(protocol: string): Promise<AdapterTVLBreakdown | null> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocol/${protocol}`);
    if (!response.ok) throw new Error('Failed to fetch protocol breakdown');
    const data = await response.json();
    return data.currentChainTvls || null;
  } catch (error) {
    console.error('Error fetching protocol breakdown:', error);
    return null;
  }
}

/**
 * Get TVL by category
 */
export async function getTVLByCategory(): Promise<Record<string, number>> {
  try {
    const protocols = await getAdapterProtocols();
    const categoryTvl: Record<string, number> = {};
    
    for (const protocol of protocols) {
      const category = protocol.category || 'Other';
      categoryTvl[category] = (categoryTvl[category] || 0) + (protocol.tvl || 0);
    }
    
    return categoryTvl;
  } catch (error) {
    console.error('Error calculating TVL by category:', error);
    return mockCategoryTVL;
  }
}

/**
 * Get TVL by chain
 */
export async function getTVLByChain(): Promise<Record<string, number>> {
  try {
    const chains = await getChains();
    const chainTvl: Record<string, number> = {};
    
    for (const chain of chains) {
      chainTvl[chain.name] = chain.tvl;
    }
    
    return chainTvl;
  } catch (error) {
    console.error('Error fetching TVL by chain:', error);
    return mockChainTVL;
  }
}

/**
 * Get top protocols by TVL
 */
export async function getTopProtocolsByTVL(limit: number = 20): Promise<AdapterProtocol[]> {
  try {
    const protocols = await getAdapterProtocols();
    return protocols
      .filter(p => p.tvl > 0)
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top protocols:', error);
    return mockAdapterProtocols;
  }
}

/**
 * Get protocols by category
 */
export async function getProtocolsByCategory(category: string): Promise<AdapterProtocol[]> {
  try {
    const protocols = await getAdapterProtocols();
    return protocols.filter(p => p.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching protocols by category:', error);
    return [];
  }
}

/**
 * Get protocols by chain
 */
export async function getProtocolsByChain(chain: string): Promise<AdapterProtocol[]> {
  try {
    const protocols = await getAdapterProtocols();
    return protocols.filter(p => p.chains.includes(chain));
  } catch (error) {
    console.error('Error fetching protocols by chain:', error);
    return [];
  }
}

/**
 * Search protocols
 */
export async function searchProtocols(query: string): Promise<AdapterProtocol[]> {
  try {
    const protocols = await getAdapterProtocols();
    const lowerQuery = query.toLowerCase();
    return protocols.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.symbol.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching protocols:', error);
    return [];
  }
}

// Mock data for DefiLlama-Adapters
const mockAdapterProtocols: AdapterProtocol[] = [
  {
    id: 'lido',
    name: 'Lido',
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    symbol: 'LDO',
    url: 'https://lido.fi',
    description: 'Liquid staking for Ethereum',
    chain: 'Ethereum',
    logo: 'https://icons.llama.fi/lido.png',
    audits: '2',
    audit_note: null,
    gecko_id: 'lido-dao',
    cmcId: '8000',
    category: 'Liquid Staking',
    chains: ['Ethereum', 'Polygon', 'Solana'],
    module: 'lido/index.js',
    twitter: 'LidoFinance',
    forkedFrom: [],
    oracles: ['Chainlink'],
    listedAt: 1608250047,
    methodology: 'Staked ETH value',
    tvl: 23456789012,
    chainTvls: { Ethereum: 22000000000, Polygon: 1000000000, Solana: 456789012 },
    change_1h: 0.1,
    change_1d: 2.5,
    change_7d: 5.2,
    mcap: 2500000000,
  },
  {
    id: 'aave-v3',
    name: 'Aave V3',
    address: null,
    symbol: 'AAVE',
    url: 'https://aave.com',
    description: 'Open source liquidity protocol',
    chain: 'Multi-Chain',
    logo: 'https://icons.llama.fi/aave-v3.png',
    audits: '2',
    audit_note: null,
    gecko_id: 'aave',
    cmcId: '7278',
    category: 'Lending',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'Base'],
    module: 'aave/index.js',
    twitter: 'AaveAave',
    forkedFrom: [],
    oracles: ['Chainlink'],
    listedAt: 1578250047,
    methodology: 'Total deposits minus borrows',
    tvl: 12345678901,
    chainTvls: { Ethereum: 8000000000, Polygon: 2000000000, Arbitrum: 1500000000, Optimism: 500000000, Avalanche: 245678901, Base: 100000000 },
    change_1h: 0.05,
    change_1d: 1.2,
    change_7d: 3.8,
    mcap: 1800000000,
  },
  {
    id: 'uniswap',
    name: 'Uniswap V3',
    address: null,
    symbol: 'UNI',
    url: 'https://uniswap.org',
    description: 'Decentralized trading protocol',
    chain: 'Multi-Chain',
    logo: 'https://icons.llama.fi/uniswap.png',
    audits: '2',
    audit_note: null,
    gecko_id: 'uniswap',
    cmcId: '7083',
    category: 'Dexes',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'BSC'],
    module: 'uniswap/index.js',
    twitter: 'Uniswap',
    forkedFrom: [],
    oracles: [],
    listedAt: 1568250047,
    methodology: 'Liquidity in pools',
    tvl: 5678901234,
    chainTvls: { Ethereum: 3500000000, Polygon: 800000000, Arbitrum: 700000000, Optimism: 400000000, Base: 200000000, BSC: 78901234 },
    change_1h: -0.1,
    change_1d: -0.5,
    change_7d: 2.1,
    mcap: 4500000000,
  },
  {
    id: 'makerdao',
    name: 'MakerDAO',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    symbol: 'MKR',
    url: 'https://makerdao.com',
    description: 'Decentralized credit platform',
    chain: 'Ethereum',
    logo: 'https://icons.llama.fi/makerdao.png',
    audits: '2',
    audit_note: null,
    gecko_id: 'maker',
    cmcId: '1518',
    category: 'CDP',
    chains: ['Ethereum'],
    module: 'maker/index.js',
    twitter: 'MakerDAO',
    forkedFrom: [],
    oracles: ['Chainlink', 'Maker'],
    listedAt: 1548250047,
    methodology: 'Collateral in vaults',
    tvl: 7890123456,
    chainTvls: { Ethereum: 7890123456 },
    change_1h: 0.02,
    change_1d: 0.8,
    change_7d: -1.2,
    mcap: 1200000000,
  },
  {
    id: 'eigenlayer',
    name: 'EigenLayer',
    address: null,
    symbol: 'EIGEN',
    url: 'https://eigenlayer.xyz',
    description: 'Restaking protocol',
    chain: 'Ethereum',
    logo: 'https://icons.llama.fi/eigenlayer.png',
    audits: '2',
    audit_note: null,
    gecko_id: 'eigenlayer',
    cmcId: null,
    category: 'Restaking',
    chains: ['Ethereum'],
    module: 'eigenlayer/index.js',
    twitter: 'eigenlayer',
    forkedFrom: [],
    oracles: [],
    listedAt: 1678250047,
    methodology: 'Restaked assets',
    tvl: 15678901234,
    chainTvls: { Ethereum: 15678901234 },
    change_1h: 0.5,
    change_1d: 3.2,
    change_7d: 8.5,
    mcap: null,
  },
];

const mockCategoryTVL: Record<string, number> = {
  'Liquid Staking': 35000000000,
  'Lending': 25000000000,
  'Dexes': 18000000000,
  'CDP': 12000000000,
  'Restaking': 15000000000,
  'Yield': 8000000000,
  'Bridge': 5000000000,
  'Derivatives': 4000000000,
};

const mockChainTVL: Record<string, number> = {
  'Ethereum': 58000000000,
  'Tron': 8500000000,
  'BSC': 5200000000,
  'Arbitrum': 3800000000,
  'Solana': 4500000000,
  'Polygon': 1200000000,
  'Avalanche': 980000000,
  'Optimism': 850000000,
  'Base': 650000000,
};

// ============================================
// DefiLlama Yield Server Integration
// https://github.com/DefiLlama/yield-server
// ============================================

export interface YieldPoolFull {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  rewardTokens: string[] | null;
  underlyingTokens: string[] | null;
  poolMeta: string | null;
  il7d: number | null;
  apyBase7d: number | null;
  apyMean30d: number | null;
  volumeUsd1d: number | null;
  volumeUsd7d: number | null;
  apyBaseInception: number | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  predictedClass: string | null;
  predictedProbability: number | null;
  binnedConfidence: number | null;
}

export interface YieldProject {
  name: string;
  slug: string;
  chains: string[];
  poolCount: number;
  totalTvlUsd: number;
  avgApy: number;
}

export interface YieldChainStats {
  chain: string;
  poolCount: number;
  totalTvlUsd: number;
  avgApy: number;
  topProjects: string[];
}

/**
 * Get all yield pools from yield-server
 */
export async function getAllYieldPools(): Promise<YieldPoolFull[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) throw new Error('Failed to fetch yield pools');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching yield pools:', error);
    return mockYieldPoolsFull;
  }
}

/**
 * Get yield pool by ID
 */
export async function getYieldPool(poolId: string): Promise<YieldPoolFull | null> {
  try {
    const pools = await getAllYieldPools();
    return pools.find(p => p.pool === poolId) || null;
  } catch (error) {
    console.error('Error fetching yield pool:', error);
    return null;
  }
}

/**
 * Get top yield pools by APY
 */
export async function getTopYieldPoolsByApy(limit: number = 20, minTvl: number = 1000000): Promise<YieldPoolFull[]> {
  try {
    const pools = await getAllYieldPools();
    return pools
      .filter(p => p.tvlUsd >= minTvl && p.apy > 0 && p.apy < 1000) // Filter out unrealistic APYs
      .sort((a, b) => b.apy - a.apy)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top yield pools:', error);
    return mockYieldPoolsFull;
  }
}

/**
 * Get yield pools by chain
 */
export async function getYieldPoolsByChain(chain: string): Promise<YieldPoolFull[]> {
  try {
    const pools = await getAllYieldPools();
    return pools.filter(p => p.chain.toLowerCase() === chain.toLowerCase());
  } catch (error) {
    console.error('Error fetching yield pools by chain:', error);
    return [];
  }
}

/**
 * Get yield pools by project
 */
export async function getYieldPoolsByProject(project: string): Promise<YieldPoolFull[]> {
  try {
    const pools = await getAllYieldPools();
    return pools.filter(p => p.project.toLowerCase() === project.toLowerCase());
  } catch (error) {
    console.error('Error fetching yield pools by project:', error);
    return [];
  }
}

/**
 * Get stablecoin yield pools
 */
export async function getStablecoinYieldPools(minTvl: number = 1000000): Promise<YieldPoolFull[]> {
  try {
    const pools = await getAllYieldPools();
    return pools
      .filter(p => p.stablecoin && p.tvlUsd >= minTvl)
      .sort((a, b) => b.apy - a.apy);
  } catch (error) {
    console.error('Error fetching stablecoin yield pools:', error);
    return [];
  }
}

/**
 * Get yield projects summary
 */
export async function getYieldProjects(): Promise<YieldProject[]> {
  try {
    const pools = await getAllYieldPools();
    const projectMap = new Map<string, YieldProject>();
    
    for (const pool of pools) {
      const existing = projectMap.get(pool.project);
      if (existing) {
        existing.poolCount++;
        existing.totalTvlUsd += pool.tvlUsd;
        existing.avgApy = (existing.avgApy * (existing.poolCount - 1) + pool.apy) / existing.poolCount;
        if (!existing.chains.includes(pool.chain)) {
          existing.chains.push(pool.chain);
        }
      } else {
        projectMap.set(pool.project, {
          name: pool.project,
          slug: pool.project.toLowerCase().replace(/\s+/g, '-'),
          chains: [pool.chain],
          poolCount: 1,
          totalTvlUsd: pool.tvlUsd,
          avgApy: pool.apy,
        });
      }
    }
    
    return Array.from(projectMap.values())
      .sort((a, b) => b.totalTvlUsd - a.totalTvlUsd);
  } catch (error) {
    console.error('Error fetching yield projects:', error);
    return mockYieldProjects;
  }
}

/**
 * Get yield stats by chain
 */
export async function getYieldStatsByChain(): Promise<YieldChainStats[]> {
  try {
    const pools = await getAllYieldPools();
    const chainMap = new Map<string, YieldChainStats>();
    
    for (const pool of pools) {
      const existing = chainMap.get(pool.chain);
      if (existing) {
        existing.poolCount++;
        existing.totalTvlUsd += pool.tvlUsd;
        existing.avgApy = (existing.avgApy * (existing.poolCount - 1) + pool.apy) / existing.poolCount;
        if (!existing.topProjects.includes(pool.project) && existing.topProjects.length < 5) {
          existing.topProjects.push(pool.project);
        }
      } else {
        chainMap.set(pool.chain, {
          chain: pool.chain,
          poolCount: 1,
          totalTvlUsd: pool.tvlUsd,
          avgApy: pool.apy,
          topProjects: [pool.project],
        });
      }
    }
    
    return Array.from(chainMap.values())
      .sort((a, b) => b.totalTvlUsd - a.totalTvlUsd);
  } catch (error) {
    console.error('Error fetching yield stats by chain:', error);
    return mockYieldChainStats;
  }
}

/**
 * Search yield pools
 */
export async function searchYieldPools(query: string, minTvl: number = 100000): Promise<YieldPoolFull[]> {
  try {
    const pools = await getAllYieldPools();
    const lowerQuery = query.toLowerCase();
    return pools
      .filter(p => 
        p.tvlUsd >= minTvl &&
        (p.symbol.toLowerCase().includes(lowerQuery) ||
         p.project.toLowerCase().includes(lowerQuery) ||
         p.chain.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.tvlUsd - a.tvlUsd);
  } catch (error) {
    console.error('Error searching yield pools:', error);
    return [];
  }
}

/**
 * Get recommended yield strategies
 */
export async function getRecommendedYieldStrategies(
  riskLevel: 'low' | 'medium' | 'high',
  minTvl: number = 10000000
): Promise<YieldPoolFull[]> {
  try {
    const pools = await getAllYieldPools();
    
    let filtered: YieldPoolFull[];
    switch (riskLevel) {
      case 'low':
        // Stablecoins with high TVL
        filtered = pools.filter(p => 
          p.stablecoin && 
          p.tvlUsd >= minTvl * 5 && 
          p.apy > 0 && 
          p.apy < 20
        );
        break;
      case 'medium':
        // Blue chip tokens with decent APY
        filtered = pools.filter(p => 
          p.tvlUsd >= minTvl && 
          p.apy >= 5 && 
          p.apy < 50 &&
          (p.ilRisk === 'no' || p.ilRisk === 'low')
        );
        break;
      case 'high':
        // Higher APY pools
        filtered = pools.filter(p => 
          p.tvlUsd >= minTvl / 2 && 
          p.apy >= 20 && 
          p.apy < 500
        );
        break;
    }
    
    return filtered.sort((a, b) => b.apy - a.apy).slice(0, 10);
  } catch (error) {
    console.error('Error getting recommended strategies:', error);
    return [];
  }
}

// Mock data for yield-server
const mockYieldPoolsFull: YieldPoolFull[] = [
  {
    pool: 'aave-v3-usdc-ethereum',
    chain: 'Ethereum',
    project: 'aave-v3',
    symbol: 'USDC',
    tvlUsd: 2500000000,
    apyBase: 4.5,
    apyReward: null,
    apy: 4.5,
    rewardTokens: null,
    underlyingTokens: ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'],
    poolMeta: null,
    il7d: null,
    apyBase7d: 4.3,
    apyMean30d: 4.2,
    volumeUsd1d: null,
    volumeUsd7d: null,
    apyBaseInception: null,
    stablecoin: true,
    ilRisk: 'no',
    exposure: 'single',
    predictedClass: 'stable',
    predictedProbability: 0.95,
    binnedConfidence: 4,
  },
  {
    pool: 'lido-steth-ethereum',
    chain: 'Ethereum',
    project: 'lido',
    symbol: 'stETH',
    tvlUsd: 23000000000,
    apyBase: 3.8,
    apyReward: null,
    apy: 3.8,
    rewardTokens: null,
    underlyingTokens: ['0xae7ab96520de3a18e5e111b5eaab095312d7fe84'],
    poolMeta: 'Liquid Staking',
    il7d: null,
    apyBase7d: 3.7,
    apyMean30d: 3.6,
    volumeUsd1d: null,
    volumeUsd7d: null,
    apyBaseInception: null,
    stablecoin: false,
    ilRisk: 'no',
    exposure: 'single',
    predictedClass: 'stable',
    predictedProbability: 0.92,
    binnedConfidence: 4,
  },
  {
    pool: 'curve-3pool-ethereum',
    chain: 'Ethereum',
    project: 'curve-dex',
    symbol: 'DAI-USDC-USDT',
    tvlUsd: 500000000,
    apyBase: 2.5,
    apyReward: 3.2,
    apy: 5.7,
    rewardTokens: ['0xD533a949740bb3306d119CC777fa900bA034cd52'],
    underlyingTokens: ['0x6b175474e89094c44da98b954eedeac495271d0f', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xdac17f958d2ee523a2206206994597c13d831ec7'],
    poolMeta: '3Pool',
    il7d: 0.01,
    apyBase7d: 2.4,
    apyMean30d: 5.5,
    volumeUsd1d: 50000000,
    volumeUsd7d: 350000000,
    apyBaseInception: null,
    stablecoin: true,
    ilRisk: 'low',
    exposure: 'multi',
    predictedClass: 'stable',
    predictedProbability: 0.88,
    binnedConfidence: 3,
  },
  {
    pool: 'gmx-glp-arbitrum',
    chain: 'Arbitrum',
    project: 'gmx',
    symbol: 'GLP',
    tvlUsd: 450000000,
    apyBase: 15.5,
    apyReward: 8.2,
    apy: 23.7,
    rewardTokens: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a'],
    underlyingTokens: null,
    poolMeta: 'GLP Index',
    il7d: 0.5,
    apyBase7d: 14.8,
    apyMean30d: 22.5,
    volumeUsd1d: 200000000,
    volumeUsd7d: 1400000000,
    apyBaseInception: null,
    stablecoin: false,
    ilRisk: 'medium',
    exposure: 'multi',
    predictedClass: 'volatile',
    predictedProbability: 0.75,
    binnedConfidence: 2,
  },
  {
    pool: 'pendle-eeth-ethereum',
    chain: 'Ethereum',
    project: 'pendle',
    symbol: 'PT-eETH',
    tvlUsd: 800000000,
    apyBase: 12.5,
    apyReward: 5.5,
    apy: 18.0,
    rewardTokens: ['0x808507121b80c02388fad14726482e061b8da827'],
    underlyingTokens: ['0x35fa164735182de50811e8e2e824cfb9b6118ac2'],
    poolMeta: 'Fixed Yield',
    il7d: null,
    apyBase7d: 12.2,
    apyMean30d: 17.5,
    volumeUsd1d: 25000000,
    volumeUsd7d: 175000000,
    apyBaseInception: null,
    stablecoin: false,
    ilRisk: 'low',
    exposure: 'single',
    predictedClass: 'stable',
    predictedProbability: 0.82,
    binnedConfidence: 3,
  },
];

const mockYieldProjects: YieldProject[] = [
  { name: 'Lido', slug: 'lido', chains: ['Ethereum', 'Polygon'], poolCount: 5, totalTvlUsd: 25000000000, avgApy: 3.8 },
  { name: 'Aave V3', slug: 'aave-v3', chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'], poolCount: 45, totalTvlUsd: 12000000000, avgApy: 4.2 },
  { name: 'Curve', slug: 'curve-dex', chains: ['Ethereum', 'Arbitrum', 'Polygon'], poolCount: 120, totalTvlUsd: 2500000000, avgApy: 5.5 },
  { name: 'Convex', slug: 'convex-finance', chains: ['Ethereum'], poolCount: 80, totalTvlUsd: 2000000000, avgApy: 8.2 },
  { name: 'GMX', slug: 'gmx', chains: ['Arbitrum', 'Avalanche'], poolCount: 3, totalTvlUsd: 500000000, avgApy: 22.5 },
  { name: 'Pendle', slug: 'pendle', chains: ['Ethereum', 'Arbitrum'], poolCount: 25, totalTvlUsd: 1200000000, avgApy: 15.5 },
];

const mockYieldChainStats: YieldChainStats[] = [
  { chain: 'Ethereum', poolCount: 850, totalTvlUsd: 45000000000, avgApy: 5.2, topProjects: ['Lido', 'Aave', 'Curve', 'Convex', 'Pendle'] },
  { chain: 'Arbitrum', poolCount: 320, totalTvlUsd: 3500000000, avgApy: 8.5, topProjects: ['GMX', 'Aave', 'Camelot', 'Radiant', 'Pendle'] },
  { chain: 'Polygon', poolCount: 280, totalTvlUsd: 1200000000, avgApy: 6.2, topProjects: ['Aave', 'QuickSwap', 'Curve', 'Balancer', 'Beefy'] },
  { chain: 'BSC', poolCount: 450, totalTvlUsd: 3800000000, avgApy: 12.5, topProjects: ['PancakeSwap', 'Venus', 'Alpaca', 'Beefy', 'Thena'] },
  { chain: 'Optimism', poolCount: 180, totalTvlUsd: 850000000, avgApy: 7.8, topProjects: ['Aave', 'Velodrome', 'Synthetix', 'Beethoven', 'Sonne'] },
];
