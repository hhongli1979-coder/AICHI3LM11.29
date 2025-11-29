import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaperPlaneTilt, Copy, QrCode, Users, CheckCircle, Shield, Sparkle } from '@phosphor-icons/react';
import type { Wallet } from '@/lib/types';
import { formatAddress, formatCurrency, NETWORKS } from '@/lib/mock-data';
import { toast } from 'sonner';
import { SendTransactionForm } from './SendTransactionForm';

interface WalletCardProps {
  wallet: Wallet;
}

export function WalletCard({ wallet }: WalletCardProps) {
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const network = NETWORKS[wallet.network];
  
  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Network indicator stripe */}
      <div 
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl transition-all duration-300 group-hover:w-1.5"
        style={{ backgroundColor: network.color }}
      />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              {wallet.name}
              {wallet.type === 'multisig' && (
                <Shield size={18} weight="fill" className="text-blue-500" />
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                {formatAddress(wallet.address)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 transition-all ${copied ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'}`}
                onClick={copyAddress}
              >
                {copied ? <CheckCircle size={16} weight="fill" /> : <Copy size={14} />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant="outline" 
              className="font-semibold border-2 px-3 py-1 transition-all hover:scale-105"
              style={{ borderColor: network.color, color: network.color, backgroundColor: `${network.color}10` }}
            >
              {network.icon} {network.name}
            </Badge>
            {wallet.type === 'multisig' && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border-blue-200">
                <Users size={14} weight="bold" />
                <span className="font-bold">{wallet.requiredSignatures}/{wallet.signers?.length}</span>
                <span className="text-xs text-blue-500">signatures</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-muted/30 to-transparent p-4 rounded-xl -mx-2">
            <div className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
              {formatCurrency(parseFloat(wallet.balance.usd.replace(/,/g, '')))}
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkle size={14} weight="fill" className="text-amber-500" />
              <span className="font-medium">{wallet.balance.native}</span>
              <span>{network.name === 'Ethereum' ? 'ETH' : network.name === 'Polygon' ? 'MATIC' : 'BNB'}</span>
            </div>
          </div>
          
          {wallet.tokens.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                Token Balances
              </div>
              {wallet.tokens.map((token) => (
                <div key={token.address} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary shadow-inner">
                      {token.symbol.charAt(0)}
                    </div>
                    <span className="font-semibold">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{parseFloat(token.balance).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(parseFloat(token.valueUsd))}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={() => setSendDialogOpen(true)} 
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <PaperPlaneTilt size={18} weight="bold" />
              Send
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 border-2 hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
            >
              <QrCode size={18} weight="bold" />
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
