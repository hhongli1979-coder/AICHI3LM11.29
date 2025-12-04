import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck,
  ShieldWarning,
  Lock,
  Key,
  Eye,
  Warning,
  CheckCircle,
  Clock,
  Globe,
  Fingerprint,
  DeviceMobile,
  ListChecks,
  ArrowRight,
  X,
  Gear,
} from '@phosphor-icons/react';
import { formatTimeAgo } from '@/lib/mock-data';
import { toast } from 'sonner';

interface SecurityScore {
  overall: number;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    status: 'good' | 'warning' | 'critical';
    recommendation?: string;
  }[];
}

interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'high_risk_tx' | 'api_abuse' | 'policy_violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  resolved: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'authentication' | 'transactions' | 'api' | 'notifications';
}

const MOCK_SECURITY_SCORE: SecurityScore = {
  overall: 85,
  factors: [
    { name: 'Multi-Factor Auth', score: 100, maxScore: 100, status: 'good' },
    { name: 'API Security', score: 80, maxScore: 100, status: 'good' },
    { name: 'Transaction Policies', score: 90, maxScore: 100, status: 'good' },
    { name: 'Key Management', score: 75, maxScore: 100, status: 'warning', recommendation: 'Consider enabling hardware wallet signing' },
    { name: 'Access Control', score: 85, maxScore: 100, status: 'good' },
    { name: 'Audit Logging', score: 100, maxScore: 100, status: 'good' },
  ],
};

const MOCK_ALERTS: SecurityAlert[] = [
  {
    id: 'alert-1',
    type: 'high_risk_tx',
    title: 'High Risk Transaction Detected',
    description: 'Large transfer to flagged address (tx-3) requires immediate review',
    severity: 'high',
    timestamp: Date.now() - 15 * 60 * 1000,
    resolved: false,
  },
  {
    id: 'alert-2',
    type: 'suspicious_login',
    title: 'Unusual Login Location',
    description: 'Login attempt from new location: Singapore. Device: iPhone 15',
    severity: 'medium',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    resolved: true,
  },
  {
    id: 'alert-3',
    type: 'api_abuse',
    title: 'API Rate Limit Warning',
    description: 'API key "Payment Integration" approaching rate limits',
    severity: 'low',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    resolved: false,
  },
];

const MOCK_SETTINGS: SecuritySetting[] = [
  {
    id: 'set-1',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all account access',
    enabled: true,
    category: 'authentication',
  },
  {
    id: 'set-2',
    name: 'Hardware Wallet Required',
    description: 'Require hardware wallet for transaction signing',
    enabled: false,
    category: 'authentication',
  },
  {
    id: 'set-3',
    name: 'Transaction Amount Limits',
    description: 'Set daily/weekly transaction limits',
    enabled: true,
    category: 'transactions',
  },
  {
    id: 'set-4',
    name: 'Time-Lock for Large Transfers',
    description: 'Add 24-hour delay for transfers over $50,000',
    enabled: true,
    category: 'transactions',
  },
  {
    id: 'set-5',
    name: 'Address Whitelist',
    description: 'Only allow transfers to whitelisted addresses',
    enabled: false,
    category: 'transactions',
  },
  {
    id: 'set-6',
    name: 'API IP Restrictions',
    description: 'Restrict API access to specific IP addresses',
    enabled: true,
    category: 'api',
  },
  {
    id: 'set-7',
    name: 'Security Alert Emails',
    description: 'Receive email notifications for security events',
    enabled: true,
    category: 'notifications',
  },
  {
    id: 'set-8',
    name: 'Login Notifications',
    description: 'Get notified of new login sessions',
    enabled: true,
    category: 'notifications',
  },
];

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-green-500 to-green-600';
  if (score >= 60) return 'from-yellow-500 to-yellow-600';
  return 'from-red-500 to-red-600';
}

function getSeverityColor(severity: string): { bg: string; text: string } {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-red-100', text: 'text-red-700' };
    case 'high':
      return { bg: 'bg-orange-100', text: 'text-orange-700' };
    case 'medium':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    default:
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
  }
}

