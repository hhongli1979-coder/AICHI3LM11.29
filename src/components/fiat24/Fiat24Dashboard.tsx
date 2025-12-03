import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bank,
  CreditCard,
  ArrowsLeftRight,
  CurrencyBtc,
  IdentificationCard,
  Copy,
  ShieldCheck,
  Wallet,
  ArrowsClockwise,
  CaretRight,
  Info,
} from '@phosphor-icons/react';
import type { Fiat24State } from '@/lib/types';
import {
  FIAT24_CURRENCIES,
  FIAT24_CONTRACTS,
  formatFiat24Amount,
  getFiat24StatusInfo,
  getFiat24TransactionTypeInfo,
  formatTimeAgo,
  formatAddress,
} from '@/lib/mock-data';
import { toast } from 'sonner';
import { Fiat24SendDialog } from './Fiat24SendDialog';
import { Fiat24CryptoDepositDialog } from './Fiat24CryptoDepositDialog';
import { Fiat24ExchangeDialog } from './Fiat24ExchangeDialog';
import { Fiat24CardDialog } from './Fiat24CardDialog';

interface Fiat24DashboardProps {
  state: Fiat24State;
}

export function Fiat24Dashboard({ state }: Fiat24DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [cryptoDepositOpen, setCryptoDepositOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);

  const statusInfo = state.account ? getFiat24StatusInfo(state.account.status) : null;
  
  const totalBalanceUsd = state.balances.reduce(
    (sum, bal) => sum + parseFloat(bal.balanceUsd),
    0
  );

  const limitUsedPercentage = state.limits
    ? (state.limits.usedLimit / state.limits.clientLimit) * 100
    : 0;

  const copyIban = () => {
    if (state.account?.iban) {
      navigator.clipboard.writeText(state.account.iban);
      toast.success('IBAN copied to clipboard');
    }
  };

  const copyAccountId = () => {
    if (state.account) {
      navigator.clipboard.writeText(state.account.tokenId.toString());
      toast.success('Account ID copied to clipboard');
    }
  };

  if (!state.isConnected || !state.account) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="py-12 text-center">
          <Bank size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Connect to Fiat24</h3>
          <p className="text-muted-foreground mb-4">
            Link your crypto wallet to Fiat24 banking services on Arbitrum or Mantle
          </p>
          <Button className="gap-2">
            <IdentificationCard size={18} weight="bold" />
            Connect Fiat24 Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Bank size={32} weight="duotone" className="text-primary" />
            Fiat24 Banking
          </h2>
          <p className="text-muted-foreground mt-1">
            Swiss banking on {state.network === 'arbitrum' ? 'Arbitrum' : 'Mantle'} blockchain
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Info size={16} weight="duotone" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Account Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <IdentificationCard size={24} weight="duotone" className="text-primary" />
                Fiat24 Account
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Account #{state.account.tokenId}</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={copyAccountId}>
                  <Copy size={12} />
                </Button>
                {state.account.isPremium && (
                  <Badge variant="secondary" className="text-xs">Premium</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={statusInfo?.color}>
                <ShieldCheck size={14} weight="bold" className="mr-1" />
                {statusInfo?.label}
              </Badge>
              <Badge variant="secondary">
                {state.network === 'arbitrum' ? '◭ Arbitrum' : '⬡ Mantle'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IBAN Section */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase font-medium">Swiss IBAN</div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-lg bg-muted px-3 py-1 rounded">
                  {state.account.iban || 'Not assigned'}
                </code>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyIban}>
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this IBAN for bank deposits and receiving payments
              </p>
            </div>

            {/* Limits Section */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase font-medium">30-Day Transaction Limit</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {formatFiat24Amount(state.limits?.usedLimit || 0, 'CHF24')} used
                  </span>
                  <span className="text-muted-foreground">
                    of {formatFiat24Amount(state.limits?.clientLimit || 0, 'CHF24')}
                  </span>
                </div>
                <Progress value={limitUsedPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Resets {state.limits ? formatTimeAgo(state.limits.restartLimitDate) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balances & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balances Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet size={20} weight="duotone" className="text-primary" />
              Cash Token Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-muted-foreground">Total Balance</span>
                <span className="text-2xl font-bold">
                  ${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="space-y-3">
                {state.balances.map((balance) => {
                  const currencyInfo = FIAT24_CURRENCIES[balance.currency];
                  return (
                    <div
                      key={balance.currency}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${currencyInfo.color}20`, color: currencyInfo.color }}
                        >
                          {currencyInfo.icon}
                        </div>
                        <div>
                          <div className="font-medium">{balance.currency}</div>
                          <div className="text-xs text-muted-foreground">{currencyInfo.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {currencyInfo.symbol}{parseFloat(balance.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ≈ ${parseFloat(balance.balanceUsd).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full gap-2 justify-start" onClick={() => setSendDialogOpen(true)}>
              <ArrowsLeftRight size={18} weight="bold" />
              Send Payment
              <CaretRight size={16} className="ml-auto" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-start"
              onClick={() => setCryptoDepositOpen(true)}
            >
              <CurrencyBtc size={18} weight="bold" />
              Crypto Deposit
              <CaretRight size={16} className="ml-auto" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-start"
              onClick={() => setExchangeOpen(true)}
            >
              <ArrowsClockwise size={18} weight="bold" />
              Currency Exchange
              <CaretRight size={16} className="ml-auto" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-start"
              onClick={() => setCardDialogOpen(true)}
            >
              <CreditCard size={18} weight="bold" />
              Manage Card
              <CaretRight size={16} className="ml-auto" />
            </Button>

            <div className="pt-3 border-t mt-4">
              <div className="text-xs text-muted-foreground mb-2">Contract Addresses</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account NFT:</span>
                  <code className="font-mono">{formatAddress(FIAT24_CONTRACTS.arbitrum.account, 6)}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Crypto Deposit:</span>
                  <code className="font-mono">{formatAddress(FIAT24_CONTRACTS.arbitrum.cryptoDeposit, 6)}</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions & History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.transactions.map((tx) => {
              const typeInfo = getFiat24TransactionTypeInfo(tx.type);
              const currencyInfo = FIAT24_CURRENCIES[tx.currency];
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted ${typeInfo.color}`}>
                      {tx.type === 'p2p_transfer' && <ArrowsLeftRight size={20} weight="bold" />}
                      {tx.type === 'crypto_deposit' && <CurrencyBtc size={20} weight="bold" />}
                      {tx.type === 'cash_deposit' && <Bank size={20} weight="bold" />}
                      {tx.type === 'cash_payout' && <Wallet size={20} weight="bold" />}
                      {tx.type === 'card_payment' && <CreditCard size={20} weight="bold" />}
                      {tx.type === 'exchange' && <ArrowsClockwise size={20} weight="bold" />}
                    </div>
                    <div>
                      <div className="font-medium">{typeInfo.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {tx.description || `${tx.from} → ${tx.to}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {tx.type === 'cash_payout' || tx.type === 'card_payment' ? '-' : '+'}
                      {currencyInfo.symbol}{(tx.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant={tx.status === 'confirmed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                      <span className="text-muted-foreground">{formatTimeAgo(tx.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Card Approvals Section */}
      {state.cardApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} weight="duotone" className="text-primary" />
              Card Spending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.cardApprovals.map((approval, index) => {
                const currencyInfo = FIAT24_CURRENCIES[approval.currency];
                const usedPercentage = ((approval.approvedAmount - approval.remainingAmount) / approval.approvedAmount) * 100;
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{currencyInfo.icon}</span>
                        <span className="font-medium">{approval.currency}</span>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-medium">
                          {currencyInfo.symbol}{(approval.remainingAmount / 100).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={100 - usedPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Approved: {currencyInfo.symbol}{(approval.approvedAmount / 100).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Fiat24SendDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        balances={state.balances}
        contacts={state.contacts}
      />
      
      <Fiat24CryptoDepositDialog
        open={cryptoDepositOpen}
        onOpenChange={setCryptoDepositOpen}
      />
      
      <Fiat24ExchangeDialog
        open={exchangeOpen}
        onOpenChange={setExchangeOpen}
        balances={state.balances}
      />
      
      <Fiat24CardDialog
        open={cardDialogOpen}
        onOpenChange={setCardDialogOpen}
        approvals={state.cardApprovals}
      />
    </div>
  );
}
