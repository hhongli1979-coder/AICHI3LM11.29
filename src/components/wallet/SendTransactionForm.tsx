import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PaperPlaneTilt, Warning, CheckCircle, XCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { Wallet, TokenBalance } from '@/lib/types';
import { formatAddress, formatCurrency, getRiskColor } from '@/lib/mock-data';

interface SendTransactionFormProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendTransactionForm({ wallet, open, onOpenChange }: SendTransactionFormProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>('native');
  const [memo, setMemo] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<{
    level: string;
    score: number;
    factors: string[];
  } | null>(null);

  const allTokens: (TokenBalance & { symbol: string; balance: string })[] = [
    { 
      symbol: wallet.network === 'ethereum' ? 'ETH' : wallet.network === 'polygon' ? 'MATIC' : 'BNB',
      balance: wallet.balance.native,
      name: 'Native Token',
      address: 'native',
      decimals: 18,
      priceUsd: '2774.00',
      valueUsd: wallet.balance.usd,
    },
    ...wallet.tokens,
  ];

  const validateAddress = (address: string) => {
    setIsValidating(true);
    
    // 模拟地址验证和风险评估
    setTimeout(() => {
      const isValid = address.startsWith('0x') && address.length === 42;
      
      if (isValid) {
        // 模拟风险评估
        const isHighRisk = address.includes('highrisk') || Math.random() > 0.7;
        const isNewAddress = !address.includes('known');
        
        const factors = [];
        let score = 10;
        
        if (isNewAddress) {
          factors.push('First-time recipient');
          score += 20;
        }
        if (parseFloat(amount) > 10000) {
          factors.push('Large transaction amount');
          score += 30;
        }
        if (isHighRisk) {
          factors.push('Address flagged by threat intelligence');
          score += 40;
        }
        
        const level = score < 30 ? 'low' : score < 60 ? 'medium' : 'high';
        
        setRiskAssessment({ level, score, factors });
      } else {
        setRiskAssessment(null);
      }
      
      setIsValidating(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      toast.error('Invalid recipient address');
      return;
    }

    const selectedTokenData = allTokens.find(t => t.address === selectedToken);
    const available = parseFloat(selectedTokenData?.balance || '0');
    const sending = parseFloat(amount);

    if (sending > available) {
      toast.error('Insufficient balance');
      return;
    }

    // 模拟创建交易
    toast.success('Transaction created successfully', {
      description: wallet.type === 'multisig' 
        ? `Waiting for ${wallet.requiredSignatures} signatures`
        : 'Broadcasting to network...'
    });

    onOpenChange(false);
    
    // 重置表单
    setRecipient('');
    setAmount('');
    setMemo('');
    setRiskAssessment(null);
  };

  const selectedTokenData = allTokens.find(t => t.address === selectedToken);
  const estimatedFee = '0.0021'; // ETH
  const estimatedFeeUsd = '5.83';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Transaction</DialogTitle>
          <DialogDescription>
            Send assets from {wallet.name} on {wallet.network}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (e.target.value.length === 42) {
                  validateAddress(e.target.value);
                }
              }}
              className="font-mono text-sm"
            />
            {recipient && recipient.length === 42 && (
              <div className="text-xs text-muted-foreground">
                {formatAddress(recipient, 10)}
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          {riskAssessment && (
            <Alert variant={riskAssessment.level === 'high' ? 'destructive' : 'default'}>
              <Warning size={16} weight="bold" />
              <AlertDescription>
                <div className="font-semibold mb-1">
                  Risk Level: <Badge variant={riskAssessment.level === 'high' ? 'destructive' : 'secondary'}>
                    {riskAssessment.level.toUpperCase()}
                  </Badge> (Score: {riskAssessment.score})
                </div>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {riskAssessment.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="token">Asset</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger id="token">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allTokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-4">
                        {parseFloat(token.balance).toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTokenData && (
              <div className="text-xs text-muted-foreground">
                Available: {parseFloat(selectedTokenData.balance).toLocaleString()} {selectedTokenData.symbol}
                {' '}(≈ {formatCurrency(parseFloat(selectedTokenData.valueUsd))})
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 text-xs"
                onClick={() => setAmount(selectedTokenData?.balance || '0')}
              >
                MAX
              </Button>
            </div>
            {amount && selectedTokenData && (
              <div className="text-xs text-muted-foreground">
                ≈ {formatCurrency(parseFloat(amount) * parseFloat(selectedTokenData.priceUsd))}
              </div>
            )}
          </div>

          {/* Memo (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="memo">Description (Optional)</Label>
            <Input
              id="memo"
              placeholder="Payment for..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          {/* Gas Fee Estimate */}
          <div className="border rounded-lg p-3 bg-muted/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Gas Fee</span>
              <span className="font-medium">{estimatedFee} ETH</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>USD Value</span>
              <span>≈ ${estimatedFeeUsd}</span>
            </div>
          </div>

          {/* Multi-sig Warning */}
          {wallet.type === 'multisig' && (
            <Alert>
              <CheckCircle size={16} weight="bold" />
              <AlertDescription className="text-xs">
                This transaction requires {wallet.requiredSignatures} of {wallet.signers?.length} signatures before execution.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={isValidating || !recipient || !amount}
            >
              <PaperPlaneTilt size={16} weight="bold" />
              {wallet.type === 'multisig' ? 'Create Transaction' : 'Send'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
