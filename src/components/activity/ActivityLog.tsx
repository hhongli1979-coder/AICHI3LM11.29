import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  MagnifyingGlass,
  Wallet,
  ArrowsLeftRight,
  User,
  ShieldCheck,
  Key,
  Warning,
  CheckCircle,
  Gear,
  Export,
  CaretDown,
  CaretUp,
  ClockCounterClockwise,
} from '@phosphor-icons/react';
import { formatTimeAgo } from '@/lib/mock-data';

type ActivityType = 
  | 'transaction_created'
  | 'transaction_signed'
  | 'transaction_executed'
  | 'wallet_created'
  | 'member_added'
  | 'member_removed'
  | 'settings_changed'
  | 'security_alert'
  | 'login'
  | 'api_key_created';

interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  actor: {
    name: string;
    email: string;
    role: string;
  };
  metadata?: Record<string, string | number>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'success' | 'error';
}

const MOCK_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    type: 'transaction_signed',
    title: 'Transaction Signed',
    description: 'Signed transaction tx-1 for Treasury Vault (5000 USDC)',
    actor: { name: 'John Admin', email: 'john@company.com', role: 'Owner' },
    metadata: { transactionId: 'tx-1', amount: 5000, token: 'USDC' },
    ipAddress: '192.168.1.100',
    timestamp: Date.now() - 15 * 60 * 1000,
    severity: 'success',
  },
  {
    id: 'act-2',
    type: 'security_alert',
    title: 'High Risk Transaction Detected',
    description: 'Large transfer to flagged address requires review',
    actor: { name: 'System', email: 'system@omnicore.io', role: 'System' },
    metadata: { transactionId: 'tx-3', riskScore: 85 },
    timestamp: Date.now() - 30 * 60 * 1000,
    severity: 'warning',
  },
  {
    id: 'act-3',
    type: 'transaction_created',
    title: 'Transaction Created',
    description: 'Created new transaction for 25000 USDT transfer',
    actor: { name: 'Alice Finance', email: 'alice@company.com', role: 'Admin' },
    metadata: { amount: 25000, token: 'USDT' },
    ipAddress: '10.0.0.50',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    severity: 'info',
  },
  {
    id: 'act-4',
    type: 'transaction_executed',
    title: 'Transaction Executed',
    description: 'Employee bonus payout completed successfully',
    actor: { name: 'System', email: 'system@omnicore.io', role: 'System' },
    metadata: { transactionId: 'tx-2', hash: '0xabcdef...' },
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    severity: 'success',
  },
  {
    id: 'act-5',
    type: 'member_added',
    title: 'Team Member Added',
    description: 'Added Bob Trader as Signer to the organization',
    actor: { name: 'John Admin', email: 'john@company.com', role: 'Owner' },
    metadata: { memberEmail: 'bob@company.com', role: 'Signer' },
    ipAddress: '192.168.1.100',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    severity: 'info',
  },
  {
    id: 'act-6',
    type: 'wallet_created',
    title: 'Wallet Created',
    description: 'Created new multi-sig wallet "DeFi Strategy Wallet" on Arbitrum',
    actor: { name: 'John Admin', email: 'john@company.com', role: 'Owner' },
    metadata: { walletName: 'DeFi Strategy Wallet', network: 'Arbitrum' },
    ipAddress: '192.168.1.100',
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    severity: 'success',
  },
  {
    id: 'act-7',
    type: 'settings_changed',
    title: 'Settings Updated',
    description: 'Changed transaction approval threshold from 1 to 2 signatures',
    actor: { name: 'John Admin', email: 'john@company.com', role: 'Owner' },
    metadata: { setting: 'requiredSignatures', oldValue: '1', newValue: '2' },
    ipAddress: '192.168.1.100',
    timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
    severity: 'info',
  },
  {
    id: 'act-8',
    type: 'login',
    title: 'User Login',
    description: 'Successful login from new device',
    actor: { name: 'Alice Finance', email: 'alice@company.com', role: 'Admin' },
    ipAddress: '203.0.113.42',
    userAgent: 'Chrome/119.0 on Windows',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    severity: 'info',
  },
  {
    id: 'act-9',
    type: 'api_key_created',
    title: 'API Key Created',
    description: 'Created new API key for payment integration',
    actor: { name: 'John Admin', email: 'john@company.com', role: 'Owner' },
    metadata: { keyName: 'Payment Gateway Integration', scope: 'payments:read,payments:write' },
    ipAddress: '192.168.1.100',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    severity: 'info',
  },
];

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case 'transaction_created':
    case 'transaction_signed':
    case 'transaction_executed':
      return <ArrowsLeftRight size={18} weight="duotone" />;
    case 'wallet_created':
      return <Wallet size={18} weight="duotone" />;
    case 'member_added':
    case 'member_removed':
      return <User size={18} weight="duotone" />;
    case 'settings_changed':
      return <Gear size={18} weight="duotone" />;
    case 'security_alert':
      return <Warning size={18} weight="duotone" />;
    case 'login':
      return <ShieldCheck size={18} weight="duotone" />;
    case 'api_key_created':
      return <Key size={18} weight="duotone" />;
    default:
      return <Clock size={18} weight="duotone" />;
  }
}