function SecurityScoreCard({ score }: { score: SecurityScore }) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={24} weight="duotone" className="text-primary" />
          Security Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                fill="transparent"
                r="52"
                cx="64"
                cy="64"
              />
              <circle
                className={`stroke-current ${getScoreColor(score.overall)}`}
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="52"
                cx="64"
                cy="64"
                strokeDasharray={`${(score.overall / 100) * 327} 327`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {score.factors.map((factor) => (
              <div key={factor.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    {factor.status === 'good' && <CheckCircle size={14} weight="fill" className="text-green-600" />}
                    {factor.status === 'warning' && <Warning size={14} weight="fill" className="text-yellow-600" />}
                    {factor.status === 'critical' && <ShieldWarning size={14} weight="fill" className="text-red-600" />}
                    {factor.name}
                  </span>
                  <span className="font-medium">{factor.score}%</span>
                </div>
                <Progress value={factor.score} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityAlertCard({ alert, onResolve }: { alert: SecurityAlert; onResolve: (id: string) => void }) {
  const severity = getSeverityColor(alert.severity);

  return (
    <div className={`p-4 rounded-lg border ${alert.resolved ? 'opacity-60' : ''} ${severity.bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-background ${severity.text}`}>
            {alert.severity === 'critical' || alert.severity === 'high' ? (
              <ShieldWarning size={20} weight="fill" />
            ) : (
              <Warning size={20} weight="duotone" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{alert.title}</span>
              <Badge variant="outline" className={`text-xs ${severity.text}`}>
                {alert.severity.toUpperCase()}
              </Badge>
              {alert.resolved && (
                <Badge variant="secondary" className="text-xs">Resolved</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock size={12} />
              {formatTimeAgo(alert.timestamp)}
            </div>
          </div>
        </div>
        {!alert.resolved && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onResolve(alert.id)}
            >
              <CheckCircle size={14} className="mr-1" />
              Resolve
            </Button>
            <Button variant="outline" size="sm">
              <Eye size={14} className="mr-1" />
              View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SecuritySettingItem({ setting, onToggle }: { 
  setting: SecuritySetting; 
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="space-y-0.5">
        <div className="font-medium">{setting.name}</div>
        <div className="text-sm text-muted-foreground">{setting.description}</div>
      </div>
      <Switch
        checked={setting.enabled}
        onCheckedChange={() => onToggle(setting.id)}
      />
    </div>
  );
}

export function SecurityDashboard() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(MOCK_ALERTS);
  const [settings, setSettings] = useState<SecuritySetting[]>(MOCK_SETTINGS);

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, resolved: true } : a
    ));
    toast.success('Alert resolved');
  };

  const handleToggleSetting = (id: string) => {
    setSettings(settings.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
    toast.success('Setting updated');
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const authSettings = settings.filter(s => s.category === 'authentication');
  const txSettings = settings.filter(s => s.category === 'transactions');
  const apiSettings = settings.filter(s => s.category === 'api');
  const notifSettings = settings.filter(s => s.category === 'notifications');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Security Center</h2>
          <p className="text-muted-foreground">Monitor and manage your platform security</p>
        </div>
        {activeAlerts.length > 0 && (
          <Badge variant="destructive" className="gap-1">
            <Warning size={14} weight="fill" />
            {activeAlerts.length} Active Alerts
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SecurityScoreCard score={MOCK_SECURITY_SCORE} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} weight="duotone" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Key size={24} weight="duotone" />
                <span>Rotate API Keys</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <DeviceMobile size={24} weight="duotone" />
                <span>Manage Devices</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Globe size={24} weight="duotone" />
                <span>IP Whitelist</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Fingerprint size={24} weight="duotone" />
                <span>Biometric Setup</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts" className="gap-2">
            <Warning size={18} weight="duotone" />
            Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Gear size={18} weight="duotone" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2">
            <ListChecks size={18} weight="duotone" />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Review and respond to security events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <SecurityAlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolveAlert}
                />
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShieldCheck size={48} weight="duotone" className="mx-auto mb-4 text-green-600" />
                  <p>No security alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock size={20} weight="duotone" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {authSettings.map((setting) => (
                  <SecuritySettingItem
                    key={setting.id}
                    setting={setting}
                    onToggle={handleToggleSetting}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight size={20} weight="duotone" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {txSettings.map((setting) => (
                  <SecuritySettingItem
                    key={setting.id}
                    setting={setting}
                    onToggle={handleToggleSetting}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key size={20} weight="duotone" />
                  API Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {apiSettings.map((setting) => (
                  <SecuritySettingItem
                    key={setting.id}
                    setting={setting}
                    onToggle={handleToggleSetting}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye size={20} weight="duotone" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notifSettings.map((setting) => (
                  <SecuritySettingItem
                    key={setting.id}
                    setting={setting}
                    onToggle={handleToggleSetting}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Policies</CardTitle>
              <CardDescription>
                Configure automated rules for transaction approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Daily Transaction Limit</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum $100,000 per day across all wallets
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Large Transfer Approval</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transfers over $50,000 require 2/3 signatures and 24-hour time lock
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">New Address Verification</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    First-time transfers to new addresses require additional confirmation
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Weekend Transfer Block</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Block large transfers during weekends and holidays
                  </p>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                <ListChecks size={18} className="mr-2" />
                Add New Policy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
