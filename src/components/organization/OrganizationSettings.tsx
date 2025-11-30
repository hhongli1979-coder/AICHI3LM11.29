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
import { Users, Plus, Trash, Shield, Envelope, Crown, Eye, PencilSimple } from '@phosphor-icons/react';
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
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

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgWebsite">Website</Label>
                  <Input id="orgWebsite" placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Description</Label>
                  <Input id="orgDescription" placeholder="Brief description of your organization" />
                </div>
                <Button>Save Changes</Button>
              </div>
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
