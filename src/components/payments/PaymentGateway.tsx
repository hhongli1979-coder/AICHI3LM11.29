import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Plus, 
  QrCode,
  Bank,
  CurrencyEur,
  CurrencyDollar,
} from '@phosphor-icons/react';
import { Fiat24Card } from './Fiat24Card';
import { Fiat24TransactionList } from './Fiat24TransactionList';
import type { Fiat24Card as Fiat24CardType, Fiat24Currency } from '@/lib/types';
import { 
  generateMockFiat24Card, 
  generateMockFiat24TransactionsResponse,
} from '@/lib/mock-data';

export function PaymentGateway() {
  const [card, setCard] = useState<Fiat24CardType | null>(generateMockFiat24Card());
  const [selectedCurrency, setSelectedCurrency] = useState<Fiat24Currency>('EUR');
  const [createCardDialogOpen, setCreateCardDialogOpen] = useState(false);
  const [changeCurrencyDialogOpen, setChangeCurrencyDialogOpen] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const transactionsResponse = generateMockFiat24TransactionsResponse(selectedCurrency);

  const handleCreateCard = async () => {
    setIsCreatingCard(true);
    try {
      // Simulate API call to POST https://api.fiat24.com/card
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new card
      const newCard = generateMockFiat24Card();
      setCard(newCard);
      setCreateCardDialogOpen(false);
      toast.success('Debit card created successfully!');
    } catch (error) {
      toast.error('Failed to create card. Please try again.');
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handleBlockCard = (externalId: string, block: boolean) => {
    if (card) {
      setCard({
        ...card,
        status: block ? 'blocked' : 'active',
      });
    }
  };

  const handleChangeCurrency = async (currency: string) => {
    if (!card) return;
    
    try {
      // Simulate API call to PUT https://api.fiat24.com/card-currency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCard({
        ...card,
        defaultCurrency: currency as Fiat24Currency,
      });
      setChangeCurrencyDialogOpen(false);
      toast.success(`Default currency changed to ${currency}`);
    } catch (error) {
      toast.error('Failed to change currency');
    }
  };

  const handleViewTransaction = (txId: string) => {
    // Open Arbiscan for transaction details
    window.open(`https://arbiscan.io/tx/${txId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Payment Gateway</h2>
          <p className="text-muted-foreground">
            Manage your Fiat24 debit card and payment methods
          </p>
        </div>
        
        {!card && (
          <Button className="gap-2" onClick={() => setCreateCardDialogOpen(true)}>
            <Plus size={18} weight="bold" />
            Create Debit Card
          </Button>
        )}
      </div>

      {/* Card Section */}
      {card ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Fiat24Card 
              card={card} 
              onBlockCard={handleBlockCard}
            />
            
            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => setChangeCurrencyDialogOpen(true)}
              >
                <CurrencyEur size={18} />
                Change Default Currency
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <QrCode size={18} />
                Scan QR Payment
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Bank size={18} />
                Bank Transfer
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Fiat24TransactionList
              transactions={transactionsResponse.transactions}
              totalDebit={transactionsResponse.totalDebit}
              totalCredit={transactionsResponse.totalCredit}
              currency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              onViewTransaction={handleViewTransaction}
            />
          </div>
        </div>
      ) : (
        <Card className="p-8">
          <CardContent className="text-center">
            <CreditCard size={64} weight="duotone" className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">No Debit Card Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a Mastercard debit card linked to your NFT account. 
              Use it for payments worldwide and manage your funds easily.
            </p>
            <Button size="lg" className="gap-2" onClick={() => setCreateCardDialogOpen(true)}>
              <Plus size={20} weight="bold" />
              Create Your Debit Card
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Info */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 text-center hover:shadow-lg transition-shadow">
          <CreditCard size={32} weight="duotone" className="mx-auto mb-2 text-primary" />
          <div className="font-semibold">Card Payments</div>
          <div className="text-sm text-muted-foreground">Mastercard accepted worldwide</div>
        </Card>
        <Card className="p-4 text-center hover:shadow-lg transition-shadow">
          <QrCode size={32} weight="duotone" className="mx-auto mb-2 text-accent" />
          <div className="font-semibold">QR Payments</div>
          <div className="text-sm text-muted-foreground">Swiss QR & SEPA EPC</div>
        </Card>
        <Card className="p-4 text-center hover:shadow-lg transition-shadow">
          <Bank size={32} weight="duotone" className="mx-auto mb-2 text-blue-600" />
          <div className="font-semibold">Bank Transfers</div>
          <div className="text-sm text-muted-foreground">EUR & CHF supported</div>
        </Card>
        <Card className="p-4 text-center hover:shadow-lg transition-shadow">
          <CurrencyDollar size={32} weight="duotone" className="mx-auto mb-2 text-green-600" />
          <div className="font-semibold">Multi-Currency</div>
          <div className="text-sm text-muted-foreground">EUR, USD, CHF, CNH</div>
        </Card>
      </div>

      {/* Create Card Dialog */}
      <Dialog open={createCardDialogOpen} onOpenChange={setCreateCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard size={24} weight="duotone" />
              Create Debit Card
            </DialogTitle>
            <DialogDescription>
              Create a Mastercard debit card linked to your NFT account. 
              The card will be ready to use immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Card Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mastercard debit card</li>
                <li>• Multi-currency support (EUR, USD, CHF, CNH)</li>
                <li>• Apple Pay, Google Pay, Samsung Pay</li>
                <li>• Real-time transaction notifications</li>
                <li>• Instant card blocking/unblocking</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setCreateCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCard} disabled={isCreatingCard}>
              {isCreatingCard ? 'Creating...' : 'Create Card'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Currency Dialog */}
      <Dialog open={changeCurrencyDialogOpen} onOpenChange={setChangeCurrencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CurrencyEur size={24} weight="duotone" />
              Change Default Currency
            </DialogTitle>
            <DialogDescription>
              Select a new default currency for your debit card. 
              This will be used for international transactions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select 
              defaultValue={card?.defaultCurrency} 
              onValueChange={handleChangeCurrency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                <SelectItem value="CNH">CNH - Chinese Yuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
