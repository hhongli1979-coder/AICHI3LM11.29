import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  Warning, 
  CheckCircle,
  X,
  Eye,
  Lightning,
  Clock,
  MagnifyingGlass,
  ShieldCheck,
  ShieldWarning,
  ShieldSlash,
  Scan,
  FileText,
  Flag,
  Globe,
  User,
  ArrowRight,
  TrendUp,
  Lock,
  Bell,
  Gear
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatAddress, formatTimeAgo, formatCurrency } from '@/lib/mock-data';

interface RiskAlert {
  id: string;
  type: 'high' | 'medium' | 'low' | 'critical';
  category: string;
  title: string;
  description: string;
  address?: string;
  amount?: number;
  createdAt: number;
  status: 'active' | 'resolved' | 'ignored';
  action?: string;
}

interface AddressScan {
  address: string;
  riskScore: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  flags: string[];
  firstSeen: number;
  transactionCount: number;
  totalVolume: number;
  sanctioned: boolean;
  mixerAssociated: boolean;
  contractVerified?: boolean;
}

interface ComplianceItem {
  id: string;
  type: string;
  status: 'compliant' | 'non_compliant' | 'pending_review';
  lastChecked: number;
  details: string;
}

// Mock data
const RISK_ALERTS: RiskAlert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    category: 'Sanctions',
    title: 'OFAC Sanctioned Address Detected',
    description: 'Attempted transaction to an address on the OFAC sanctions list. Transaction blocked automatically.',
    address: '0xhighriskabc123',
    amount: 25000,
    createdAt: Date.now() - 15 * 60 * 1000,
    status: 'active',
    action: 'Review Required',
  },
  {
    id: 'alert-2',
    type: 'high',
    category: 'Unusual Activity',
    title: 'Large Withdrawal to Unknown Address',
    description: 'A withdrawal of $50,000 was initiated to an address with no transaction history.',
    address: '0xnewaddress456',
    amount: 50000,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    status: 'active',
    action: 'Verify Identity',
  },
  {
    id: 'alert-3',
    type: 'medium',
    category: 'Pattern Detection',
    title: 'Potential Mixer Interaction',
    description: 'Funds received from an address associated with cryptocurrency mixing services.',
    address: '0xmixerassoc789',
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    status: 'resolved',
  },
  {
    id: 'alert-4',
    type: 'low',
    category: 'Velocity',
    title: 'Multiple Transactions Detected',
    description: 'Unusual number of transactions (15) in the last hour from Operating Account.',
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    status: 'ignored',
  },
];

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'comp-1',
    type: 'KYC Verification',
    status: 'compliant',
    lastChecked: Date.now() - 2 * 60 * 60 * 1000,
    details: 'All team members verified',
  },
  {
    id: 'comp-2',
    type: 'AML Screening',
    status: 'compliant',
    lastChecked: Date.now() - 30 * 60 * 1000,
    details: 'No flagged addresses in contact list',
  },
  {
    id: 'comp-3',
    type: 'Transaction Monitoring',
    status: 'compliant',
    lastChecked: Date.now() - 5 * 60 * 1000,
    details: 'Real-time monitoring active',
  },
  {
    id: 'comp-4',
    type: 'Sanctions Screening',
    status: 'pending_review',
    lastChecked: Date.now() - 1 * 60 * 60 * 1000,
    details: '1 address requires manual review',
  },
  {
    id: 'comp-5',
    type: 'Travel Rule',
    status: 'compliant',
    lastChecked: Date.now() - 4 * 60 * 60 * 1000,
    details: 'All transfers > $3000 include required info',
  },
];

