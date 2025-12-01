import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Plus, 
  QrCode, 
  Lightning, 
  ArrowRight, 
  CheckCircle,
  Clock,
  X,
  Copy,
  Eye,
  ChartLine,
  Globe,
  Shield,
  CurrencyCircleDollar,
  Receipt,
  Link as LinkIcon,
  Funnel,
  Export,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatCurrency, formatTimeAgo } from '@/lib/mock-data';

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  channel: 'crypto' | 'stripe' | 'alipay' | 'wechat' | 'unionpay' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  customerEmail?: string;
  description: string;
  createdAt: number;
  completedAt?: number;
  fees: number;
  netAmount: number;
  metadata?: Record<string, string>;
}

interface PaymentLink {
  id: string;
  name: string;
  amount: number | null;
  currency: string;
  url: string;
  active: boolean;
  usageCount: number;
  totalCollected: number;
  createdAt: number;
}

// Mock payment data
const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    orderId: 'ORD-2024-001',
    amount: 1299.99,
    currency: 'USD',
    channel: 'stripe',
    status: 'completed',
    customerEmail: 'customer@example.com',
    description: 'Enterprise Plan Annual Subscription',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    completedAt: Date.now() - 2 * 60 * 60 * 1000,
    fees: 38.99,
    netAmount: 1261.00,
  },
  {
    id: 'pay-002',
    orderId: 'ORD-2024-002',
    amount: 5000,
    currency: 'CNY',
    channel: 'alipay',
    status: 'completed',
    description: 'Product Purchase Order #12345',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    completedAt: Date.now() - 5 * 60 * 60 * 1000,
    fees: 75,
    netAmount: 4925,
  },
  {
    id: 'pay-003',
    orderId: 'ORD-2024-003',
    amount: 0.5,
    currency: 'ETH',
    channel: 'crypto',
    status: 'pending',
    customerEmail: 'whale@defi.io',
    description: 'NFT Collection Purchase',
    createdAt: Date.now() - 30 * 60 * 1000,
    fees: 0.001,
    netAmount: 0.499,
  },
  {
    id: 'pay-004',
    orderId: 'ORD-2024-004',
    amount: 299,
    currency: 'USD',
    channel: 'paypal',
    status: 'failed',
    customerEmail: 'failed@test.com',
    description: 'Service Subscription',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    fees: 0,
    netAmount: 0,
  },
  {
    id: 'pay-005',
    orderId: 'ORD-2024-005',
    amount: 8888,
    currency: 'CNY',
    channel: 'wechat',
    status: 'completed',
    description: 'Consulting Services',
    createdAt: Date.now() - 48 * 60 * 60 * 1000,
    completedAt: Date.now() - 48 * 60 * 60 * 1000,
    fees: 133.32,
    netAmount: 8754.68,
  },
];

const MOCK_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: 'link-001',
    name: 'Enterprise Plan',
    amount: 1299.99,
    currency: 'USD',
    url: 'https://pay.omnicore.io/enterprise',
    active: true,
    usageCount: 42,
    totalCollected: 54599.58,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'link-002',
    name: 'Donation',
    amount: null,
    currency: 'USD',
    url: 'https://pay.omnicore.io/donate',
    active: true,
    usageCount: 156,
    totalCollected: 12450,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'link-003',
    name: 'API Credits Pack',
    amount: 99,
    currency: 'USD',
    url: 'https://pay.omnicore.io/api-credits',
    active: false,
    usageCount: 89,
    totalCollected: 8811,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
];

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  crypto: '₿',
  stripe: '💳',
  alipay: '支',
  wechat: '微',
  unionpay: '银',
  paypal: 'PP',
};

const CHANNEL_NAMES: Record<string, string> = {
  crypto: 'Cryptocurrency',
  stripe: 'Credit Card',
  alipay: 'Alipay',
  wechat: 'WeChat Pay',
  unionpay: 'UnionPay',
  paypal: 'PayPal',
};

