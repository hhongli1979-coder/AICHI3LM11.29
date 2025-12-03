import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Plus, Info, ShieldCheck } from '@phosphor-icons/react';
import type { Fiat24CardApproval, Fiat24Currency } from '@/lib/types';
import { FIAT24_CURRENCIES, FIAT24_CONTRACTS, formatFiat24Amount } from '@/lib/mock-data';
import { toast } from 'sonner';

interface Fiat24CardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvals: Fiat24CardApproval[];
}

export function Fiat24CardDialog({ open, onOpenChange, approvals }: Fiat24CardDialogProps) {
  const [currency, setCurrency] = useState<Fiat24Currency>('EUR24');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyInfo = FIAT24_CURRENCIES[currency];

  const handleApprove = async () => {
    setIsSubmitting(true);
    
    // Simulate approval transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Card spending approved', {
      description: `Approved ${currencyInfo.symbol}${amount} for card payments`,
    });
    
    setIsSubmitting(false);
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={24} weight="duotone" className="text-primary" />
            Fiat24 Card Management
          </DialogTitle>
          <DialogDescription>
            Manage your debit card spending approvals and limits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Approvals */}
          {approvals.length > 0 && (
            <div className="space-y-3">
              <Label>Active Approvals</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvals.map((approval, index) => {
                  const info = FIAT24_CURRENCIES[approval.currency];
                  const usedAmount = approval.approvedAmount - approval.remainingAmount;
                  const usedPercentage = (usedAmount / approval.approvedAmount) * 100;
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{info.icon}</span>
                          <span className="font-medium">{approval.currency}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <ShieldCheck size={12} className="mr-1" />
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className="font-mono font-medium">
                            {info.symbol}{(approval.remainingAmount / 100).toLocaleString()}
                          </span>
                        </div>
                        <Progress value={100 - usedPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Used: {info.symbol}{(usedAmount / 100).toLocaleString()}</span>
                          <span>Total: {info.symbol}{(approval.approvedAmount / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New Approval */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="flex items-center gap-2">
              <Plus size={16} />
              Add New Approval
            </Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as Fiat24Currency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FIAT24_CURRENCIES).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{info.icon}</span>
                          <span>{code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Amount to Approve</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currencyInfo.symbol}
                  </span>
                  <Input
                    type="number"
                    step="100"
                    min="0"
                    placeholder="5000"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleApprove}
              disabled={!parseFloat(amount) || isSubmitting}
              className="w-full gap-2"
            >
              {isSubmitting ? (
                'Approving...'
              ) : (
                <>
                  <ShieldCheck size={16} weight="bold" />
                  Approve {currencyInfo.symbol}{amount || '0'} for Card Spending
                </>
              )}
            </Button>
          </div>

          {/* Info Section */}
          <Alert>
            <Info size={16} />
            <AlertDescription>
              <div className="space-y-2 mt-1">
                <p className="text-sm">
                  Card authorizations allow the Fiat24 card system to spend your cash tokens.
                </p>
                <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                  <li>Approvals are per currency - approve each currency you want to use</li>
                  <li>Supported currencies: USD24, EUR24, CHF24, CNH24</li>
                  <li>Re-approve when remaining amount runs low</li>
                  <li>Card authorizer: <code className="bg-muted px-1 rounded">{FIAT24_CONTRACTS.arbitrum.cardAuthorizer.slice(0, 10)}...</code></li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Code Example */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-xs text-muted-foreground">Smart Contract Call</Label>
            <pre className="text-xs font-mono mt-2 overflow-x-auto">
{`// Approve card spending
await ${currency.toLowerCase()}.approve(
  '${FIAT24_CONTRACTS.arbitrum.cardAuthorizer}',
  ${parseInt(amount || '0') * 100}  // Amount in cents
);`}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