export function RiskIntelligence() {
  const [alerts, setAlerts] = useState<RiskAlert[]>(RISK_ALERTS);
  const [scanAddress, setScanAddress] = useState('');
  const [scanResult, setScanResult] = useState<AddressScan | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanAddress = () => {
    if (!scanAddress || !scanAddress.startsWith('0x')) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setIsScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate risk score first
      const baseRiskScore = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 10;
      
      // Determine risk level based on calculated score
      let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
      if (baseRiskScore >= 80) riskLevel = 'critical';
      else if (baseRiskScore >= 60) riskLevel = 'high';
      else if (baseRiskScore >= 40) riskLevel = 'medium';
      else if (baseRiskScore >= 20) riskLevel = 'low';
      else riskLevel = 'safe';

      const mockResult: AddressScan = {
        address: scanAddress,
        riskScore: baseRiskScore,
        riskLevel: riskLevel,
        labels: ['Exchange', 'Known Entity', 'High Volume'],
        flags: baseRiskScore >= 60 ? ['Mixer Associated', 'Recently Created'] : [],
        firstSeen: Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
        transactionCount: Math.floor(Math.random() * 10000),
        totalVolume: Math.floor(Math.random() * 10000000),
        sanctioned: baseRiskScore >= 90,
        mixerAssociated: baseRiskScore >= 70,
        contractVerified: Math.random() > 0.3,
      };

      setScanResult(mockResult);
      setIsScanning(false);
      toast.success('Address scan completed');
    }, 1500);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' } : a
    ));
    toast.success('Alert marked as resolved');
  };

  const handleIgnoreAlert = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, status: 'ignored' } : a
    ));
    toast.success('Alert ignored');
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <ShieldSlash size={20} weight="fill" className="text-red-600" />;
      case 'high': return <ShieldWarning size={20} weight="fill" className="text-orange-600" />;
      case 'medium': return <Shield size={20} weight="fill" className="text-yellow-600" />;
      case 'low': return <ShieldCheck size={20} weight="fill" className="text-blue-600" />;
      case 'safe': return <ShieldCheck size={20} weight="fill" className="text-green-600" />;
      default: return <Shield size={20} weight="fill" className="text-gray-600" />;
    }
  };

  const getRiskBadgeVariant = (level: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && a.status === 'active');
  const overallRiskScore = criticalAlerts.length > 0 ? 85 : activeAlerts.length > 2 ? 65 : activeAlerts.length > 0 ? 35 : 15;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield size={32} weight="duotone" className="text-primary" />
            AI Risk Intelligence
          </h2>
          <p className="text-muted-foreground">Real-time threat detection and compliance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell size={16} weight="bold" />
            Configure Alerts
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={16} weight="bold" />
            Compliance Report
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`border-2 ${overallRiskScore >= 70 ? 'border-red-200 bg-red-50' : overallRiskScore >= 40 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Overall Risk Score</div>
                <div className={`text-4xl font-bold ${overallRiskScore >= 70 ? 'text-red-600' : overallRiskScore >= 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {overallRiskScore}
                </div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
              <div className={`p-3 rounded-full ${overallRiskScore >= 70 ? 'bg-red-100' : overallRiskScore >= 40 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                {overallRiskScore >= 70 ? <ShieldSlash size={32} weight="duotone" className="text-red-600" /> :
                 overallRiskScore >= 40 ? <ShieldWarning size={32} weight="duotone" className="text-yellow-600" /> :
                 <ShieldCheck size={32} weight="duotone" className="text-green-600" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100">
                <Warning size={24} weight="duotone" className="text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <div className="text-xs text-red-600">{criticalAlerts.length} critical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle size={24} weight="duotone" className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Compliance Status</div>
                <div className="text-2xl font-bold">4/5</div>
                <div className="text-xs text-green-600">Items compliant</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Scan size={24} weight="duotone" className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Scans Today</div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-xs text-blue-600">Real-time monitoring</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="alerts" className="gap-2">
                <Warning size={16} />
                Risk Alerts
              </TabsTrigger>
              <TabsTrigger value="scanner" className="gap-2">
                <Scan size={16} />
                Address Scanner
              </TabsTrigger>
              <TabsTrigger value="compliance" className="gap-2">
                <FileText size={16} />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Gear size={16} />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              {criticalAlerts.length > 0 && (
                <Alert variant="destructive">
                  <ShieldSlash size={16} weight="bold" />
                  <AlertTitle>Critical Alert</AlertTitle>
                  <AlertDescription>
                    {criticalAlerts.length} critical risk alert(s) require immediate attention.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`border rounded-lg p-4 ${
                      alert.status === 'resolved' ? 'opacity-60 bg-muted/30' : 
                      alert.status === 'ignored' ? 'opacity-40' : ''
                    } ${alert.type === 'critical' && alert.status === 'active' ? 'border-red-300 bg-red-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getRiskIcon(alert.type)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{alert.title}</span>
                            <Badge variant={getRiskBadgeVariant(alert.type)}>
                              {alert.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{alert.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          {alert.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Address:</span>
                              <span className="font-mono">{formatAddress(alert.address)}</span>
                            </div>
                          )}
                          {alert.amount && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-medium">{formatCurrency(alert.amount)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            {formatTimeAgo(alert.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={
                          alert.status === 'active' ? 'default' :
                          alert.status === 'resolved' ? 'secondary' : 'outline'
                        }>
                          {alert.status === 'active' ? 'Active' :
                           alert.status === 'resolved' ? 'Resolved' : 'Ignored'}
                        </Badge>
                        {alert.status === 'active' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleIgnoreAlert(alert.id)}>
                              Ignore
                            </Button>
                            <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Scanner Tab */}
            <TabsContent value="scanner" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Address Risk Scanner</CardTitle>
                  <CardDescription>
                    Check any blockchain address for risk indicators, sanctions, and suspicious activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        placeholder="Enter address to scan (0x...)"
                        value={scanAddress}
                        onChange={(e) => setScanAddress(e.target.value)}
                        className="pl-10 font-mono"
                      />
                    </div>
                    <Button onClick={handleScanAddress} disabled={isScanning} className="gap-2">
                      {isScanning ? (
                        <>
                          <Lightning size={16} className="animate-pulse" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Scan size={16} weight="bold" />
                          Scan Address
                        </>
                      )}
                    </Button>
                  </div>

                  {scanResult && (
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getRiskIcon(scanResult.riskLevel)}
                          <div>
                            <div className="font-mono text-sm">{formatAddress(scanResult.address, 10)}</div>
                            <div className="text-sm text-muted-foreground">
                              First seen: {new Date(scanResult.firstSeen).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {scanResult.riskScore}
                          </div>
                          <Badge variant={getRiskBadgeVariant(scanResult.riskLevel)}>
                            {scanResult.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                            <div className="text-xl font-bold">{scanResult.transactionCount.toLocaleString()}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
                            <div className="text-xl font-bold">{formatCurrency(scanResult.totalVolume)}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground mb-1">Contract Status</div>
                            <div className="text-xl font-bold">
                              {scanResult.contractVerified ? 'Verified ✓' : 'Not Verified'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Flags and Labels */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Flag size={16} />
                            Risk Flags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {scanResult.sanctioned && (
                              <Badge variant="destructive">⚠️ OFAC Sanctioned</Badge>
                            )}
                            {scanResult.mixerAssociated && (
                              <Badge variant="destructive">🔄 Mixer Associated</Badge>
                            )}
                            {scanResult.flags.map((flag, idx) => (
                              <Badge key={idx} variant="secondary">{flag}</Badge>
                            ))}
                            {!scanResult.sanctioned && !scanResult.mixerAssociated && scanResult.flags.length === 0 && (
                              <Badge variant="outline" className="text-green-600 border-green-300">
                                ✓ No Risk Flags
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <User size={16} />
                            Address Labels
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {scanResult.labels.map((label, idx) => (
                              <Badge key={idx} variant="outline">{label}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Alert variant={scanResult.riskLevel === 'high' || scanResult.riskLevel === 'critical' ? 'destructive' : 'default'}>
                        {scanResult.riskLevel === 'high' || scanResult.riskLevel === 'critical' ? (
                          <>
                            <ShieldWarning size={16} weight="bold" />
                            <AlertTitle>High Risk Warning</AlertTitle>
                            <AlertDescription>
                              This address shows indicators of high-risk activity. Exercise extreme caution when transacting.
                            </AlertDescription>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={16} weight="bold" />
                            <AlertTitle>Risk Assessment Complete</AlertTitle>
                            <AlertDescription>
                              This address appears to be relatively safe based on available data. Always verify recipients before transacting.
                            </AlertDescription>
                          </>
                        )}
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Compliance Checklist</CardTitle>
                    <CardDescription>Regulatory compliance status overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {COMPLIANCE_ITEMS.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.status === 'compliant' ? (
                            <CheckCircle size={20} weight="fill" className="text-green-600" />
                          ) : item.status === 'pending_review' ? (
                            <Clock size={20} weight="fill" className="text-yellow-600" />
                          ) : (
                            <X size={20} weight="fill" className="text-red-600" />
                          )}
                          <div>
                            <div className="font-medium">{item.type}</div>
                            <div className="text-sm text-muted-foreground">{item.details}</div>
                          </div>
                        </div>
                        <Badge variant={
                          item.status === 'compliant' ? 'default' :
                          item.status === 'pending_review' ? 'secondary' : 'destructive'
                        }>
                          {item.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Regulatory Framework</CardTitle>
                    <CardDescription>Applicable regulations and standards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'FATF Travel Rule', status: 'active', region: 'Global' },
                      { name: 'MiCA Compliance', status: 'active', region: 'EU' },
                      { name: 'BSA/AML', status: 'active', region: 'US' },
                      { name: 'GDPR Data Protection', status: 'active', region: 'EU' },
                      { name: 'CCPA Privacy', status: 'active', region: 'California' },
                    ].map((reg, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe size={20} weight="duotone" className="text-primary" />
                          <div>
                            <div className="font-medium">{reg.name}</div>
                            <div className="text-sm text-muted-foreground">{reg.region}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Screening Results</CardTitle>
                  <CardDescription>Recent transactions screened for compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Screening Result</TableHead>
                        <TableHead>Flags</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: 'TX-001', amount: 5000, result: 'cleared', flags: 0, time: Date.now() - 30 * 60 * 1000 },
                        { id: 'TX-002', amount: 25000, result: 'flagged', flags: 2, time: Date.now() - 2 * 60 * 60 * 1000 },
                        { id: 'TX-003', amount: 1500, result: 'cleared', flags: 0, time: Date.now() - 4 * 60 * 60 * 1000 },
                        { id: 'TX-004', amount: 50000, result: 'review', flags: 1, time: Date.now() - 6 * 60 * 60 * 1000 },
                        { id: 'TX-005', amount: 3200, result: 'cleared', flags: 0, time: Date.now() - 12 * 60 * 60 * 1000 },
                      ].map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                          <TableCell>{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              tx.result === 'cleared' ? 'default' :
                              tx.result === 'flagged' ? 'destructive' : 'secondary'
                            }>
                              {tx.result.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {tx.flags > 0 ? (
                              <Badge variant="destructive">{tx.flags} flags</Badge>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatTimeAgo(tx.time)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alert Thresholds</CardTitle>
                    <CardDescription>Configure when alerts are triggered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Large Transaction Alert ($)</Label>
                      <Input type="number" defaultValue="10000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Risk Score Threshold</Label>
                      <Input type="number" defaultValue="60" />
                    </div>
                    <div className="space-y-2">
                      <Label>Velocity Alert (transactions/hour)</Label>
                      <Input type="number" defaultValue="10" />
                    </div>
                    <Button className="w-full">Save Thresholds</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notification Preferences</CardTitle>
                    <CardDescription>Choose how you receive alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Email Notifications', enabled: true },
                      { label: 'SMS Alerts (Critical Only)', enabled: true },
                      { label: 'Slack Integration', enabled: false },
                      { label: 'Webhook Notifications', enabled: false },
                      { label: 'Daily Digest', enabled: true },
                    ].map((pref, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{pref.label}</span>
                        <Badge variant={pref.enabled ? 'default' : 'secondary'}>
                          {pref.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Configure Notifications</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
