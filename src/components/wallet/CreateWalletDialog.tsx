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
import { Wallet, Users, Plus, Trash, CheckCircle, Info } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { NETWORKS } from '@/lib/mock-data';
import type { BlockchainNetwork } from '@/lib/types';

interface CreateWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WalletType = 'single' | 'multisig';

export function CreateWalletDialog({ open, onOpenChange }: CreateWalletDialogProps) {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [network, setNetwork] = useState<BlockchainNetwork>('ethereum');
  const [walletType, setWalletType] = useState<WalletType>('single');
  const [signers, setSigners] = useState<string[]>(['']);
  const [threshold, setThreshold] = useState(2);
  const [isDeploying, setIsDeploying] = useState(false);

  const resetForm = () => {
    setStep(1);
    setWalletName('');
    setNetwork('ethereum');
    setWalletType('single');
    setSigners(['']);
    setThreshold(2);
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

  const handleNext = () => {
    if (step === 1) {
      if (!walletName.trim()) {
        toast.error('Please enter a wallet name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (walletType === 'multisig') {
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

    setIsDeploying(true);

    // 模拟部署
    setTimeout(() => {
      toast.success('Wallet created successfully!', {
        description: `${walletName} has been deployed on ${NETWORKS[network].name}`
      });
      setIsDeploying(false);
      onOpenChange(false);
      resetForm();
    }, 2000);
  };

  const selectedNetwork = NETWORKS[network];

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
          <DialogDescription>
            Step {step} of {walletType === 'multisig' ? '3' : '2'}
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
                            Requires multiple approvals (recommended)
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Alert>
                <Info size={16} weight="bold" />
                <AlertDescription className="text-xs">
                  Multi-sig wallets provide enterprise-grade security by requiring multiple parties to approve transactions.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 2: Review (Single) or Continue (Multisig) */}
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

          {/* Step 3: Add Signers */}
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
              onClick={step === 3 || (step === 2 && walletType === 'single') ? handleDeploy : handleNext}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>Deploying...</>
              ) : step === 3 || (step === 2 && walletType === 'single') ? (
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
