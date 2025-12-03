import { BrowserProvider, formatEther, formatUnits, Contract } from 'ethers';

// ERC20 ABI for token balance
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

// Common token addresses on Ethereum mainnet
export const TOKENS = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EesC26cE3dC84FFa',
};

export interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  address: string;
}

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask wallet
 */
export async function connectMetaMask(): Promise<WalletState> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    const provider = new BrowserProvider(window.ethereum!);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    const address = accounts[0];
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);

    return {
      address,
      chainId: Number(network.chainId),
      balance: formatEther(balance),
      isConnected: true,
      provider,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new Error('Connection rejected by user.');
      }
      throw error;
    }
    throw new Error('Failed to connect to MetaMask.');
  }
}

/**
 * Disconnect wallet (clear state)
 */
export function disconnectWallet(): WalletState {
  return {
    address: null,
    chainId: null,
    balance: null,
    isConnected: false,
    provider: null,
  };
}

/**
 * Get ETH balance for an address
 */
export async function getBalance(provider: BrowserProvider, address: string): Promise<string> {
  const balance = await provider.getBalance(address);
  return formatEther(balance);
}

/**
 * Get ERC20 token balance
 */
export async function getTokenBalance(
  provider: BrowserProvider,
  tokenAddress: string,
  walletAddress: string
): Promise<TokenBalance> {
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);
  
  const [balance, decimals, symbol, name] = await Promise.all([
    contract.balanceOf(walletAddress),
    contract.decimals(),
    contract.symbol(),
    contract.name(),
  ]);

  return {
    symbol,
    name,
    balance: formatUnits(balance, decimals),
    address: tokenAddress,
  };
}

/**
 * Send ETH to an address
 */
export async function sendETH(
  provider: BrowserProvider,
  to: string,
  amount: string
): Promise<string> {
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to,
    value: BigInt(Math.floor(parseFloat(amount) * 1e18)),
  });
  
  await tx.wait();
  return tx.hash;
}

/**
 * Send ERC20 token
 */
export async function sendToken(
  provider: BrowserProvider,
  tokenAddress: string,
  to: string,
  amount: string,
  decimals: number = 18
): Promise<string> {
  const signer = await provider.getSigner();
  const contract = new Contract(tokenAddress, ERC20_ABI, signer);
  
  const value = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));
  const tx = await contract.transfer(to, value);
  
  await tx.wait();
  return tx.hash;
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai',
    56: 'BNB Smart Chain',
    42161: 'Arbitrum One',
    10: 'Optimism',
    43114: 'Avalanche C-Chain',
  };
  return chains[chainId] || `Chain ${chainId}`;
}

/**
 * Switch to a different network
 */
export async function switchNetwork(chainId: number): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as { code: number }).code === 4902) {
      throw new Error('This network is not added to MetaMask.');
    }
    throw error;
  }
}

// Add ethereum type to window
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
