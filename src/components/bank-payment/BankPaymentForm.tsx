import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Bank, 
  CheckCircle, 
  Warning, 
  Spinner, 
  PaperPlaneTilt,
  MapPin,
  User,
  CurrencyEur,
  CurrencyCircleDollar,
  Info
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { Fiat24BankInfo, BankPaymentCreditor } from '@/lib/types';
import { 
  validateIBANFormat, 
  formatIBAN,
  generateMockPaymentPurposes,
  generateMockCountryCities,
  generateMockBankInfo
} from '@/lib/mock-data';

interface BankPaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency?: 'EUR' | 'CHF';
  onSubmit?: (data: BankPaymentData) => void;
}

export interface BankPaymentData {
  iban: string;
  bankInfo: Fiat24BankInfo;
  amount: string;
  currency: 'EUR' | 'CHF';
  purposeId: number;
  reference?: string;
  creditor: 'BR' | BankPaymentCreditor;
}

export function BankPaymentForm({ 
  open, 
  onOpenChange, 
  currency = 'EUR',
  onSubmit 
}: BankPaymentFormProps) {
  // Form state
  const [step, setStep] = useState(1);
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'CHF'>(currency);
  const [purposeId, setPurposeId] = useState<number | null>(null);
  const [reference, setReference] = useState('');
  const [isSameOwner, setIsSameOwner] = useState(false);
  
  // Creditor info
  const [creditorName, setCreditorName] = useState('');
  const [creditorStreet, setCreditorStreet] = useState('');
  const [creditorCountry, setCreditorCountry] = useState('');
  const [creditorCity, setCreditorCity] = useState('');
  const [creditorZip, setCreditorZip] = useState('');
  
  // Validation state
  const [isValidatingIBAN, setIsValidatingIBAN] = useState(false);
  const [ibanError, setIbanError] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<Fiat24BankInfo | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  
  // Load mock data
  const paymentPurposes = useMemo(() => generateMockPaymentPurposes(), []);
  const countryCities = useMemo(() => generateMockCountryCities(), []);
  
  // Get cities for selected country
  const citiesForCountry = useMemo(() => {
    if (!creditorCountry) return [];
    return countryCities[creditorCountry]?.cities || [];
  }, [creditorCountry, countryCities]);
  
  // Get postal code regex for validation
  const postalCodeRegex = useMemo(() => {
    if (!creditorCountry) return null;
    const regexStr = countryCities[creditorCountry]?.postalCodeRegEx;
    if (!regexStr) return null;
    try {
      return new RegExp(regexStr);
    } catch {
      return null;
    }
  }, [creditorCountry, countryCities]);
  
  // Validate IBAN
  const handleIBANChange = (value: string) => {
    const formatted = formatIBAN(value);
    setIban(formatted);
    setIbanError(null);
    setBankInfo(null);
    
    // Clean IBAN for validation
    const cleanIBAN = value.replace(/\s/g, '').toUpperCase();
    
    if (cleanIBAN.length >= 15) {
      setIsValidatingIBAN(true);
      
      // Simulate API validation
      setTimeout(() => {
        if (validateIBANFormat(cleanIBAN)) {
          const info = generateMockBankInfo(cleanIBAN);
          if (info) {
            setBankInfo(info);
            setIbanError(null);
          } else {
            setIbanError('Bank not found for this IBAN');
          }
        } else {
          setIbanError('Invalid IBAN format');
        }
        setIsValidatingIBAN(false);
      }, 500);
    }
  };
  
  // Validate postal code
  const validatePostalCode = (zip: string) => {
    if (!postalCodeRegex) {
      setZipError(null);
      return true;
    }
    if (postalCodeRegex.test(zip)) {
      setZipError(null);
      return true;
    }
    setZipError('Invalid postal code format for selected country');
    return false;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!bankInfo || purposeId === null) {
      toast.error('Please complete all required fields');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!isSameOwner) {
      if (!creditorName || !creditorStreet || !creditorCity || !creditorZip || !creditorCountry) {
        toast.error('Please complete recipient address');
        return;
      }
      if (!validatePostalCode(creditorZip)) {
        return;
      }
    }
    
    const creditor: 'BR' | BankPaymentCreditor = isSameOwner 
      ? 'BR' 
      : {
          name: creditorName,
          street: creditorStreet,
          city: creditorCity,
          zip: creditorZip,
          country: creditorCountry
        };
    
    const data: BankPaymentData = {
      iban: iban.replace(/\s/g, ''),
      bankInfo,
      amount,
      currency: selectedCurrency,
      purposeId,
      reference: reference || undefined,
      creditor
    };
    
    if (onSubmit) {
      onSubmit(data);
    }
    
    toast.success('Bank payment initiated', {
      description: `${selectedCurrency} ${amount} transfer to ${bankInfo.name}`
    });
    
    // Reset form
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setStep(1);
    setIban('');
    setAmount('');
    setPurposeId(null);
    setReference('');
    setIsSameOwner(false);
    setCreditorName('');
    setCreditorStreet('');
    setCreditorCountry('');
    setCreditorCity('');
    setCreditorZip('');
    setBankInfo(null);
    setIbanError(null);
    setZipError(null);
  };
  
  const canProceedStep1 = bankInfo && !ibanError && amount && parseFloat(amount) > 0;
  const canProceedStep2 = purposeId !== null;
  const canProceedStep3 = isSameOwner || (creditorName && creditorStreet && creditorCity && creditorZip && creditorCountry && !zipError);
  
  const selectedPurpose = paymentPurposes.find(p => p.value === purposeId);
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bank size={24} weight="duotone" className="text-primary" />
            Bank Transfer (Fiat24)
          </DialogTitle>
          <DialogDescription>
            Send EUR or CHF to any bank account via Fiat24 smart contracts
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={step >= 1 ? 'text-primary font-medium' : ''}>1. Account & Amount</span>
            <span className={step >= 2 ? 'text-primary font-medium' : ''}>2. Purpose</span>
            <span className={step >= 3 ? 'text-primary font-medium' : ''}>3. Recipient</span>
            <span className={step >= 4 ? 'text-primary font-medium' : ''}>4. Confirm</span>
          </div>
          <Progress value={(step / 4) * 100} />
        </div>
        
        {/* Step 1: IBAN and Amount */}
        {step === 1 && (
          <div className="space-y-4">
            {/* IBAN Input */}
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <div className="relative">
                <Input
                  id="iban"
                  placeholder="CH00 0000 0000 0000 0000 0"
                  value={iban}
                  onChange={(e) => handleIBANChange(e.target.value)}
                  className={`font-mono text-sm pr-10 ${ibanError ? 'border-red-500' : bankInfo ? 'border-green-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidatingIBAN && <Spinner size={18} className="animate-spin text-muted-foreground" />}
                  {!isValidatingIBAN && bankInfo && <CheckCircle size={18} className="text-green-500" weight="fill" />}
                  {!isValidatingIBAN && ibanError && <Warning size={18} className="text-red-500" weight="fill" />}
                </div>
              </div>
              {ibanError && (
                <p className="text-xs text-red-500">{ibanError}</p>
              )}
            </div>
            
            {/* Bank Info Display */}
            {bankInfo && (
              <Alert className="border-green-200 bg-green-50">
                <Bank size={16} weight="bold" className="text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="font-semibold">{bankInfo.name}</div>
                  <div className="text-xs mt-1 space-x-2">
                    <Badge variant="secondary">{bankInfo.country}</Badge>
                    <span>BIC: {bankInfo.bic}</span>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Currency Selection */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedCurrency === 'EUR' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setSelectedCurrency('EUR')}
                >
                  <CurrencyEur size={18} weight="bold" />
                  EUR
                </Button>
                <Button
                  type="button"
                  variant={selectedCurrency === 'CHF' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setSelectedCurrency('CHF')}
                >
                  <CurrencyCircleDollar size={18} weight="bold" />
                  CHF
                </Button>
              </div>
            </div>
            
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {selectedCurrency}
                </span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
            >
              Continue
            </Button>
          </div>
        )}
        
        {/* Step 2: Payment Purpose */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Purpose</Label>
              <p className="text-xs text-muted-foreground">
                Select the purpose of this payment for compliance requirements
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
              {paymentPurposes.map((purpose) => (
                <div
                  key={purpose.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    purposeId === purpose.value ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setPurposeId(purpose.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      purposeId === purpose.value ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {purposeId === purpose.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{purpose.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {purpose.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Reference (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Invoice number, memo, etc."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Recipient Address */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="same-owner"
                checked={isSameOwner}
                onCheckedChange={(checked) => setIsSameOwner(checked as boolean)}
              />
              <Label htmlFor="same-owner" className="cursor-pointer">
                Transfer to my own account (same owner)
              </Label>
            </div>
            
            {isSameOwner && (
              <Alert>
                <Info size={16} weight="bold" />
                <AlertDescription>
                  This transfer will be marked as "BR" (same beneficial owner). 
                  Recipient address is not required.
                </AlertDescription>
              </Alert>
            )}
            
            {!isSameOwner && (
              <div className="space-y-4">
                <Separator />
                
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin size={18} weight="duotone" />
                  Recipient Address
                </div>
                
                {/* Recipient Name */}
                <div className="space-y-2">
                  <Label htmlFor="creditor-name">Name</Label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="creditor-name"
                      placeholder="Full name or company name"
                      value={creditorName}
                      onChange={(e) => setCreditorName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Street */}
                <div className="space-y-2">
                  <Label htmlFor="creditor-street">Street Address</Label>
                  <Input
                    id="creditor-street"
                    placeholder="Street name and number"
                    value={creditorStreet}
                    onChange={(e) => setCreditorStreet(e.target.value)}
                  />
                </div>
                
                {/* Country Selection */}
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select 
                    value={creditorCountry} 
                    onValueChange={(value) => {
                      setCreditorCountry(value);
                      setCreditorCity(''); // Reset city when country changes
                      setCreditorZip('');
                      setZipError(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(countryCities).map(([code, country]) => (
                        <SelectItem key={code} value={code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* City Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select 
                      value={creditorCity} 
                      onValueChange={setCreditorCity}
                      disabled={!creditorCountry}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {citiesForCountry.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label htmlFor="creditor-zip">Postal Code</Label>
                    <Input
                      id="creditor-zip"
                      placeholder="Postal code"
                      value={creditorZip}
                      onChange={(e) => {
                        setCreditorZip(e.target.value);
                        if (e.target.value) validatePostalCode(e.target.value);
                      }}
                      className={zipError ? 'border-red-500' : ''}
                      disabled={!creditorCountry}
                    />
                    {zipError && (
                      <p className="text-xs text-red-500">{zipError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
              >
                Review
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <div className="text-lg font-semibold flex items-center justify-between">
                <span>Payment Summary</span>
                <Badge variant="outline">{selectedCurrency}</Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{selectedCurrency} {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To Bank</span>
                  <span className="font-medium">{bankInfo?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IBAN</span>
                  <span className="font-mono text-xs">{iban}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BIC</span>
                  <span className="font-mono text-xs">{bankInfo?.bic}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purpose</span>
                  <span className="font-medium text-right max-w-[60%]">{selectedPurpose?.name}</span>
                </div>
                
                {reference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-medium">{reference}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium text-right">
                    {isSameOwner ? 'Same Owner (BR)' : creditorName}
                  </span>
                </div>
                
                {!isSameOwner && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-right text-xs">
                      {creditorStreet}<br />
                      {creditorZip} {creditorCity}<br />
                      {countryCities[creditorCountry]?.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <Alert>
              <Info size={16} weight="bold" />
              <AlertDescription className="text-xs">
                This payment will be processed during bank business hours 
                (Mon-Fri, 07:00–17:00 CET, excluding holidays).
                The smart contract <code className="bg-muted px-1 rounded">clientPayoutRef()</code> will be called.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button 
                className="flex-1 gap-2" 
                onClick={handleSubmit}
              >
                <PaperPlaneTilt size={18} weight="bold" />
                Send Payment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
