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
  Users, 
  Plus, 
  Trash, 
  Shield, 
  Envelope, 
  Crown, 
  Eye, 
  PencilSimple,
  Key,
  Lock,
  Globe,
  Clock,
  FileText,
  CheckCircle,
  Warning,
  Copy,
  Lightning,
  Gear,
  ShieldCheck,
  DeviceMobile,
  Desktop,
  MapPin
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatTimeAgo } from '@/lib/mock-data';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'signer' | 'viewer';
  joinedAt: number;
  lastActive: number;
}

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Admin User',
    email: 'admin@omnicore.io',
    role: 'owner',
    joinedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    lastActive: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 'member-2',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'admin',
    joinedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    lastActive: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    id: 'member-3',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'signer',
    joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastActive: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: 'member-4',
    name: 'Mike Wilson',
    email: 'mike@company.com',
    role: 'viewer',
    joinedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    lastActive: Date.now() - 24 * 60 * 60 * 1000,
  },
];

export function OrganizationSettings() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('signer');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown size={16} weight="fill" className="text-yellow-600" />;
      case 'admin': return <Shield size={16} weight="fill" className="text-blue-600" />;
      case 'signer': return <PencilSimple size={16} weight="fill" className="text-green-600" />;
      case 'viewer': return <Eye size={16} weight="fill" className="text-gray-600" />;
      default: return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'secondary';
      default: return 'outline';
    }
  };

  const handleInviteMember = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    toast.success('Invitation sent', {
      description: `An invitation has been sent to ${inviteEmail}`
    });

    setInviteEmail('');
    setInviteDialogOpen(false);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (memberId === 'member-1') {
      toast.error('Cannot remove the organization owner');
      return;
    }

    toast.success(`${memberName} has been removed from the organization`);
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole as any } : m
    ));
    toast.success('Member role updated successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Manage your organization and team members</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Professional Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="team" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Team Members Tab */}
            <TabsContent value="team" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <p className="text-sm text-muted-foreground">
                    {members.length} members in your organization
                  </p>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus size={16} weight="bold" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join your organization
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="colleague@company.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger id="role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin - Full access except billing</SelectItem>
                            <SelectItem value="signer">Signer - Can sign transactions</SelectItem>
                            <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="flex-1 gap-2" onClick={handleInviteMember}>
                          <Envelope size={16} weight="bold" />
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1.5">
                            {getRoleIcon(member.role)}
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimeAgo(member.joinedAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimeAgo(member.lastActive)}
                        </TableCell>
                        <TableCell className="text-right">
                          {member.role !== 'owner' && (
                            <div className="flex items-center justify-end gap-2">
                              <Select
                                value={member.role}
                                onValueChange={(value) => handleChangeRole(member.id, value)}
                              >
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="signer">Signer</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleRemoveMember(member.id, member.name)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Role Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Crown size={16} weight="fill" className="text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Owner</div>
                      <div className="text-muted-foreground">Full access to all features including billing</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Shield size={16} weight="fill" className="text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-muted-foreground">Manage wallets, transactions, and team members</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <PencilSimple size={16} weight="fill" className="text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Signer</div>
                      <div className="text-muted-foreground">Sign transactions and view wallets</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Eye size={16} weight="fill" className="text-gray-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Viewer</div>
                      <div className="text-muted-foreground">Read-only access to all data</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck size={20} weight="duotone" className="text-primary" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>Add an extra layer of security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={20} weight="fill" className="text-green-600" />
                        <div>
                          <div className="font-medium">2FA Enabled</div>
                          <div className="text-sm text-muted-foreground">Using Authenticator App</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Backup Options</div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <DeviceMobile size={18} />
                          <span className="text-sm">SMS Backup</span>
                        </div>
                        <Badge>Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Key size={18} />
                          <span className="text-sm">Recovery Codes</span>
                        </div>
                        <Button variant="ghost" size="sm">Generate New</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe size={20} weight="duotone" className="text-primary" />
                      IP Whitelist
                    </CardTitle>
                    <CardDescription>Restrict access to specific IP addresses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-mono text-sm">192.168.1.0/24</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-mono text-sm">10.0.0.0/8</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash size={16} />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Enter IP address or CIDR range" />
                      <Button>Add</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lock size={20} weight="duotone" className="text-primary" />
                      Session Security
                    </CardTitle>
                    <CardDescription>Manage active sessions and security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Session Timeout</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Active Sessions</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-center gap-3">
                            <Desktop size={18} className="text-green-600" />
                            <div>
                              <div className="text-sm font-medium">Current Session</div>
                              <div className="text-xs text-muted-foreground">Chrome · San Francisco, CA</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-300">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <DeviceMobile size={18} />
                            <div>
                              <div className="text-sm font-medium">iPhone 15 Pro</div>
                              <div className="text-xs text-muted-foreground">iOS App · 2 hours ago</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">Revoke All Other Sessions</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Warning size={20} weight="duotone" className="text-yellow-600" />
                      Transaction Security
                    </CardTitle>
                    <CardDescription>Configure transaction approval requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Require 2FA for transactions above</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">All transactions</SelectItem>
                          <SelectItem value="100">$100</SelectItem>
                          <SelectItem value="1000">$1,000</SelectItem>
                          <SelectItem value="10000">$10,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time-lock for large transactions</Label>
                      <Select defaultValue="24">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No delay</SelectItem>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="48">48 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Save Security Settings</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Key size={20} weight="duotone" className="text-primary" />
                        API Keys
                      </CardTitle>
                      <CardDescription>Manage API keys for programmatic access</CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Plus size={16} weight="bold" />
                      Generate New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { 
                          name: 'Production API', 
                          key: 'sk_live_••••••••OmNi', 
                          permissions: ['read', 'write'], 
                          created: Date.now() - 90 * 24 * 60 * 60 * 1000,
                          lastUsed: Date.now() - 5 * 60 * 1000 
                        },
                        { 
                          name: 'Read-Only Analytics', 
                          key: 'sk_live_••••••••AnLy', 
                          permissions: ['read'], 
                          created: Date.now() - 30 * 24 * 60 * 60 * 1000,
                          lastUsed: Date.now() - 2 * 60 * 60 * 1000 
                        },
                        { 
                          name: 'Webhook Integration', 
                          key: 'sk_live_••••••••WbHk', 
                          permissions: ['read', 'webhook'], 
                          created: Date.now() - 7 * 24 * 60 * 60 * 1000,
                          lastUsed: Date.now() - 30 * 60 * 1000 
                        },
                      ].map((apiKey, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{apiKey.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="text-sm">{apiKey.key}</code>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy size={14} />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {apiKey.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatTimeAgo(apiKey.created)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatTimeAgo(apiKey.lastUsed)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Webhook Endpoints</CardTitle>
                  <CardDescription>Configure webhooks to receive real-time events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">https://api.example.com/webhooks/omnicore</div>
                      <div className="text-sm text-muted-foreground">
                        Events: transaction.completed, transaction.failed, payment.received
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-300">Active</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus size={16} />
                    Add Webhook Endpoint
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Logs Tab */}
            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText size={20} weight="duotone" className="text-primary" />
                        Audit Logs
                      </CardTitle>
                      <CardDescription>Track all actions and changes in your organization</CardDescription>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Lightning size={16} />
                      Export Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        action: 'Transaction Signed', 
                        user: 'admin@omnicore.io', 
                        details: 'Signed transaction TX-001 for 5,000 USDC',
                        ip: '192.168.1.100',
                        time: Date.now() - 15 * 60 * 1000,
                        type: 'transaction'
                      },
                      { 
                        action: 'API Key Generated', 
                        user: 'admin@omnicore.io', 
                        details: 'Created new API key "Webhook Integration"',
                        ip: '192.168.1.100',
                        time: Date.now() - 2 * 60 * 60 * 1000,
                        type: 'security'
                      },
                      { 
                        action: 'Team Member Invited', 
                        user: 'admin@omnicore.io', 
                        details: 'Invited sarah@company.com as Signer',
                        ip: '192.168.1.100',
                        time: Date.now() - 4 * 60 * 60 * 1000,
                        type: 'team'
                      },
                      { 
                        action: 'Wallet Created', 
                        user: 'john@company.com', 
                        details: 'Created multi-sig wallet "DeFi Strategy"',
                        ip: '10.0.0.50',
                        time: Date.now() - 6 * 60 * 60 * 1000,
                        type: 'wallet'
                      },
                      { 
                        action: 'Security Settings Updated', 
                        user: 'admin@omnicore.io', 
                        details: 'Enabled 2FA requirement for all transactions above $10,000',
                        ip: '192.168.1.100',
                        time: Date.now() - 12 * 60 * 60 * 1000,
                        type: 'security'
                      },
                      { 
                        action: 'Role Changed', 
                        user: 'admin@omnicore.io', 
                        details: 'Changed Mike Wilson role from Viewer to Signer',
                        ip: '192.168.1.100',
                        time: Date.now() - 24 * 60 * 60 * 1000,
                        type: 'team'
                      },
                      { 
                        action: 'Login Success', 
                        user: 'sarah@company.com', 
                        details: 'Logged in from Chrome on Windows',
                        ip: '10.0.0.75',
                        time: Date.now() - 2 * 24 * 60 * 60 * 1000,
                        type: 'auth'
                      },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-lg ${
                          log.type === 'transaction' ? 'bg-blue-100' :
                          log.type === 'security' ? 'bg-yellow-100' :
                          log.type === 'team' ? 'bg-green-100' :
                          log.type === 'wallet' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {log.type === 'transaction' && <Lightning size={18} className="text-blue-600" />}
                          {log.type === 'security' && <Shield size={18} className="text-yellow-600" />}
                          {log.type === 'team' && <Users size={18} className="text-green-600" />}
                          {log.type === 'wallet' && <Key size={18} className="text-purple-600" />}
                          {log.type === 'auth' && <Lock size={18} className="text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{log.action}</span>
                            <Badge variant="outline" className="text-xs">{log.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Envelope size={12} />
                              {log.user}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {log.ip}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTimeAgo(log.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Professional Plan - $99/month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallets</span>
                      <span className="font-medium">Unlimited</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Team Members</span>
                      <span className="font-medium">Up to 10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>API Calls</span>
                      <span className="font-medium">100,000/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Support</span>
                      <span className="font-medium">Priority Email</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Upgrade to Enterprise</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