export function PaymentGateway() {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(MOCK_PAYMENT_LINKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [createLinkOpen, setCreateLinkOpen] = useState(false);
  
  // Create Link form
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkAmount, setNewLinkAmount] = useState('');
  const [newLinkCurrency, setNewLinkCurrency] = useState('USD');
  const [isFlexibleAmount, setIsFlexibleAmount] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || payment.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} weight="fill" className="text-green-600" />;
      case 'pending': return <Clock size={16} weight="fill" className="text-yellow-600" />;
      case 'processing': return <Lightning size={16} weight="fill" className="text-blue-600 animate-pulse" />;
      case 'failed': return <X size={16} weight="fill" className="text-red-600" />;
      case 'refunded': return <Receipt size={16} weight="fill" className="text-purple-600" />;
      default: return null;
    }
  };

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'failed': return 'destructive';
      case 'refunded': return 'secondary';
      default: return 'outline';
    }
  };

  const handleCreateLink = () => {
    if (!newLinkName) {
      toast.error('Please enter a link name');
      return;
    }

    if (!isFlexibleAmount && !newLinkAmount) {
      toast.error('Please enter an amount or enable flexible amount');
      return;
    }

    const newLink: PaymentLink = {
      id: `link-${Date.now()}`,
      name: newLinkName,
      amount: isFlexibleAmount ? null : parseFloat(newLinkAmount),
      currency: newLinkCurrency,
      url: `https://pay.omnicore.io/${newLinkName.toLowerCase().replace(/\s+/g, '-')}`,
      active: true,
      usageCount: 0,
      totalCollected: 0,
      createdAt: Date.now(),
    };

    setPaymentLinks([newLink, ...paymentLinks]);
    toast.success('Payment link created successfully');
    
    // Reset form
    setNewLinkName('');
    setNewLinkAmount('');
    setNewLinkCurrency('USD');
    setIsFlexibleAmount(false);
    setCreateLinkOpen(false);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleToggleLinkStatus = (linkId: string) => {
    setPaymentLinks(paymentLinks.map(link => 
      link.id === linkId ? { ...link, active: !link.active } : link
    ));
    toast.success('Payment link status updated');
  };

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.currency === 'USD' ? p.netAmount : p.netAmount * 0.14), 0);
  
  const totalFees = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.currency === 'USD' ? p.fees : p.fees * 0.14), 0);

  const successRate = payments.length > 0
    ? (payments.filter(p => p.status === 'completed').length / payments.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CurrencyCircleDollar size={24} weight="duotone" className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Receipt size={24} weight="duotone" className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Fees</div>
                <div className="text-2xl font-bold">{formatCurrency(totalFees)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <ChartLine size={24} weight="duotone" className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
                <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <Globe size={24} weight="duotone" className="text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Transactions</div>
                <div className="text-2xl font-bold">{payments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={24} weight="duotone" className="text-primary" />
                Payment Gateway
              </CardTitle>
              <CardDescription>Accept payments via crypto, cards, Alipay, WeChat Pay, and more</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Export size={16} weight="bold" />
                Export
              </Button>
              <Dialog open={createLinkOpen} onOpenChange={setCreateLinkOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus size={16} weight="bold" />
                    Create Payment Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Payment Link</DialogTitle>
                    <DialogDescription>
                      Generate a shareable link to collect payments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkName">Link Name *</Label>
                      <Input
                        id="linkName"
                        placeholder="e.g., Premium Subscription"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="flexibleAmount"
                        checked={isFlexibleAmount}
                        onChange={(e) => setIsFlexibleAmount(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="flexibleAmount">Let customer decide amount</Label>
                    </div>
                    
                    {!isFlexibleAmount && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount *</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={newLinkAmount}
                            onChange={(e) => setNewLinkAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select value={newLinkCurrency} onValueChange={setNewLinkCurrency}>
                            <SelectTrigger id="currency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="CNY">CNY</SelectItem>
                              <SelectItem value="ETH">ETH</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium mb-2">Supported Payment Methods</div>
                      <div className="flex flex-wrap gap-2">
                        {['💳 Cards', '₿ Crypto', '支 Alipay', '微 WeChat', '银 UnionPay', 'PP PayPal'].map((method) => (
                          <Badge key={method} variant="outline">{method}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1" onClick={() => setCreateLinkOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1 gap-2" onClick={handleCreateLink}>
                        <LinkIcon size={16} weight="bold" />
                        Create Link
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="payment-links">Payment Links</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search by order ID, description, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Funnel size={16} className="mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="stripe">Credit Card</SelectItem>
                    <SelectItem value="alipay">Alipay</SelectItem>
                    <SelectItem value="wechat">WeChat Pay</SelectItem>
                    <SelectItem value="unionpay">UnionPay</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{payment.description}</div>
                            {payment.customerEmail && (
                              <div className="text-xs text-muted-foreground">{payment.customerEmail}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <span>{CHANNEL_ICONS[payment.channel]}</span>
                            {CHANNEL_NAMES[payment.channel]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.currency === 'USD' ? formatCurrency(payment.amount) : 
                           payment.currency === 'CNY' ? `¥${payment.amount.toLocaleString()}` :
                           `${payment.amount} ${payment.currency}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {payment.currency === 'USD' ? formatCurrency(payment.fees) :
                           payment.currency === 'CNY' ? `¥${payment.fees.toLocaleString()}` :
                           `${payment.fees} ${payment.currency}`}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(payment.status)} className="gap-1">
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimeAgo(payment.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                  <p>No transactions found</p>
                </div>
              )}
            </TabsContent>

            {/* Payment Links Tab */}
            <TabsContent value="payment-links" className="space-y-4">
              <div className="grid gap-4">
                {paymentLinks.map((link) => (
                  <Card key={link.id} className={`border ${!link.active && 'opacity-60'}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{link.name}</h4>
                            <Badge variant={link.active ? 'default' : 'secondary'}>
                              {link.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <LinkIcon size={14} />
                            <span className="font-mono">{link.url}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleCopyLink(link.url)}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Amount: <span className="font-medium text-foreground">
                                {link.amount ? `${formatCurrency(link.amount)} ${link.currency}` : 'Flexible'}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Usage: <span className="font-medium text-foreground">{link.usageCount} times</span>
                            </span>
                            <span className="text-muted-foreground">
                              Collected: <span className="font-medium text-green-600">{formatCurrency(link.totalCollected)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <QrCode size={16} className="mr-2" />
                            QR Code
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleLinkStatus(link.id)}
                          >
                            {link.active ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {paymentLinks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <LinkIcon size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                    <p>No payment links created yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                    <CardDescription>Configure accepted payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { id: 'crypto', name: 'Cryptocurrency', icon: '₿', enabled: true, fee: '1%' },
                      { id: 'stripe', name: 'Credit Cards', icon: '💳', enabled: true, fee: '2.9% + $0.30' },
                      { id: 'alipay', name: 'Alipay', icon: '支', enabled: true, fee: '1.5%' },
                      { id: 'wechat', name: 'WeChat Pay', icon: '微', enabled: true, fee: '1.5%' },
                      { id: 'unionpay', name: 'UnionPay', icon: '银', enabled: false, fee: '2%' },
                      { id: 'paypal', name: 'PayPal', icon: 'PP', enabled: false, fee: '3.5% + $0.30' },
                    ].map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs text-muted-foreground">Fee: {method.fee}</div>
                          </div>
                        </div>
                        <Badge variant={method.enabled ? 'default' : 'secondary'}>
                          {method.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Settlement Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Settlement Settings</CardTitle>
                    <CardDescription>Configure automatic settlement options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Settlement Currency</Label>
                      <Select defaultValue="usdc">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usdc">USDC (Stablecoin)</SelectItem>
                          <SelectItem value="usdt">USDT (Stablecoin)</SelectItem>
                          <SelectItem value="eth">ETH (Ethereum)</SelectItem>
                          <SelectItem value="usd">USD (Bank Transfer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Settlement Frequency</Label>
                      <Select defaultValue="instant">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Settlement Wallet</Label>
                      <Select defaultValue="treasury">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="treasury">Treasury Vault (0x742d...0bEb)</SelectItem>
                          <SelectItem value="operating">Operating Account (0x8ba1...BA72)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Shield size={16} weight="bold" className="text-primary" />
                        Smart Routing Enabled
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Automatically routes payments through the most cost-effective channels while maintaining optimal conversion rates.
                      </p>
                    </div>

                    <Button className="w-full">Save Settings</Button>
                  </CardContent>
                </Card>
              </div>

              {/* API Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Integration</CardTitle>
                  <CardDescription>Integrate payments into your application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Publishable Key</Label>
                      <div className="flex gap-2">
                        <Input value="pk_live_51H..." readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="icon">
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <div className="flex gap-2">
                        <Input value="sk_live_••••••••••••••••" readOnly className="font-mono text-sm" type="password" />
                        <Button variant="outline" size="icon">
                          <Eye size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <pre className="text-xs font-mono overflow-x-auto">
{`// Example API Usage
const payment = await omnicore.payments.create({
  amount: 1000,
  currency: 'usd',
  methods: ['crypto', 'card', 'alipay'],
  description: 'Order #12345'
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
