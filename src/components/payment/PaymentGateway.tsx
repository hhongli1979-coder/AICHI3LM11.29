import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  Link as LinkIcon,
  QrCode,
  Plus,
  Copy,
  ArrowRight,
  CheckCircle,
  Clock,
  X,
  CurrencyDollar,
  ChartLine,
  Wallet,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatCurrency, formatTimeAgo, generateMockPayments } from '@/lib/mock-data';
import type { PaymentRequest, PaymentChannel } from '@/lib/types';

interface PaymentLinkFormData {
  amount: string;
  currency: string;
  description: string;
  channel: PaymentChannel;
  expirationHours: number;
}

const CHANNELS: { value: PaymentChannel; label: string; icon: string; color: string }[] = [
  { value: 'crypto', label: 'Crypto', icon: '₿', color: '#F7931A' },
  { value: 'stripe', label: 'Credit Card', icon: '💳', color: '#635BFF' },
  { value: 'alipay', label: 'Alipay', icon: '🔵', color: '#1677FF' },
  { value: 'wechat', label: 'WeChat Pay', icon: '🟢', color: '#07C160' },
  { value: 'unionpay', label: 'UnionPay', icon: '🔴', color: '#E21836' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USDC', label: 'USDC - USD Coin' },
  { value: 'ETH', label: 'ETH - Ethereum' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle size={18} weight="fill" className="text-green-600" />;
    case 'pending':
      return <Clock size={18} weight="fill" className="text-yellow-600 animate-pulse" />;
    case 'failed':
    case 'expired':
      return <X size={18} weight="fill" className="text-red-600" />;
    default:
      return <Clock size={18} weight="fill" className="text-gray-600" />;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'failed':
    case 'expired':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function PaymentStats({ payments }: { payments: PaymentRequest[] }) {
  const totalReceived = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const successRate = payments.length > 0
    ? (payments.filter(p => p.status === 'completed').length / payments.length) * 100
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CurrencyDollar size={18} weight="duotone" />
            Total Received
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalReceived)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Clock size={18} weight="duotone" />
            Pending
          </div>
          <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <ChartLine size={18} weight="duotone" />
            Success Rate
          </div>
          <div className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <LinkIcon size={18} weight="duotone" />
            Total Links
          </div>
          <div className="text-2xl font-bold">{payments.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreatePaymentLinkDialog({ onCreateLink }: { onCreateLink: (data: PaymentLinkFormData) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PaymentLinkFormData>({
    amount: '',
    currency: 'USD',
    description: '',
    channel: 'stripe',
    expirationHours: 24,
  });

  const handleSubmit = () => {
    if (!formData.amount || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    onCreateLink(formData);
    setOpen(false);
    setFormData({
      amount: '',
      currency: 'USD',
      description: '',
      channel: 'stripe',
      expirationHours: 24,
    });
    toast.success('Payment link created successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={18} weight="bold" />
          Create Payment Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment Link</DialogTitle>
          <DialogDescription>
            Generate a payment link or QR code for your customers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(v) => setFormData({ ...formData, currency: v })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Product Purchase, Service Fee"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Channel</Label>
            <div className="grid grid-cols-5 gap-2">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, channel: channel.value })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.channel === channel.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xl mb-1">{channel.icon}</div>
                  <div className="text-xs">{channel.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Link Expiration</Label>
            <Select
              value={formData.expirationHours.toString()}
              onValueChange={(v) => setFormData({ ...formData, expirationHours: parseInt(v) })}
            >
              <SelectTrigger id="expiration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="24">24 Hours</SelectItem>
                <SelectItem value="72">3 Days</SelectItem>
                <SelectItem value="168">7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Create Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PaymentLinkCard({ payment }: { payment: PaymentRequest }) {
  const channel = CHANNELS.find(c => c.value === payment.channel);

  const copyLink = () => {
    if (payment.paymentUrl) {
      navigator.clipboard.writeText(payment.paymentUrl);
      toast.success('Payment link copied to clipboard');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(payment.status)}
            <Badge variant="outline" className={getStatusColor(payment.status)}>
              {payment.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {formatCurrency(payment.amount, payment.currency)}
            </div>
            {channel && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                <span>{channel.icon}</span>
                <span>{channel.label}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">{payment.description}</div>
          <div className="text-xs text-muted-foreground">
            Created {formatTimeAgo(payment.createdAt)}
          </div>
        </div>

        {payment.status === 'pending' && payment.paymentUrl && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={copyLink}>
              <Copy size={14} />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <QrCode size={14} />
              QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PaymentGateway() {
  const [payments, setPayments] = useState<PaymentRequest[]>(generateMockPayments);

  const handleCreateLink = (data: PaymentLinkFormData) => {
    const newPayment: PaymentRequest = {
      id: `pay-${Date.now()}`,
      merchantId: 'merchant-1',
      amount: parseFloat(data.amount),
      currency: data.currency,
      channel: data.channel,
      status: 'pending',
      description: data.description,
      paymentUrl: `https://pay.omnicore.io/${Date.now()}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + data.expirationHours * 60 * 60 * 1000,
    };
    setPayments([newPayment, ...payments]);
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Payment Gateway</h2>
          <p className="text-muted-foreground">Accept payments via crypto and traditional channels</p>
        </div>
        <CreatePaymentLinkDialog onCreateLink={handleCreateLink} />
      </div>

      <PaymentStats payments={payments} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Payments
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingPayments.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {pendingPayments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Wallet size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Payment Links Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first payment link to start accepting payments
                </p>
                <CreatePaymentLinkDialog onCreateLink={handleCreateLink} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {payments.map((payment) => (
                <PaymentLinkCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingPayments.map((payment) => (
              <PaymentLinkCard key={payment.id} payment={payment} />
            ))}
          </div>
          {pendingPayments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending payments
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedPayments.map((payment) => (
              <PaymentLinkCard key={payment.id} payment={payment} />
            ))}
          </div>
          {completedPayments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No completed payments yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Integration Guide Card */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={24} weight="duotone" className="text-accent" />
            Integration Options
          </CardTitle>
          <CardDescription>
            Multiple ways to accept payments in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon size={20} weight="duotone" className="text-primary" />
                <span className="font-medium">Payment Links</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Share links via email, SMS, or messaging apps
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <QrCode size={20} weight="duotone" className="text-primary" />
                <span className="font-medium">QR Codes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Display at point of sale for instant mobile payments
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={20} weight="duotone" className="text-primary" />
                <span className="font-medium">API Integration</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Integrate payments directly into your platform
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
