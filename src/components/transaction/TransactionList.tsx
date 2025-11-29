import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Warning, CheckCircle, Clock, X, Lightning, ShieldWarning, Signature } from '@phosphor-icons/react';
import type { Transaction } from '@/lib/types';
import { formatAddress, formatTimeAgo, getStatusColor, getRiskColor } from '@/lib/mock-data';
import { TransactionSignDialog } from './TransactionSignDialog';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setSignDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} weight="fill" className="text-emerald-600" />;
      case 'pending':
      case 'signed':
        return <Clock size={20} weight="fill" className="text-amber-500 animate-pulse" />;
      case 'failed':
      case 'expired':
        return <X size={20} weight="fill" className="text-rose-500" />;
      default:
        return <Clock size={20} weight="fill" className="text-slate-400" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'signed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
      case 'expired':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
        <CardTitle className="flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {transactions.map((tx) => {
            const signatureProgress = (tx.signatures.length / tx.requiredSignatures) * 100;
            const isHighRisk = tx.riskAssessment && tx.riskAssessment.level !== 'low';
            
            return (
              <div
                key={tx.id}
                className={`border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group ${isHighRisk ? 'border-rose-200 bg-rose-50/30' : 'hover:border-blue-200 hover:bg-blue-50/30'}`}
                onClick={() => handleTransactionClick(tx)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                      {getStatusIcon(tx.status)}
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-semibold text-sm">{tx.description || 'Transaction'}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono">{formatAddress(tx.from)}</code>
                        <ArrowRight size={12} className="text-slate-400" />
                        <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono">{formatAddress(tx.to)}</code>
                      </div>
                      <div className="text-xs text-muted-foreground">{formatTimeAgo(tx.createdAt)}</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="font-bold text-base">
                      {tx.value} {tx.token || 'ETH'}
                    </div>
                    <Badge variant="outline" className={`text-xs font-semibold ${getStatusBadgeStyle(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {tx.status === 'pending' && tx.requiredSignatures > 1 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-dashed">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Signature size={14} weight="bold" />
                        Signatures
                      </span>
                      <span className="font-bold text-blue-600">
                        {tx.signatures.length} / {tx.requiredSignatures}
                      </span>
                    </div>
                    <Progress value={signatureProgress} className="h-2" />
                  </div>
                )}
                
                {isHighRisk && (
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-rose-200 text-sm">
                    <div className="p-1 rounded-lg bg-rose-100">
                      <ShieldWarning size={16} weight="fill" className="text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-rose-700">Risk Level: {tx.riskAssessment?.level.toUpperCase()}</div>
                      <ul className="list-none text-xs mt-1.5 space-y-1 text-rose-600">
                        {tx.riskAssessment?.factors.map((factor, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-rose-400" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {tx.status === 'pending' && tx.signatures.length < tx.requiredSignatures && (
                  <Button 
                    className="w-full mt-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTransactionClick(tx);
                    }}
                  >
                    <Lightning size={16} weight="fill" />
                    Sign Transaction
                  </Button>
                )}
              </div>
            );
          })}
          
          {transactions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock size={32} weight="duotone" className="text-slate-400" />
              </div>
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm">Your transactions will appear here</p>
            </div>
          )}
        </div>
      </CardContent>

      <TransactionSignDialog
        transaction={selectedTransaction}
        open={signDialogOpen}
        onOpenChange={setSignDialogOpen}
      />
    </Card>
  );
}
