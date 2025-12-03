import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Copy, 
  Eye, 
  EyeSlash,
  Lock,
  LockOpen,
  DeviceMobile,
} from '@phosphor-icons/react';
import type { Fiat24Card as Fiat24CardType } from '@/lib/types';

interface Fiat24CardProps {
  card: Fiat24CardType;
  onBlockCard?: (externalId: string, block: boolean) => void;
  onChangeCurrency?: (externalId: string, currency: string) => void;
}

export function Fiat24Card({ card, onBlockCard, onChangeCurrency }: Fiat24CardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock card details (in real implementation, these come from fiat24card.js bootstrap)
  const cardDetails = {
    cardPan: showDetails ? '4532 •••• •••• ' + card.lastFourDigits : '•••• •••• •••• ' + card.lastFourDigits,
    cardExp: showDetails ? card.expiryDate : '••/••',
    cardCvv: showDetails ? '***' : '•••',
  };

  const handleCopyCardNumber = () => {
    // In production, this uses fiat24card.js copyCardPan functionality
    navigator.clipboard.writeText('4532****' + card.lastFourDigits);
    toast.success('Card number copied to clipboard');
  };

  const handleToggleBlock = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onBlockCard?.(card.externalId, card.status !== 'blocked');
      toast.success(card.status === 'blocked' ? 'Card unblocked successfully' : 'Card blocked successfully');
    } catch (error) {
      toast.error('Failed to update card status');
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    // Using DeviceMobile icon for all device types
    // Apple Pay and Google Pay are differentiated by label
    return <DeviceMobile size={16} weight="fill" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'blocked':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'expired':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Card Visual */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 text-white">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <CreditCard size={24} weight="duotone" />
            <span className="text-sm font-medium opacity-80">Mastercard Debit</span>
          </div>
          <Badge className={getStatusColor(card.status)}>
            {card.status.toUpperCase()}
          </Badge>
        </div>

        {/* Card Number */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            id="cardNumbers" 
            className="text-xl sm:text-2xl font-mono tracking-wider"
          >
            {cardDetails.cardPan}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 h-auto"
            onClick={handleCopyCardNumber}
            id="cardNumbersCopy"
          >
            <Copy size={18} />
          </Button>
        </div>

        {/* Card Details Row */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-xs opacity-60">Card Holder</span>
            <div className="font-medium" id="cardHolder">{card.cardHolder}</div>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <span className="text-xs opacity-60 block" id="cardExpiry">Expiry Date</span>
              <span className="font-mono" id="cardExpiryDate">{cardDetails.cardExp}</span>
            </div>
            <div className="text-center">
              <span className="text-xs opacity-60 block" id="cardCvv">CVV</span>
              <span className="font-mono" id="cardCvvDate">{cardDetails.cardCvv}</span>
            </div>
          </div>
        </div>

        {/* Show/Hide Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <EyeSlash size={20} /> : <Eye size={20} />}
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Card Actions */}
        <div className="flex gap-2">
          <Button
            variant={card.status === 'blocked' ? 'default' : 'outline'}
            size="sm"
            className="flex-1 gap-2"
            onClick={handleToggleBlock}
            disabled={isLoading}
          >
            {card.status === 'blocked' ? (
              <>
                <LockOpen size={16} /> Unblock Card
              </>
            ) : (
              <>
                <Lock size={16} /> Block Card
              </>
            )}
          </Button>
        </div>

        {/* Card Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Default Currency</span>
            <div className="font-medium">{card.defaultCurrency}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Token ID</span>
            <div className="font-mono">{card.tokenId}</div>
          </div>
        </div>

        {/* Digital Wallets */}
        {card.activeTokens.length > 0 && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground block mb-2">Digital Wallets</span>
            <div className="flex flex-wrap gap-2">
              {card.activeTokens.map((token) => (
                <Badge 
                  key={token.id} 
                  variant="outline" 
                  className={`gap-1.5 ${token.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {getDeviceIcon(token.deviceType)}
                  {token.deviceName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
