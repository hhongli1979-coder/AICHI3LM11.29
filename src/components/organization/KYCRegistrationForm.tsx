import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { IdentificationCard, MapPin, Briefcase, Warning, Check } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  OCCUPATIONS,
  JOB_CATEGORIES,
  PURPOSES_LIST,
  SOURCE_OF_FUNDS,
  SECTORS_MAPPING,
  SALARIES,
  TOTAL_ASSETS,
  isSectorAllowed,
} from '@/lib/mock-data';
import type {
  OccupationCode,
  JobCategoryCode,
  PurposeCode,
  SourceOfFundsCode,
  SectorCode,
  SalaryBracketCode,
  TotalAssetsBracketCode,
  GenderCode,
  DocumentTypeCode,
  Fiat24TanSignatureRequest,
} from '@/lib/types';

interface KYCFormData {
  // Profile
  annualSalary: SalaryBracketCode | '';
  totalAssets: TotalAssetsBracketCode | '';
  mainOccupation: OccupationCode | '';
  jobCategory: JobCategoryCode | '';
  sector: SectorCode | '';
  sourceOfFunds: SourceOfFundsCode | '';
  purposes: PurposeCode[];
  
  // Address
  countryISO3: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  
  // ID
  gender: GenderCode | '';
  firstName: string;
  lastName: string;
  nameOfHolder: string;
  birthday: string;
  documentNumber: string;
  documentType: DocumentTypeCode | '';
  documentValidUntil: string;
  issuerCountry: string;
  nationality: string;
  
  // Account
  email: string;
  chainId: number;
  nftId: number;
}

const initialFormData: KYCFormData = {
  annualSalary: '',
  totalAssets: '',
  mainOccupation: '',
  jobCategory: '',
  sector: '',
  sourceOfFunds: '',
  purposes: [],
  countryISO3: '',
  street: '',
  streetNumber: '',
  postalCode: '',
  city: '',
  gender: '',
  firstName: '',
  lastName: '',
  nameOfHolder: '',
  birthday: '',
  documentNumber: '',
  documentType: '',
  documentValidUntil: '',
  issuerCountry: '',
  nationality: '',
  email: '',
  chainId: 5000,
  nftId: 0,
};

