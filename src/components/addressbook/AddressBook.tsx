import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressBook as AddressBookIcon, Plus, Trash, MagnifyingGlass, User, Star } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatAddress, NETWORKS } from '@/lib/mock-data';
import type { BlockchainNetwork } from '@/lib/types';

interface Contact {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  tags: string[];
  isFavorite: boolean;
  notes?: string;
  createdAt: number;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Exchange Hot Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    network: 'ethereum',
    tags: ['exchange', 'trusted'],
    isFavorite: true,
    notes: 'Binance hot wallet for withdrawals',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'contact-2',
    name: 'Treasury Cold Storage',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    network: 'ethereum',
    tags: ['internal', 'cold-storage'],
    isFavorite: true,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'contact-3',
    name: 'Supplier Payment Address',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    network: 'polygon',
    tags: ['vendor'],
    isFavorite: false,
    notes: 'Monthly service payments',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'contact-4',
    name: 'DeFi Protocol',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    network: 'ethereum',
    tags: ['defi', 'aave'],
    isFavorite: false,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
];

export function AddressBook() {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // New contact form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNetwork, setNewNetwork] = useState<BlockchainNetwork>('ethereum');
  const [newNotes, setNewNotes] = useState('');

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = filterTag === 'all' || 
      (filterTag === 'favorites' && contact.isFavorite) ||
      contact.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  const handleAddContact = () => {
    if (!newName || !newAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newAddress.startsWith('0x') || newAddress.length !== 42) {
      toast.error('Invalid address format');
      return;
    }

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newName,
      address: newAddress,
      network: newNetwork,
      tags: [],
      isFavorite: false,
      notes: newNotes,
      createdAt: Date.now(),
    };

    setContacts([newContact, ...contacts]);
    toast.success('Contact added successfully');
    
    // Reset form
    setNewName('');
    setNewAddress('');
    setNewNetwork('ethereum');
    setNewNotes('');
    setAddDialogOpen(false);
  };

  const handleDeleteContact = (contactId: string, contactName: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
    toast.success(`${contactName} removed from address book`);
  };

  const handleToggleFavorite = (contactId: string) => {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Address Book</CardTitle>
              <CardDescription>Manage your frequently used addresses</CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} weight="bold" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                  <DialogDescription>
                    Save an address for quick access in future transactions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Exchange Wallet"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="0x..."
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <Select value={newNetwork} onValueChange={(v) => setNewNetwork(v as BlockchainNetwork)}>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Add any notes..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleAddContact}>
                      Add Contact
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="favorites">⭐ Favorites</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contacts List */}
          <div className="space-y-2">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AddressBookIcon size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                <p>No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const network = NETWORKS[contact.network];
                return (
                  <div
                    key={contact.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <User size={20} weight="duotone" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{contact.name}</h4>
                            {contact.isFavorite && (
                              <Star size={16} weight="fill" className="text-yellow-500" />
                            )}
                          </div>
                          <div 
                            className="font-mono text-sm text-muted-foreground mb-2 cursor-pointer hover:text-foreground"
                            onClick={() => handleCopyAddress(contact.address)}
                          >
                            {formatAddress(contact.address, 10)}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" style={{ borderColor: network.color, color: network.color }}>
                              {network.icon} {network.name}
                            </Badge>
                            {contact.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {contact.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{contact.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(contact.id)}
                        >
                          <Star 
                            size={18} 
                            weight={contact.isFavorite ? 'fill' : 'regular'}
                            className={contact.isFavorite ? 'text-yellow-500' : ''}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{contacts.length}</div>
              <div className="text-sm text-muted-foreground">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{contacts.filter(c => c.isFavorite).length}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{allTags.length}</div>
              <div className="text-sm text-muted-foreground">Tags</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
