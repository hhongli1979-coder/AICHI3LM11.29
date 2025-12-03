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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PaperPlaneTilt, User, Building } from '@phosphor-icons/react';
import type { Fiat24CashBalance, Fiat24Contact, Fiat24Currency } from '@/lib/types';
import { FIAT24_CURRENCIES, formatFiat24Amount } from '@/lib/mock-data';
import { toast } from 'sonner';

interface Fiat24SendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balances: Fiat24CashBalance[];
  contacts: Fiat24Contact[];
}

export function Fiat24SendDialog({ open, onOpenChange, balances, contacts }: Fiat24SendDialogProps) {
  const [sendType, setSendType] = useState<'address' | 'accountId' | 'contact'>('address');
  const [currency, setCurrency] = useState<Fiat24Currency>('USD24');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [accountId, setAccountId] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBalance = balances.find((b) => b.currency === currency);
  const currencyInfo = FIAT24_CURRENCIES[currency];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Transaction submitted successfully', {
      description: `Sending ${currencyInfo.symbol}${amount} ${currency}`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setRecipient('');
    setAccountId('');
    setSelectedContact('');
    setReference('');
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    const balance = parseFloat(selectedBalance?.balance || '0');
    return numAmount > 0 && numAmount <= balance;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PaperPlaneTilt size={24} weight="duotone" className="text-primary" />
            Send Payment
          </DialogTitle>
          <DialogDescription>
            Transfer Fiat24 cash tokens to another address or account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as Fiat24Currency)}>
              <SelectTrigger>
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
                        <span className="text-muted-foreground ml-2">
                          ({info.symbol}{parseFloat(bal.balance).toLocaleString()})
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedBalance && (
              <p className="text-xs text-muted-foreground">
                Available: {currencyInfo.symbol}{parseFloat(selectedBalance.balance).toLocaleString()}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currencyInfo.symbol}
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {amount && !isValidAmount() && (
              <p className="text-xs text-destructive">
                {parseFloat(amount) <= 0 ? 'Amount must be greater than 0' : 'Insufficient balance'}
              </p>
            )}
          </div>

          {/* Recipient Type */}
          <Tabs value={sendType} onValueChange={(v) => setSendType(v as typeof sendType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="address" className="gap-1">
                <User size={14} />
                Address
              </TabsTrigger>
              <TabsTrigger value="accountId" className="gap-1">
                #
                Account ID
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1">
                <Building size={14} />
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="address" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Recipient Address</Label>
                <Input
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the Arbitrum address holding a Fiat24 NFT
                </p>
              </div>
            </TabsContent>

            <TabsContent value="accountId" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Account ID (NFT Token ID)</Label>
                <Input
                  type="number"
                  placeholder="102365"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 5-6 digit Fiat24 account number
                </p>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Select Platform</Label>
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts
                      .filter((c) => c.currencies.includes(currency))
                      .map((contact) => (
                        <SelectItem key={contact.contactId} value={contact.contactId}>
                          <div className="flex items-center gap-2">
                            <Building size={16} />
                            <span>{contact.platform}</span>
                            <span className="text-muted-foreground">- {contact.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Send to whitelisted platforms like Kraken, Binance, Coinbase
                </p>
              </div>

              {selectedContact && (
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    placeholder="Your platform reference..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the reference number provided by the platform
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Summary */}
          {amount && isValidAmount() && (recipient || accountId || selectedContact) && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="text-sm font-medium">Transaction Summary</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono">{currencyInfo.symbol}{parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-mono text-xs">
                  {sendType === 'address' && (recipient.length > 10 ? recipient.slice(0, 10) + '...' : recipient)}
                  {sendType === 'accountId' && `Account #${accountId}`}
                  {sendType === 'contact' && contacts.find((c) => c.contactId === selectedContact)?.platform}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gas Fee</span>
                <span className="text-green-600">~$0.01</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidAmount() || (!recipient && !accountId && !selectedContact) || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <ArrowRight size={16} weight="bold" />
                Send {currency}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
