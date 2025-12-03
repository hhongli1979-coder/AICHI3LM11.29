// Chain data from DefiLlama chainlist
// Source: https://github.com/DefiLlama/chainlist

export interface ChainInfo {
  chainId: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  explorers: string[];
  tvl?: number;
  protocols?: number;
}

// Popular chains with full configuration
export const CHAINS: ChainInfo[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth', 'https://ethereum.publicnode.com'],
    explorers: ['https://etherscan.io'],
    tvl: 58000000000,
    protocols: 850,
  },
  {
    chainId: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpc: ['https://bsc-dataseed.binance.org', 'https://rpc.ankr.com/bsc', 'https://bsc.publicnode.com'],
    explorers: ['https://bscscan.com'],
    tvl: 5200000000,
    protocols: 420,
  },
  {
    chainId: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpc: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon', 'https://polygon.llamarpc.com'],
    explorers: ['https://polygonscan.com'],
    tvl: 1200000000,
    protocols: 350,
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum', 'https://arbitrum.llamarpc.com'],
    explorers: ['https://arbiscan.io'],
    tvl: 3800000000,
    protocols: 280,
  },
  {
    chainId: 10,
    name: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://mainnet.optimism.io', 'https://rpc.ankr.com/optimism', 'https://optimism.llamarpc.com'],
    explorers: ['https://optimistic.etherscan.io'],
    tvl: 850000000,
    protocols: 180,
  },
  {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpc: ['https://api.avax.network/ext/bc/C/rpc', 'https://rpc.ankr.com/avalanche'],
    explorers: ['https://snowtrace.io'],
    tvl: 980000000,
    protocols: 220,
  },
  {
    chainId: 250,
    name: 'Fantom',
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
    rpc: ['https://rpc.ftm.tools', 'https://rpc.ankr.com/fantom'],
    explorers: ['https://ftmscan.com'],
    tvl: 150000000,
    protocols: 120,
  },
  {
    chainId: 324,
    name: 'zkSync Era',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://mainnet.era.zksync.io', 'https://zksync.drpc.org'],
    explorers: ['https://explorer.zksync.io'],
    tvl: 450000000,
    protocols: 90,
  },
  {
    chainId: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://mainnet.base.org', 'https://base.llamarpc.com'],
    explorers: ['https://basescan.org'],
    tvl: 1500000000,
    protocols: 150,
  },
  {
    chainId: 59144,
    name: 'Linea',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://rpc.linea.build', 'https://linea.drpc.org'],
    explorers: ['https://lineascan.build'],
    tvl: 280000000,
    protocols: 80,
  },
  {
    chainId: 534352,
    name: 'Scroll',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://rpc.scroll.io', 'https://scroll.drpc.org'],
    explorers: ['https://scrollscan.com'],
    tvl: 320000000,
    protocols: 70,
  },
  {
    chainId: 1101,
    name: 'Polygon zkEVM',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://zkevm-rpc.com', 'https://polygon-zkevm.drpc.org'],
    explorers: ['https://zkevm.polygonscan.com'],
    tvl: 120000000,
    protocols: 60,
  },
  {
    chainId: 5000,
    name: 'Mantle',
    nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
    rpc: ['https://rpc.mantle.xyz', 'https://mantle.drpc.org'],
    explorers: ['https://explorer.mantle.xyz'],
    tvl: 180000000,
    protocols: 50,
  },
  {
    chainId: 81457,
    name: 'Blast',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://rpc.blast.io', 'https://blast.drpc.org'],
    explorers: ['https://blastscan.io'],
    tvl: 1200000000,
    protocols: 100,
  },
  {
    chainId: 34443,
    name: 'Mode',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: ['https://mainnet.mode.network'],
    explorers: ['https://modescan.io'],
    tvl: 450000000,
    protocols: 45,
  },
];

// DeFi Adapters from DefiLlama-Adapters
export interface DefiAdapter {
  id: string;
  name: string;
  category: string;
  chains: string[];
  tvl: number;
  url: string;
  audits?: number;
  description?: string;
}

export const DEFI_ADAPTERS: DefiAdapter[] = [
  {
    id: 'lido',
    name: 'Lido',
    category: 'Liquid Staking',
    chains: ['Ethereum', 'Polygon', 'Solana'],
    tvl: 23500000000,
    url: 'https://lido.fi',
    audits: 15,
    description: '流动性质押协议，支持ETH、SOL等资产质押',
  },
  {
    id: 'aave-v3',
    name: 'Aave V3',
    category: 'Lending',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'Base'],
    tvl: 12800000000,
    url: 'https://aave.com',
    audits: 20,
    description: '去中心化借贷协议，支持多链部署',
  },
  {
    id: 'uniswap-v3',
    name: 'Uniswap V3',
    category: 'DEX',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'BNB Chain'],
    tvl: 5600000000,
    url: 'https://uniswap.org',
    audits: 12,
    description: '集中流动性AMM，支持多链交易',
  },
  {
    id: 'makerdao',
    name: 'MakerDAO',
    category: 'CDP',
    chains: ['Ethereum'],
    tvl: 7800000000,
    url: 'https://makerdao.com',
    audits: 18,
    description: 'DAI稳定币发行协议',
  },
  {
    id: 'curve',
    name: 'Curve Finance',
    category: 'DEX',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Fantom', 'Avalanche'],
    tvl: 2400000000,
    url: 'https://curve.fi',
    audits: 10,
    description: '稳定币交易优化的AMM',
  },
  {
    id: 'compound-v3',
    name: 'Compound V3',
    category: 'Lending',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base'],
    tvl: 1800000000,
    url: 'https://compound.finance',
    audits: 14,
    description: '算法货币市场协议',
  },
  {
    id: 'gmx',
    name: 'GMX',
    category: 'Derivatives',
    chains: ['Arbitrum', 'Avalanche'],
    tvl: 580000000,
    url: 'https://gmx.io',
    audits: 8,
    description: '去中心化永续合约交易所',
  },
  {
    id: 'pancakeswap',
    name: 'PancakeSwap',
    category: 'DEX',
    chains: ['BNB Chain', 'Ethereum', 'Arbitrum', 'zkSync Era'],
    tvl: 1600000000,
    url: 'https://pancakeswap.finance',
    audits: 6,
    description: 'BNB Chain上最大的DEX',
  },
  {
    id: 'eigenlayer',
    name: 'EigenLayer',
    category: 'Restaking',
    chains: ['Ethereum'],
    tvl: 15000000000,
    url: 'https://eigenlayer.xyz',
    audits: 5,
    description: '重质押协议，扩展以太坊安全性',
  },
  {
    id: 'rocketpool',
    name: 'Rocket Pool',
    category: 'Liquid Staking',
    chains: ['Ethereum'],
    tvl: 3200000000,
    url: 'https://rocketpool.net',
    audits: 9,
    description: '去中心化ETH质押协议',
  },
];

// Helper to add chain to MetaMask
export async function addChainToMetaMask(chain: ChainInfo): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chain.chainId.toString(16)}`,
        chainName: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpc,
        blockExplorerUrls: chain.explorers,
      }],
    });
    return true;
  } catch (error) {
    console.error('Failed to add chain:', error);
    return false;
  }
}

// Switch to a chain
export async function switchChain(chainId: number): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (error: unknown) {
    // Chain not added, try to add it
    if ((error as { code?: number }).code === 4902) {
      const chain = CHAINS.find(c => c.chainId === chainId);
      if (chain) {
        return addChainToMetaMask(chain);
      }
    }
    return false;
  }
}
