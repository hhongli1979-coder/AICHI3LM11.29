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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CurrencyBtc, ArrowDown, Info, Lightning } from '@phosphor-icons/react';
import type { Fiat24Currency } from '@/lib/types';
import { FIAT24_CURRENCIES, FIAT24_CONTRACTS } from '@/lib/mock-data';
import { toast } from 'sonner';

interface Fiat24CryptoDepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUPPORTED_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', address: 'native' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💲', address: FIAT24_CONTRACTS.arbitrum.USDC },
  { symbol: 'WETH', name: 'Wrapped ETH', icon: '⟠', address: FIAT24_CONTRACTS.arbitrum.WETH },
];

export function Fiat24CryptoDepositDialog({ open, onOpenChange }: Fiat24CryptoDepositDialogProps) {
  const [inputToken, setInputToken] = useState('ETH');
  const [outputCurrency, setOutputCurrency] = useState<Fiat24Currency>('USD24');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const outputCurrencyInfo = FIAT24_CURRENCIES[outputCurrency];

  // Mock exchange calculation
  const calculateOutput = () => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount === 0) return { outputAmount: 0, fee: 0, rate: 0 };

    // Mock rates (in reality these would come from the smart contract)
    const ethPrice = 2773.50;
    const usdcPrice = 1.0;
    
    let usdValue = 0;
    if (inputToken === 'ETH' || inputToken === 'WETH') {
      usdValue = numAmount * ethPrice;
    } else if (inputToken === 'USDC') {
      usdValue = numAmount * usdcPrice;
    }

    // Apply 1% fee
    const fee = usdValue * 0.01;
    const afterFee = usdValue - fee;

    // Convert to output currency
    const outputRates: Record<Fiat24Currency, number> = {
      'USD24': 1.0,
      'EUR24': 0.92,
      'CHF24': 0.88,
      'CNH24': 7.2,
    };

    const outputAmount = afterFee * outputRates[outputCurrency];
    const rate = outputRates[outputCurrency];

    return { outputAmount, fee, rate };
  };

  const { outputAmount, fee, rate } = calculateOutput();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate deposit
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success('Crypto deposit initiated', {
      description: `Converting ${amount} ${inputToken} to ${outputCurrency}`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CurrencyBtc size={24} weight="duotone" className="text-primary" />
            Crypto to Fiat Deposit
          </DialogTitle>
          <DialogDescription>
            Convert your crypto assets to Fiat24 cash tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Token */}
          <div className="space-y-2">
            <Label>You Send</Label>
            <div className="flex gap-2">
              <Select value={inputToken} onValueChange={setInputToken}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_TOKENS.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <span>{token.icon}</span>
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <ArrowDown size={20} weight="bold" className="text-muted-foreground" />
            </div>
          </div>

          {/* Output Currency */}
          <div className="space-y-2">
            <Label>You Receive</Label>
            <div className="flex gap-2">
              <Select value={outputCurrency} onValueChange={(v) => setOutputCurrency(v as Fiat24Currency)}>
                <SelectTrigger className="w-[140px]">
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
              <Input
                type="text"
                readOnly
                value={outputAmount > 0 ? outputAmount.toFixed(2) : '0.00'}
                className="flex-1 bg-muted"
              />
            </div>
          </div>

          {/* Rate Info */}
          {parseFloat(amount) > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-mono">
                  1 {inputToken} ≈ {outputCurrencyInfo.symbol}
                  {inputToken === 'USDC' ? rate.toFixed(4) : (2773.50 * rate * 0.99).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (1%)</span>
                <span className="font-mono">${fee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="font-medium">You'll Receive</span>
                <span className="font-mono font-bold">
                  {outputCurrencyInfo.symbol}{outputAmount.toFixed(2)} {outputCurrency}
                </span>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <Alert>
            <Info size={16} />
            <AlertDescription>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                <li>Minimum deposit: $5 USD equivalent</li>
                <li>Maximum deposit: $50,000 USD equivalent</li>
                <li>Wallet providers receive 1% referral fee in USDC</li>
                <li>Swap executed via Uniswap V3 pools on Arbitrum</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Methods */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Deposit Methods</Label>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Lightning size={12} />
                depositETH()
              </Badge>
              <Badge variant="outline">depositTokenViaUsdc()</Badge>
              <Badge variant="outline">depositTokenViaEth()</Badge>
              <Badge variant="outline">depositByWallet()</Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!parseFloat(amount) || parseFloat(amount) < 0.001 || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>
                <CurrencyBtc size={16} weight="bold" />
                Deposit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
