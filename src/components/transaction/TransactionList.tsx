import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Warning, CheckCircle, Clock, X } from '@phosphor-icons/react';
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
        return <CheckCircle size={20} weight="fill" className="text-green-600" />;
      case 'pending':
      case 'signed':
        return <Clock size={20} weight="fill" className="text-yellow-600 animate-pulse-subtle" />;
      case 'failed':
      case 'expired':
        return <X size={20} weight="fill" className="text-red-600" />;
      default:
        return <Clock size={20} weight="fill" className="text-gray-600" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => {
            const signatureProgress = (tx.signatures.length / tx.requiredSignatures) * 100;
            
            return (
              <div
                key={tx.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTransactionClick(tx)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getStatusIcon(tx.status)}</div>
                    <div className="space-y-1">
                      <div className="font-medium">{tx.description || 'Transaction'}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">{formatAddress(tx.from)}</span>
                        <ArrowRight size={14} />
                        <span className="font-mono">{formatAddress(tx.to)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{formatTimeAgo(tx.createdAt)}</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-bold">
                      {tx.value} {tx.token || 'ETH'}
                    </div>
                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                      {tx.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {tx.status === 'pending' && tx.requiredSignatures > 1 && (
                  <div className="space-y-2 mt-3 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Signatures</span>
                      <span className="font-medium">
                        {tx.signatures.length} / {tx.requiredSignatures}
                      </span>
                    </div>
                    <Progress value={signatureProgress} className="h-2" />
                  </div>
                )}
                
                {tx.riskAssessment && tx.riskAssessment.level !== 'low' && (
                  <div className={`flex items-start gap-2 mt-3 pt-3 border-t text-sm ${getRiskColor(tx.riskAssessment.level)}`}>
                    <Warning size={16} weight="fill" className="mt-0.5" />
                    <div>
                      <div className="font-medium">Risk Level: {tx.riskAssessment.level.toUpperCase()}</div>
                      <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                        {tx.riskAssessment.factors.map((factor, idx) => (
                          <li key={idx}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {tx.status === 'pending' && tx.signatures.length < tx.requiredSignatures && (
                  <Button 
                    className="w-full mt-3" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTransactionClick(tx);
                    }}
                  >
                    Sign Transaction
                  </Button>
                )}
              </div>
            );
          })}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
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
