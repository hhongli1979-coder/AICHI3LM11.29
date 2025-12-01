import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Wallet, Users, Plus, Trash, CheckCircle, Info, ShieldCheck, DeviceMobile, Cloud, Desktop, Key } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { NETWORKS } from '@/lib/mock-data';
import type { BlockchainNetwork, WalletType } from '@/lib/types';

interface CreateWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DeviceType = 'mobile' | 'hardware' | 'cloud' | 'server';

interface MPCParty {
  name: string;
  deviceType: DeviceType;
}

export function CreateWalletDialog({ open, onOpenChange }: CreateWalletDialogProps) {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [network, setNetwork] = useState<BlockchainNetwork>('ethereum');
  const [walletType, setWalletType] = useState<WalletType>('single');
  const [signers, setSigners] = useState<string[]>(['']);
  const [threshold, setThreshold] = useState(2);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // MPC specific state
  const [mpcParties, setMpcParties] = useState<MPCParty[]>([
    { name: 'Mobile Device', deviceType: 'mobile' },
    { name: 'Cloud HSM', deviceType: 'cloud' },
  ]);
  const [mpcThreshold, setMpcThreshold] = useState(2);
  const [mpcRecoveryEnabled, setMpcRecoveryEnabled] = useState(true);

  const resetForm = () => {
    setStep(1);
    setWalletName('');
    setNetwork('ethereum');
    setWalletType('single');
    setSigners(['']);
    setThreshold(2);
    setMpcParties([
      { name: 'Mobile Device', deviceType: 'mobile' },
      { name: 'Cloud HSM', deviceType: 'cloud' },
    ]);
    setMpcThreshold(2);
    setMpcRecoveryEnabled(true);
  };

  const handleAddSigner = () => {
    setSigners([...signers, '']);
  };

  const handleRemoveSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const handleSignerChange = (index: number, value: string) => {
    const newSigners = [...signers];
    newSigners[index] = value;
    setSigners(newSigners);
  };

  const handleAddMpcParty = () => {
    setMpcParties([...mpcParties, { name: '', deviceType: 'mobile' }]);
  };

  const handleRemoveMpcParty = (index: number) => {
    setMpcParties(mpcParties.filter((_, i) => i !== index));
    if (mpcThreshold > mpcParties.length - 1) {
      setMpcThreshold(mpcParties.length - 1);
    }
  };

  const handleMpcPartyChange = (index: number, field: 'name' | 'deviceType', value: string) => {
    const newParties = [...mpcParties];
    if (field === 'deviceType') {
      newParties[index] = { ...newParties[index], deviceType: value as DeviceType };
    } else {
      newParties[index] = { ...newParties[index], name: value };
    }
    setMpcParties(newParties);
  };

  const getTotalSteps = () => {
    if (walletType === 'single') return 2;
    if (walletType === 'multisig') return 3;
    if (walletType === 'mpc') return 3;
    return 2;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!walletName.trim()) {
        toast.error('Please enter a wallet name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (walletType === 'multisig' || walletType === 'mpc') {
        setStep(3);
      } else {
        handleDeploy();
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleDeploy = async () => {
    if (walletType === 'multisig') {
      const validSigners = signers.filter(s => s.trim().length === 42 && s.startsWith('0x'));
      if (validSigners.length < 2) {
        toast.error('Multi-sig wallet requires at least 2 signers');
        return;
      }
      if (threshold > validSigners.length) {
        toast.error('Threshold cannot exceed number of signers');
        return;
      }
    }

    if (walletType === 'mpc') {
      const validParties = mpcParties.filter(p => p.name.trim());
      if (validParties.length < 2) {
        toast.error('MPC wallet requires at least 2 key share parties');
        return;
      }
      if (mpcThreshold > validParties.length) {
        toast.error('Threshold cannot exceed number of parties');
        return;
      }
    }

    setIsDeploying(true);

    // Simulate deployment
    setTimeout(() => {
      const typeLabel = walletType === 'mpc' ? 'MPC' : walletType === 'multisig' ? 'Multi-sig' : 'Single';
      toast.success('Wallet created successfully!', {
        description: `${walletName} (${typeLabel}) has been deployed on ${NETWORKS[network].name}`
      });
      setIsDeploying(false);
      onOpenChange(false);
      resetForm();
    }, 2000);
  };

  const selectedNetwork = NETWORKS[network];
  const isLastStep = step === getTotalSteps();

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'mobile': return <DeviceMobile size={16} weight="duotone" />;
      case 'hardware': return <Key size={16} weight="duotone" />;
      case 'cloud': return <Cloud size={16} weight="duotone" />;
      case 'server': return <Desktop size={16} weight="duotone" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
          <DialogDescription>
            Step {step} of {getTotalSteps()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Wallet Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Treasury Vault"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="network">Blockchain Network</Label>
                <Select value={network} onValueChange={(v) => setNetwork(v as BlockchainNetwork)}>
                  <SelectTrigger id="network">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(NETWORKS).map(([key, net]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span style={{ color: net.color }}>{net.icon}</span>
                          <span>{net.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Gas Fee: ~$2-10 • Confirmation: 12-60 seconds
                </p>
              </div>

              <div className="space-y-2">
                <Label>Wallet Type</Label>
                <RadioGroup value={walletType} onValueChange={(v) => setWalletType(v as WalletType)}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Wallet size={20} weight="duotone" />
                        <div>
                          <div className="font-medium">Single Signature</div>
                          <div className="text-xs text-muted-foreground">
                            One owner with full control
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="multisig" id="multisig" />
                    <Label htmlFor="multisig" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users size={20} weight="duotone" />
                        <div>
                          <div className="font-medium">Multi-Signature</div>
                          <div className="text-xs text-muted-foreground">
                            Requires multiple approvals
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50 border-violet-200">
                    <RadioGroupItem value="mpc" id="mpc" />
                    <Label htmlFor="mpc" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={20} weight="duotone" className="text-violet-600" />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            MPC Wallet
                            <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700">Advanced</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Multi-Party Computation • No single point of failure
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {walletType === 'mpc' && (
                <Alert className="border-violet-200 bg-violet-50">
                  <ShieldCheck size={16} weight="bold" className="text-violet-600" />
                  <AlertDescription className="text-xs text-violet-700">
                    MPC wallets split the private key into multiple shares. No single party ever has access to the complete key, eliminating single points of failure.
                  </AlertDescription>
                </Alert>
              )}

              {walletType === 'multisig' && (
                <Alert>
                  <Info size={16} weight="bold" />
                  <AlertDescription className="text-xs">
                    Multi-sig wallets provide enterprise-grade security by requiring multiple parties to approve transactions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2: Review (Single) */}
          {step === 2 && walletType === 'single' && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Wallet Name</span>
                  <span className="font-medium">{walletName}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <Badge variant="outline" style={{ borderColor: selectedNetwork.color, color: selectedNetwork.color }}>
                    {selectedNetwork.icon} {selectedNetwork.name}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">Single Signature</span>
                </div>
              </div>

              <Alert>
                <CheckCircle size={16} weight="bold" />
                <AlertDescription className="text-xs">
                  Your wallet will be created on-chain. This requires a small gas fee (~$2-5).
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 2: Multisig Config */}
          {step === 2 && walletType === 'multisig' && (
            <div className="space-y-4">
              <Alert>
                <Info size={16} weight="bold" />
                <AlertDescription className="text-xs">
                  Configure signers and approval threshold for your multi-signature wallet.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Threshold</Label>
                <Select value={threshold.toString()} onValueChange={(v) => setThreshold(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} of {Math.max(num, signers.filter(s => s.trim()).length)} signatures required
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Number of signatures required to execute transactions
                </p>
              </div>
            </div>
          )}

          {/* Step 2: MPC Config */}
          {step === 2 && walletType === 'mpc' && (
            <div className="space-y-4">
              <Alert className="border-violet-200 bg-violet-50">
                <ShieldCheck size={16} weight="bold" className="text-violet-600" />
                <AlertDescription className="text-xs text-violet-700">
                  Configure key share distribution and threshold for your MPC wallet.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Threshold</Label>
                <Select value={mpcThreshold.toString()} onValueChange={(v) => setMpcThreshold(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()} disabled={num > mpcParties.length}>
                        {num} of {Math.max(num, mpcParties.length)} key shares required
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Minimum key shares needed to sign transactions
                </p>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="recovery" className="cursor-pointer">Recovery Mode</Label>
                  <div className="text-xs text-muted-foreground">
                    Enable social recovery for lost key shares
                  </div>
                </div>
                <Switch
                  id="recovery"
                  checked={mpcRecoveryEnabled}
                  onCheckedChange={setMpcRecoveryEnabled}
                />
              </div>
            </div>
          )}

          {/* Step 3: Add Signers (Multisig) */}
          {step === 3 && walletType === 'multisig' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Signer Addresses</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {signers.map((signer, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="0x..."
                        value={signer}
                        onChange={(e) => handleSignerChange(index, e.target.value)}
                        className="font-mono text-sm"
                      />
                      {signers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveSigner(index)}
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSigner}
                  className="w-full gap-2"
                >
                  <Plus size={16} weight="bold" />
                  Add Signer
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Signers</span>
                  <span className="font-medium">{signers.filter(s => s.trim()).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Required Signatures</span>
                  <span className="font-medium">{threshold}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add MPC Parties */}
          {step === 3 && walletType === 'mpc' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Key Share Parties</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mpcParties.map((party, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Party name (e.g., Mobile App)"
                        value={party.name}
                        onChange={(e) => handleMpcPartyChange(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Select
                        value={party.deviceType}
                        onValueChange={(v) => handleMpcPartyChange(index, 'deviceType', v)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile">
                            <div className="flex items-center gap-2">
                              <DeviceMobile size={14} />
                              Mobile
                            </div>
                          </SelectItem>
                          <SelectItem value="hardware">
                            <div className="flex items-center gap-2">
                              <Key size={14} />
                              Hardware
                            </div>
                          </SelectItem>
                          <SelectItem value="cloud">
                            <div className="flex items-center gap-2">
                              <Cloud size={14} />
                              Cloud HSM
                            </div>
                          </SelectItem>
                          <SelectItem value="server">
                            <div className="flex items-center gap-2">
                              <Desktop size={14} />
                              Server
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {mpcParties.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveMpcParty(index)}
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMpcParty}
                  className="w-full gap-2"
                >
                  <Plus size={16} weight="bold" />
                  Add Key Share Party
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-2 bg-violet-50/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Key Shares</span>
                  <span className="font-medium">{mpcParties.filter(p => p.name.trim()).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Threshold</span>
                  <span className="font-medium">{mpcThreshold}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recovery</span>
                  <span className="font-medium">{mpcRecoveryEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  Key shares will be distributed to:
                </div>
                <div className="flex flex-wrap gap-1">
                  {mpcParties.filter(p => p.name.trim()).map((party, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {getDeviceIcon(party.deviceType)}
                      {party.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isDeploying}
              >
                Back
              </Button>
            )}
            <Button
              className="flex-1 gap-2"
              onClick={isLastStep ? handleDeploy : handleNext}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>Deploying...</>
              ) : isLastStep ? (
                <>
                  <CheckCircle size={16} weight="bold" />
                  Deploy Wallet
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