export function KYCRegistrationForm() {
  const [formData, setFormData] = useState<KYCFormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof KYCFormData>(field: K, value: KYCFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePurpose = (purposeCode: PurposeCode) => {
    setFormData(prev => ({
      ...prev,
      purposes: prev.purposes.includes(purposeCode)
        ? prev.purposes.filter(p => p !== purposeCode)
        : [...prev.purposes, purposeCode],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Build the request body
    const requestBody: Fiat24TanSignatureRequest = {
      chainId: formData.chainId,
      nftId: formData.nftId,
      email: formData.email,
      profile: {
        annualSalary: formData.annualSalary as SalaryBracketCode,
        totalAssets: formData.totalAssets as TotalAssetsBracketCode,
        mainOccupation: formData.mainOccupation as OccupationCode,
        jobCategory: formData.jobCategory as JobCategoryCode,
        sector: formData.sector as SectorCode,
        sourceOfFunds: formData.sourceOfFunds as SourceOfFundsCode,
        purposes: formData.purposes.join(','),
      },
      address: {
        countryISO3: formData.countryISO3,
        street: formData.street,
        streetNumber: formData.streetNumber,
        postalCode: formData.postalCode,
        city: formData.city,
        gps: { lat: 0, lng: 0 }, // Would be populated from geolocation
        addressProof: { lat: 0, lng: 0 }, // Would be populated from current location
        reverseAddressProof: '', // Would be populated from reverse geocoding
        distance: 0,
      },
      id: {
        gender: formData.gender as GenderCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nameOfHolder: formData.nameOfHolder,
        birthday: formData.birthday,
        documentNumber: formData.documentNumber,
        documentType: formData.documentType as DocumentTypeCode,
        documentValidUntil: formData.documentValidUntil,
        issuerCountry: formData.issuerCountry,
        nationality: formData.nationality,
      },
    };

    // Simulate API call
    console.log('TAN Signature Request:', JSON.stringify(requestBody, null, 2));
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('KYC Registration Submitted', {
        description: 'Your registration has been submitted successfully. Please wait for verification.',
      });
    }, 2000);
  };

  const isStep1Valid = formData.email && formData.annualSalary && formData.totalAssets && 
    formData.mainOccupation && formData.jobCategory && formData.sector && 
    formData.sourceOfFunds && formData.purposes.length > 0;

  const isStep2Valid = formData.countryISO3 && formData.street && formData.streetNumber && 
    formData.postalCode && formData.city;

  const isStep3Valid = formData.gender && formData.firstName && formData.lastName && 
    formData.nameOfHolder && formData.birthday && formData.documentNumber && formData.documentType && 
    formData.documentValidUntil && formData.issuerCountry && formData.nationality;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IdentificationCard size={24} weight="duotone" />
          KYC Registration
        </CardTitle>
        <CardDescription>
          Complete your Know Your Customer verification to unlock full platform features
        </CardDescription>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <Check size={16} weight="bold" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Profile Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Briefcase size={20} weight="duotone" />
              Profile Information
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualSalary">Annual Salary</Label>
                  <Select 
                    value={formData.annualSalary} 
                    onValueChange={(value) => updateField('annualSalary', value as SalaryBracketCode)}
                  >
                    <SelectTrigger id="annualSalary">
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SALARIES).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalAssets">Total Assets</Label>
                  <Select 
                    value={formData.totalAssets} 
                    onValueChange={(value) => updateField('totalAssets', value as TotalAssetsBracketCode)}
                  >
                    <SelectTrigger id="totalAssets">
                      <SelectValue placeholder="Select asset range" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TOTAL_ASSETS).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainOccupation">Main Occupation</Label>
                  <Select 
                    value={formData.mainOccupation} 
                    onValueChange={(value) => updateField('mainOccupation', value as OccupationCode)}
                  >
                    <SelectTrigger id="mainOccupation">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OCCUPATIONS).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobCategory">Job Category</Label>
                  <Select 
                    value={formData.jobCategory} 
                    onValueChange={(value) => updateField('jobCategory', value as JobCategoryCode)}
                  >
                    <SelectTrigger id="jobCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(JOB_CATEGORIES).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Business Sector</Label>
                <Select 
                  value={formData.sector} 
                  onValueChange={(value) => updateField('sector', value as SectorCode)}
                >
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.entries(SECTORS_MAPPING).map(([code, label]) => {
                      const isAllowed = isSectorAllowed(code);
                      return (
                        <SelectItem 
                          key={code} 
                          value={code}
                          disabled={!isAllowed}
                          className={!isAllowed ? 'opacity-50' : ''}
                        >
                          <div className="flex items-center gap-2">
                            {label}
                            {!isAllowed && (
                              <Badge variant="destructive" className="text-xs">
                                <Warning size={12} className="mr-1" />
                                Not allowed
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                <Select 
                  value={formData.sourceOfFunds} 
                  onValueChange={(value) => updateField('sourceOfFunds', value as SourceOfFundsCode)}
                >
                  <SelectTrigger id="sourceOfFunds">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_OF_FUNDS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Purposes (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {Object.entries(PURPOSES_LIST).map(([code, label]) => (
                    <div key={code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`purpose-${code}`}
                        checked={formData.purposes.includes(code as PurposeCode)}
                        onCheckedChange={() => togglePurpose(code as PurposeCode)}
                      />
                      <Label 
                        htmlFor={`purpose-${code}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin size={20} weight="duotone" />
              Address Information
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="countryISO3">Country (ISO3)</Label>
                <Input
                  id="countryISO3"
                  placeholder="e.g., CHE, DEU, USA"
                  maxLength={3}
                  value={formData.countryISO3}
                  onChange={(e) => updateField('countryISO3', e.target.value.toUpperCase())}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    placeholder="Street name"
                    value={formData.street}
                    onChange={(e) => updateField('street', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streetNumber">Number</Label>
                  <Input
                    id="streetNumber"
                    placeholder="123"
                    value={formData.streetNumber}
                    onChange={(e) => updateField('streetNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="12345"
                    value={formData.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City name"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: ID Document Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <IdentificationCard size={20} weight="duotone" />
              ID Document Information
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => updateField('gender', value as GenderCode)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name (Latin)</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name (Latin)</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameOfHolder">Full Name (Original Language)</Label>
                <Input
                  id="nameOfHolder"
                  placeholder="Name as shown on document"
                  value={formData.nameOfHolder}
                  onChange={(e) => updateField('nameOfHolder', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday (DD.MM.YYYY)</Label>
                <Input
                  id="birthday"
                  placeholder="27.06.1991"
                  value={formData.birthday}
                  onChange={(e) => updateField('birthday', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select 
                    value={formData.documentType} 
                    onValueChange={(value) => updateField('documentType', value as DocumentTypeCode)}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">Passport</SelectItem>
                      <SelectItem value="I">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Document Number</Label>
                  <Input
                    id="documentNumber"
                    placeholder="ABCDE1234"
                    value={formData.documentNumber}
                    onChange={(e) => updateField('documentNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentValidUntil">Valid Until (DD.MM.YYYY)</Label>
                <Input
                  id="documentValidUntil"
                  placeholder="27.06.2030"
                  value={formData.documentValidUntil}
                  onChange={(e) => updateField('documentValidUntil', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issuerCountry">Issuer Country (ISO3)</Label>
                  <Input
                    id="issuerCountry"
                    placeholder="CHE"
                    maxLength={3}
                    value={formData.issuerCountry}
                    onChange={(e) => updateField('issuerCountry', e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality (ISO3)</Label>
                  <Input
                    id="nationality"
                    placeholder="CHE"
                    maxLength={3}
                    value={formData.nationality}
                    onChange={(e) => updateField('nationality', e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStep3Valid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