function getSeverityColor(severity: string): { bg: string; text: string; icon: React.ReactNode } {
  switch (severity) {
    case 'success':
      return { 
        bg: 'bg-green-100 border-green-200', 
        text: 'text-green-700',
        icon: <CheckCircle size={16} weight="fill" className="text-green-600" />
      };
    case 'warning':
      return { 
        bg: 'bg-amber-100 border-amber-200', 
        text: 'text-amber-700',
        icon: <Warning size={16} weight="fill" className="text-amber-600" />
      };
    case 'error':
      return { 
        bg: 'bg-red-100 border-red-200', 
        text: 'text-red-700',
        icon: <Warning size={16} weight="fill" className="text-red-600" />
      };
    default:
      return { 
        bg: 'bg-blue-50 border-blue-100', 
        text: 'text-blue-700',
        icon: null
      };
  }
}

function ActivityItem({ activity, expanded, onToggle }: { 
  activity: ActivityEvent; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const severity = getSeverityColor(activity.severity);

  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${severity.bg}`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-background border ${severity.text}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{activity.title}</span>
            {severity.icon}
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(activity.timestamp)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{activity.description}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {activity.actor.name}
            </Badge>
            {activity.actor.role !== 'System' && (
              <span>•</span>
            )}
            {activity.actor.role !== 'System' && (
              <span>{activity.actor.role}</span>
            )}
          </div>
          
          {expanded && (
            <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
              {activity.ipAddress && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono">{activity.ipAddress}</span>
                </div>
              )}
              {activity.userAgent && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">User Agent</span>
                  <span>{activity.userAgent}</span>
                </div>
              )}
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground font-medium">Metadata</div>
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Event ID</span>
                <span className="font-mono">{activity.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Timestamp</span>
                <span>{new Date(activity.timestamp).toISOString()}</span>
              </div>
            </div>
          )}
        </div>
        <div className="text-muted-foreground">
          {expanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </div>
      </div>
    </div>
  );
}

function ActivityStats({ activities }: { activities: ActivityEvent[] }) {
  const today = activities.filter(a => 
    Date.now() - a.timestamp < 24 * 60 * 60 * 1000
  ).length;
  const warnings = activities.filter(a => a.severity === 'warning').length;
  const transactions = activities.filter(a => 
    a.type.startsWith('transaction_')
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Clock size={18} weight="duotone" />
            Today's Activity
          </div>
          <div className="text-2xl font-bold">{today}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <ArrowsLeftRight size={18} weight="duotone" />
            Transactions
          </div>
          <div className="text-2xl font-bold">{transactions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Warning size={18} weight="duotone" />
            Alerts
          </div>
          <div className="text-2xl font-bold text-amber-600">{warnings}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <ClockCounterClockwise size={18} weight="duotone" />
            Total Events
          </div>
          <div className="text-2xl font-bold">{activities.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ActivityLog() {
  const [activities] = useState<ActivityEvent[]>(MOCK_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.actor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || activity.severity === severityFilter;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleExport = () => {
    const data = JSON.stringify(filteredActivities, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Activity Log</h2>
          <p className="text-muted-foreground">Complete audit trail of all platform activities</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Export size={18} weight="bold" />
          Export
        </Button>
      </div>

      <ActivityStats activities={activities} />

      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
          <CardDescription>
            Browse and search through all recorded activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transaction_created">Transaction Created</SelectItem>
                <SelectItem value="transaction_signed">Transaction Signed</SelectItem>
                <SelectItem value="transaction_executed">Transaction Executed</SelectItem>
                <SelectItem value="wallet_created">Wallet Created</SelectItem>
                <SelectItem value="member_added">Member Added</SelectItem>
                <SelectItem value="settings_changed">Settings Changed</SelectItem>
                <SelectItem value="security_alert">Security Alert</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity List */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 pr-4">
              {filteredActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  expanded={expandedId === activity.id}
                  onToggle={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                />
              ))}
              {filteredActivities.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <ClockCounterClockwise size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                  <p>No activities found matching your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
