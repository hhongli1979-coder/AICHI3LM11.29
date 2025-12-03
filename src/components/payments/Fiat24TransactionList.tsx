import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowUp, 
  ArrowDown,
  CreditCard,
  ArrowsLeftRight,
  CurrencyEth,
  Bank,
  Wallet,
  CaretRight,
} from '@phosphor-icons/react';
import type { Fiat24Transaction, Fiat24Currency } from '@/lib/types';
import { formatCurrency, formatTimeAgo, formatFiat24TransactionType } from '@/lib/mock-data';

interface Fiat24TransactionListProps {
  transactions: Fiat24Transaction[];
  totalDebit?: number;
  totalCredit?: number;
  currency?: Fiat24Currency;
  onCurrencyChange?: (currency: Fiat24Currency) => void;
  onViewTransaction?: (txId: string) => void;
}

export function Fiat24TransactionList({ 
  transactions,
  totalDebit = 0,
  totalCredit = 0,
  currency = 'EUR',
  onCurrencyChange,
  onViewTransaction,
}: Fiat24TransactionListProps) {
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((tx) => {
    // Direction filter
    if (filter === 'IN' && tx.amount < 0) return false;
    if (filter === 'OUT' && tx.amount > 0) return false;
    
    // Type filter
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
    
    return true;
  });

  const getTransactionIcon = (type?: string, amount?: number) => {
    if (amount && amount > 0) {
      return <ArrowDown size={20} weight="fill" className="text-green-600" />;
    }
    if (amount && amount < 0) {
      return <ArrowUp size={20} weight="fill" className="text-red-600" />;
    }
    
    switch (type) {
      case 'CRD':
        return <CreditCard size={20} weight="fill" className="text-blue-600" />;
      case 'P2P':
        return <ArrowsLeftRight size={20} weight="fill" className="text-purple-600" />;
      case 'CTU':
        return <CurrencyEth size={20} weight="fill" className="text-teal-600" />;
      case 'FRX':
        return <ArrowsLeftRight size={20} weight="fill" className="text-orange-600" />;
      case 'CDP':
      case 'CWD':
        return <Bank size={20} weight="fill" className="text-gray-600" />;
      default:
        return <Wallet size={20} weight="fill" className="text-gray-500" />;
    }
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR': return '€';
      case 'USD': return '$';
      case 'CHF': return 'CHF';
      case 'CNH': return '¥';
      default: return curr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={24} weight="duotone" />
            Card Transactions
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={currency} onValueChange={(v) => onCurrencyChange?.(v as Fiat24Currency)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="CHF">CHF</SelectItem>
                <SelectItem value="CNH">CNH</SelectItem>
                <SelectItem value="ALL">ALL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">Total Income</span>
            <div className="text-lg font-bold text-green-600">
              +{getCurrencySymbol(currency)}{totalCredit.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Total Expenses</span>
            <div className="text-lg font-bold text-red-600">
              -{getCurrencySymbol(currency)}{totalDebit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ALL')}
          >
            All
          </Button>
          <Button
            variant={filter === 'IN' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('IN')}
            className="gap-1"
          >
            <ArrowDown size={14} /> Income
          </Button>
          <Button
            variant={filter === 'OUT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('OUT')}
            className="gap-1"
          >
            <ArrowUp size={14} /> Expenses
          </Button>
          
          <div className="w-px bg-border mx-2" />
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-8">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CRD">Card Payment</SelectItem>
              <SelectItem value="P2P">P2P Transfer</SelectItem>
              <SelectItem value="CTU">Crypto Top-up</SelectItem>
              <SelectItem value="FRX">Exchange</SelectItem>
              <SelectItem value="CDP">Cash Deposit</SelectItem>
              <SelectItem value="CWD">Cash Withdrawal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.txId}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onViewTransaction?.(tx.txId)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getTransactionIcon(tx.type, tx.amount)}
                </div>
                <div>
                  <div className="font-medium">{tx.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{tx.subtitle}</span>
                    {tx.type && (
                      <Badge variant="outline" className="text-xs">
                        {formatFiat24TransactionType(tx.type)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeAgo(tx.timestamp)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`text-right font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount >= 0 ? '+' : ''}{getCurrencySymbol(currency)}{Math.abs(tx.amount).toFixed(2)}
                </div>
                <CaretRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard size={48} weight="duotone" className="mx-auto mb-3 opacity-50" />
              <p>No transactions found</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredTransactions.length > 0 && (
          <Button variant="outline" className="w-full mt-4">
            Load More Transactions
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
