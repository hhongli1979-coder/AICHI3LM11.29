import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowsClockwise, ArrowDown, Info } from '@phosphor-icons/react';
import type { Fiat24CashBalance, Fiat24Currency } from '@/lib/types';
import { FIAT24_CURRENCIES, generateMockFiat24ExchangeQuote } from '@/lib/mock-data';
import { toast } from 'sonner';

interface Fiat24ExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balances: Fiat24CashBalance[];
}

export function Fiat24ExchangeDialog({ open, onOpenChange, balances }: Fiat24ExchangeDialogProps) {
  const [exchangeType, setExchangeType] = useState<'exactIn' | 'exactOut'>('exactIn');
  const [inputCurrency, setInputCurrency] = useState<Fiat24Currency>('USD24');
  const [outputCurrency, setOutputCurrency] = useState<Fiat24Currency>('EUR24');
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBalance = balances.find((b) => b.currency === inputCurrency);
  const inputCurrencyInfo = FIAT24_CURRENCIES[inputCurrency];
  const outputCurrencyInfo = FIAT24_CURRENCIES[outputCurrency];

  // Get exchange quote
  const quote = generateMockFiat24ExchangeQuote(inputCurrency, outputCurrency);

  // Calculate amounts based on exchange type
  useEffect(() => {
    if (exchangeType === 'exactIn' && inputAmount) {
      const numInput = parseFloat(inputAmount) || 0;
      const rateWithSpread = (quote.rate * quote.spread) / (10000 * 10000);
      const output = numInput * rateWithSpread;
      setOutputAmount(output.toFixed(2));
    }
  }, [inputAmount, exchangeType, quote]);

  useEffect(() => {
    if (exchangeType === 'exactOut' && outputAmount) {
      const numOutput = parseFloat(outputAmount) || 0;
      const reverseQuote = generateMockFiat24ExchangeQuote(outputCurrency, inputCurrency);
      const rateWithSpread = (reverseQuote.rate * quote.reverseSpread) / (10000 * 10000);
      const input = numOutput * rateWithSpread;
      setInputAmount(input.toFixed(2));
    }
  }, [outputAmount, exchangeType, outputCurrency, inputCurrency, quote.reverseSpread]);

  const handleSwapCurrencies = () => {
    setInputCurrency(outputCurrency);
    setOutputCurrency(inputCurrency);
    setInputAmount('');
    setOutputAmount('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate exchange
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Currency exchange completed', {
      description: `Exchanged ${inputCurrencyInfo.symbol}${inputAmount} to ${outputCurrencyInfo.symbol}${outputAmount}`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    setInputAmount('');
    setOutputAmount('');
  };

  const isValidAmount = () => {
    const numInput = parseFloat(inputAmount) || 0;
    const balance = parseFloat(inputBalance?.balance || '0');
    return numInput > 0 && numInput <= balance;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowsClockwise size={24} weight="duotone" className="text-primary" />
            Currency Exchange
          </DialogTitle>
          <DialogDescription>
            Exchange between Fiat24 cash tokens (USD24, EUR24, CHF24, CNH24)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Exchange Type */}
          <Tabs value={exchangeType} onValueChange={(v) => setExchangeType(v as typeof exchangeType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exactIn">I want to sell</TabsTrigger>
              <TabsTrigger value="exactOut">I want to buy</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Input Currency */}
          <div className="space-y-2">
            <Label>{exchangeType === 'exactIn' ? 'You Sell' : 'You Pay With'}</Label>
            <div className="flex gap-2">
              <Select 
                value={inputCurrency} 
                onValueChange={(v) => {
                  setInputCurrency(v as Fiat24Currency);
                  if (v === outputCurrency) {
                    setOutputCurrency(inputCurrency);
                  }
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {balances.map((bal) => {
                    const info = FIAT24_CURRENCIES[bal.currency];
                    return (
                      <SelectItem key={bal.currency} value={bal.currency}>
                        <div className="flex items-center gap-2">
                          <span>{info.icon}</span>
                          <span>{bal.currency}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={inputAmount}
                onChange={(e) => {
                  setInputAmount(e.target.value);
                  if (exchangeType === 'exactOut') setExchangeType('exactIn');
                }}
                className="flex-1"
              />
            </div>
            {inputBalance && (
              <p className="text-xs text-muted-foreground">
                Available: {inputCurrencyInfo.symbol}{parseFloat(inputBalance.balance).toLocaleString()}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
              onClick={handleSwapCurrencies}
            >
              <ArrowsClockwise size={20} weight="bold" />
            </Button>
          </div>

          {/* Output Currency */}
          <div className="space-y-2">
            <Label>{exchangeType === 'exactIn' ? 'You Receive' : 'You Buy'}</Label>
            <div className="flex gap-2">
              <Select 
                value={outputCurrency} 
                onValueChange={(v) => {
                  setOutputCurrency(v as Fiat24Currency);
                  if (v === inputCurrency) {
                    setInputCurrency(outputCurrency);
                  }
                }}
              >
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
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={outputAmount}
                onChange={(e) => {
                  setOutputAmount(e.target.value);
                  if (exchangeType === 'exactIn') setExchangeType('exactOut');
                }}
                className="flex-1"
              />
            </div>
          </div>

          {/* Rate Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-mono">
                1 {inputCurrency} = {(quote.rate / 10000).toFixed(4)} {outputCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Spread</span>
              <span className="font-mono">
                {(100 - (quote.spread / 100)).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Info size={14} />
              <span>
                {exchangeType === 'exactIn' 
                  ? 'moneyExchangeExactIn() - Specify amount to sell'
                  : 'moneyExchangeExactOut() - Specify amount to buy'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidAmount() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              'Exchanging...'
            ) : (
              <>
                <ArrowsClockwise size={16} weight="bold" />
                Exchange
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
