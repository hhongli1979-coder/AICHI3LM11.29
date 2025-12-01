import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaperPlaneTilt, Copy, QrCode, Users, ShieldCheck, Key } from '@phosphor-icons/react';
import type { Wallet } from '@/lib/types';
import { formatAddress, formatCurrency, NETWORKS } from '@/lib/mock-data';
import { toast } from 'sonner';
import { SendTransactionForm } from './SendTransactionForm';

interface WalletCardProps {
  wallet: Wallet;
}

export function WalletCard({ wallet }: WalletCardProps) {
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const network = NETWORKS[wallet.network];
  
  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    toast.success('Address copied to clipboard');
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{wallet.name}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{formatAddress(wallet.address)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={copyAddress}
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" style={{ borderColor: network.color, color: network.color }}>
              {network.icon} {network.name}
            </Badge>
            {wallet.type === 'multisig' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users size={12} weight="bold" />
                {wallet.requiredSignatures}/{wallet.signers?.length}
              </Badge>
            )}
            {wallet.type === 'mpc' && wallet.mpcConfig && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-300">
                <ShieldCheck size={12} weight="bold" />
                MPC {wallet.mpcConfig.threshold}/{wallet.mpcConfig.totalShares}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">{formatCurrency(parseFloat(wallet.balance.usd.replace(/,/g, '')))}</div>
            <div className="text-sm text-muted-foreground">
              {wallet.balance.native} {network.name === 'Ethereum' ? 'ETH' : network.name === 'Polygon' ? 'MATIC' : 'BNB'}
            </div>
          </div>
          
          {/* MPC Key Shares Info */}
          {wallet.type === 'mpc' && wallet.mpcConfig && (
            <div className="border-t pt-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Key size={12} weight="bold" />
                Key Shares
              </div>
              <div className="flex flex-wrap gap-1">
                {wallet.mpcConfig.keyShares.map((share) => (
                  <Badge
                    key={share.id}
                    variant="outline"
                    className={`text-xs ${
                      share.status === 'active' 
                        ? 'border-green-300 bg-green-50 text-green-700' 
                        : share.status === 'backup'
                        ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                        : 'border-red-300 bg-red-50 text-red-700'
                    }`}
                  >
                    {share.partyName}
                  </Badge>
                ))}
              </div>
              {wallet.mpcConfig.recoveryEnabled && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <ShieldCheck size={12} weight="bold" />
                  Recovery enabled
                </div>
              )}
            </div>
          )}
          
          {wallet.tokens.length > 0 && (
            <div className="border-t pt-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">Token Balances</div>
              {wallet.tokens.map((token) => (
                <div key={token.address} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <span className="font-medium">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{parseFloat(token.balance).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(parseFloat(token.valueUsd))}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setSendDialogOpen(true)} className="flex-1 gap-2">
              <PaperPlaneTilt size={16} weight="bold" />
              Send
            </Button>
            <Button variant="outline" className="gap-2">
              <QrCode size={16} weight="bold" />
              Receive
            </Button>
          </div>
        </div>
      </CardContent>

      <SendTransactionForm 
        wallet={wallet}
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
      />
    </Card>
  );
}
