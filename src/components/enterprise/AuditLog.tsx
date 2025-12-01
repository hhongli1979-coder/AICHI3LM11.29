import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ClockCounterClockwise, 
  MagnifyingGlass,
  DownloadSimple,
  Funnel,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Wallet,
  ShieldCheck,
  Gear,
  ChartLine
} from '@phosphor-icons/react';
import type { AuditLogEntry } from '@/lib/types';
import { formatTimeAgo } from '@/lib/mock-data';

interface AuditLogProps {
  entries: AuditLogEntry[];
}

export function AuditLog({ entries }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction': return <ChartLine size={14} weight="duotone" className="text-blue-500" />;
      case 'wallet': return <Wallet size={14} weight="duotone" className="text-purple-500" />;
      case 'user': return <User size={14} weight="duotone" className="text-green-500" />;
      case 'security': return <ShieldCheck size={14} weight="duotone" className="text-red-500" />;
      case 'settings': return <Gear size={14} weight="duotone" className="text-gray-500" />;
      case 'defi': return <ChartLine size={14} weight="duotone" className="text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': 
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle size={12} weight="fill" />
            Success
          </Badge>
        );
      case 'failed': 
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <XCircle size={12} weight="fill" />
            Failed
          </Badge>
        );
      case 'pending': 
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
            <Clock size={12} weight="fill" />
            Pending
          </Badge>
        );
      default: return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      owner: 'bg-yellow-100 text-yellow-700',
      admin: 'bg-blue-100 text-blue-700',
      signer: 'bg-green-100 text-green-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    return (
      <Badge className={`text-xs ${roleColors[role] || 'bg-gray-100'}`}>
        {role}
      </Badge>
    );
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Category', 'Actor', 'Role', 'Details', 'IP Address', 'Status'].join(','),
      ...filteredEntries.map(entry => [
        new Date(entry.timestamp).toISOString(),
        entry.action,
        entry.category,
        entry.actor,
        entry.actorRole,
        `"${entry.details}"`,
        entry.ipAddress,
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate stats
  const totalActions = entries.length;
  const successfulActions = entries.filter(e => e.status === 'success').length;
  const failedActions = entries.filter(e => e.status === 'failed').length;
  const uniqueActors = new Set(entries.map(e => e.actor)).size;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulActions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedActions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{uniqueActors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClockCounterClockwise size={24} weight="duotone" className="text-primary" />
                Activity Audit Log
              </CardTitle>
              <CardDescription>
                Complete audit trail of all platform activities for compliance and security
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <DownloadSimple size={16} weight="bold" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search actions, users, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <Funnel size={16} className="mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="w-[100px]">Category</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead className="w-[120px]">IP Address</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No audit entries found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-muted/50">
                      <TableCell className="text-sm">
                        <div className="font-medium">{formatTimeAgo(entry.timestamp)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {entry.details}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(entry.category)}
                          <span className="text-sm capitalize">{entry.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{entry.actor}</div>
                          {getRoleBadge(entry.actorRole)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.ipAddress}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(entry.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredEntries.length} of {entries.length} entries</span>
            <span>Log retention: 90 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
