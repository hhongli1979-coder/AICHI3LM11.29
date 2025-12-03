import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, LinkBreak, ArrowsClockwise, Copy, Check } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ConnectWallet() {
  const {
    wallet,
    tokens,
    loading,
    error,
    connect,
    disconnect,
    refreshBalance,
    isMetaMaskInstalled,
    chainName,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={24} weight="duotone" />
            Connect Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to access real blockchain features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">MetaMask is not installed</p>
            <Button asChild>
              <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                Install MetaMask
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={24} weight="duotone" />
            Connect Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to access real blockchain features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            {error && <p className="text-destructive mb-4">{error}</p>}
            <Button onClick={handleConnect} disabled={loading} size="lg" className="gap-2">
              <Wallet size={20} weight="bold" />
              {loading ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet size={24} weight="duotone" className="text-primary" />
              Connected Wallet
            </CardTitle>
            <CardDescription>Your real blockchain wallet</CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {chainName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-mono text-lg">{formatAddress(wallet.address!)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={copyAddress}>
            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
          </Button>
        </div>

        {/* ETH Balance */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ETH Balance</p>
              <p className="text-2xl font-bold">
                {parseFloat(wallet.balance || '0').toFixed(4)} ETH
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={refreshBalance}>
              <ArrowsClockwise size={20} />
            </Button>
          </div>
        </div>

        {/* Token Balances */}
        {tokens.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Token Balances</p>
            {tokens.map((token) => (
              <div
                key={token.address}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <p className="font-mono">{parseFloat(token.balance).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Disconnect Button */}
        <Button variant="outline" onClick={handleDisconnect} className="w-full gap-2">
          <LinkBreak size={20} />
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  );
}
