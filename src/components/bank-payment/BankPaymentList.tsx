import { Bank, CheckCircle, Clock, Warning, ArrowRight, Spinner } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BankPayment } from '@/lib/types';
import { formatTimeAgo } from '@/lib/mock-data';

interface BankPaymentListProps {
  payments: BankPayment[];
  onViewDetails?: (payment: BankPayment) => void;
}

export function BankPaymentList({ payments, onViewDetails }: BankPaymentListProps) {
  const getStatusIcon = (status: BankPayment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} weight="fill" className="text-green-500" />;
      case 'processing':
        return <Spinner size={18} className="text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock size={18} weight="fill" className="text-yellow-500" />;
      case 'failed':
      case 'refunded':
        return <Warning size={18} weight="fill" className="text-red-500" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status: BankPayment['status']) => {
    const variants: Record<BankPayment['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'outline',
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive',
      refunded: 'destructive'
    };

    const labels: Record<BankPayment['status'], string> = {
      draft: 'Draft',
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      refunded: 'Refunded'
    };

    return (
      <Badge variant={variants[status]} className={status === 'completed' ? 'bg-green-500' : ''}>
        {labels[status]}
      </Badge>
    );
  };

  const getCreditorName = (payment: BankPayment) => {
    if (payment.creditor === 'BR') {
      return 'Own Account Transfer';
    }
    return payment.creditor.name;
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Bank size={48} weight="duotone" className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bank Payments Yet</h3>
          <p className="text-sm text-muted-foreground">
            Your bank payment history will appear here once you make your first transfer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bank size={20} weight="duotone" />
          Bank Payment History
        </CardTitle>
        <CardDescription>
          Recent EUR and CHF transfers via Fiat24
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(payment.status)}
                <div className="space-y-1">
                  <div className="font-medium">{getCreditorName(payment)}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {payment.account}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {payment.purposeName}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="font-semibold">
                  {payment.currency} {parseFloat(payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                {getStatusBadge(payment.status)}
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(payment.createdAt)}
                </div>
              </div>
            </div>
            
            {payment.reference && (
              <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                Ref: {payment.reference}
              </div>
            )}
            
            {payment.txHash && (
              <div className="mt-2 pt-2 border-t">
                <a 
                  href={`https://etherscan.io/tx/${payment.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View on-chain transaction
                  <ArrowRight size={12} />
                </a>
              </div>
            )}
            
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full"
                onClick={() => onViewDetails(payment)}
              >
                View Details
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
