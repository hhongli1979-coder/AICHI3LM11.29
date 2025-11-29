import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Warning, Clock, PaperPlaneTilt, User } from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { Transaction } from '@/lib/types';
import { formatAddress, formatCurrency, formatTimeAgo, getRiskColor, NETWORKS } from '@/lib/mock-data';

interface TransactionSignDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionSignDialog({ transaction, open, onOpenChange }: TransactionSignDialogProps) {
  if (!transaction) return null;

  const network = NETWORKS[transaction.network];
  const signatureProgress = (transaction.signatures.length / transaction.requiredSignatures) * 100;
  const canExecute = transaction.signatures.length >= transaction.requiredSignatures;
  const needsMySignature = transaction.status === 'pending' && transaction.signatures.length < transaction.requiredSignatures;

  const handleSign = () => {
    toast.success('Transaction signed successfully', {
      description: canExecute 
        ? 'All signatures collected. Ready to execute.'
        : `${transaction.requiredSignatures - transaction.signatures.length - 1} more signature(s) needed`
    });
    onOpenChange(false);
  };

  const handleExecute = () => {
    toast.success('Transaction broadcasting to network', {
      description: 'Your transaction will be confirmed in a few moments'
    });
    onOpenChange(false);
  };

  const handleReject = () => {
    toast.error('Transaction rejected', {
      description: 'The transaction has been cancelled'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Transaction Details</DialogTitle>
            <Badge 
              variant={transaction.status === 'confirmed' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {transaction.status}
            </Badge>
          </div>
          <DialogDescription>
            Review and sign this multi-signature transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <Badge variant="outline" style={{ borderColor: network.color, color: network.color }}>
                {network.icon} {network.name}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="font-mono text-sm">{formatAddress(transaction.from)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="font-mono text-sm">{formatAddress(transaction.to)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {transaction.value} {transaction.token || 'ETH'}
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {formatCurrency(parseFloat(transaction.value) * 2774)}
                </div>
              </div>
            </div>

            {transaction.description && (
              <>
                <Separator />
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-sm">{transaction.description}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Created</span>
              <span>{formatTimeAgo(transaction.createdAt)}</span>
            </div>

            {transaction.expiresAt && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expires</span>
                <span>{formatTimeAgo(transaction.expiresAt)}</span>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          {transaction.riskAssessment && (
            <Alert variant={transaction.riskAssessment.level === 'high' ? 'destructive' : 'default'}>
              <Warning size={16} weight="bold" />
              <AlertTitle>
                Risk Assessment: <span className={getRiskColor(transaction.riskAssessment.level)}>
                  {transaction.riskAssessment.level.toUpperCase()}
                </span> (Score: {transaction.riskAssessment.score})
              </AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-xs space-y-1 mt-2">
                  {transaction.riskAssessment.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
                {transaction.riskAssessment.recommendations.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="font-semibold text-xs mb-1">Recommendations:</div>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      {transaction.riskAssessment.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Signature Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Signature Progress</span>
              <span className="text-sm text-muted-foreground">
                {transaction.signatures.length} / {transaction.requiredSignatures}
              </span>
            </div>
            <Progress value={signatureProgress} className="h-2" />

            {/* Signatures List */}
            <div className="space-y-2 mt-3">
              {transaction.signatures.map((sig, index) => (
                <div key={index} className="flex items-center gap-2 text-sm border rounded-lg p-2">
                  <CheckCircle size={16} weight="fill" className="text-green-600" />
                  <div className="flex-1">
                    <div className="font-mono text-xs">{formatAddress(sig.signer)}</div>
                    <div className="text-xs text-muted-foreground">
                      Signed {formatTimeAgo(sig.signedAt)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pending Signatures */}
              {Array.from({ length: transaction.requiredSignatures - transaction.signatures.length }).map((_, index) => (
                <div key={`pending-${index}`} className="flex items-center gap-2 text-sm border rounded-lg p-2 border-dashed opacity-50">
                  <Clock size={16} weight="bold" className="text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Waiting for signature...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Hash */}
          {transaction.hash && (
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
              <div className="font-mono text-xs break-all">{transaction.hash}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {transaction.status === 'pending' && (
              <>
                {needsMySignature && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleSign}
                    >
                      <CheckCircle size={16} weight="bold" />
                      Sign Transaction
                    </Button>
                  </>
                )}
                {canExecute && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleExecute}
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    Execute Transaction
                  </Button>
                )}
              </>
            )}
            {transaction.status === 'confirmed' && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
