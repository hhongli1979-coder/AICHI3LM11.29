import { useState, useEffect, useCallback } from 'react';
import {
  WalletState,
  TokenBalance,
  connectMetaMask,
  disconnectWallet,
  getBalance,
  getTokenBalance,
  isMetaMaskInstalled,
  getChainName,
  TOKENS,
} from '@/lib/web3';

const initialState: WalletState = {
  address: null,
  chainId: null,
  balance: null,
  isConnected: false,
  provider: null,
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet
  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await connectMetaMask();
      setWallet(state);
      return state;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet(disconnectWallet());
    setTokens([]);
    setError(null);
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!wallet.provider || !wallet.address) return;
    
    try {
      const balance = await getBalance(wallet.provider, wallet.address);
      setWallet(prev => ({ ...prev, balance }));
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [wallet.provider, wallet.address]);

  // Load token balances
  const loadTokens = useCallback(async () => {
    if (!wallet.provider || !wallet.address) return;

    try {
      const tokenBalances = await Promise.all(
        Object.entries(TOKENS).map(async ([, address]) => {
          try {
            return await getTokenBalance(wallet.provider!, address, wallet.address!);
          } catch {
            return null;
          }
        })
      );
      setTokens(tokenBalances.filter((t): t is TokenBalance => t !== null));
    } catch (err) {
      console.error('Failed to load tokens:', err);
    }
  }, [wallet.provider, wallet.address]);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        disconnect();
      } else if (wallet.isConnected && accs[0] !== wallet.address) {
        connect();
      }
    };

    const handleChainChanged = () => {
      if (wallet.isConnected) {
        connect();
      }
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [wallet.isConnected, wallet.address, connect, disconnect]);

  // Load tokens when connected
  useEffect(() => {
    if (wallet.isConnected && wallet.provider && wallet.address) {
      loadTokens();
    }
  }, [wallet.isConnected, wallet.provider, wallet.address, loadTokens]);

  return {
    wallet,
    tokens,
    loading,
    error,
    connect,
    disconnect,
    refreshBalance,
    loadTokens,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    chainName: wallet.chainId ? getChainName(wallet.chainId) : null,
  };
}
