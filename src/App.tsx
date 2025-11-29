import { useState } from 'react';
import { Toaster } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Wallet, ChartLine, CreditCard, ArrowsLeftRight, Coins, Gear, AddressBook as AddressBookIcon } from '@phosphor-icons/react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { WalletCard } from '@/components/wallet/WalletCard';
import { CreateWalletDialog } from '@/components/wallet/CreateWalletDialog';
import { TransactionList } from '@/components/transaction/TransactionList';
import { DeFiPositions } from '@/components/defi/DeFiPositions';
import { OmniTokenDashboard } from '@/components/token/OmniTokenDashboard';
import { OrganizationSettings } from '@/components/organization/OrganizationSettings';
import { AddressBook } from '@/components/addressbook/AddressBook';
import {
  generateMockWallets,
  generateMockTransactions,
  generateMockDeFiPositions,
  generateMockOmniStats,
  generateMockNotifications,
} from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatTimeAgo } from '@/lib/mock-data';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [createWalletOpen, setCreateWalletOpen] = useState(false);
  const wallets = generateMockWallets();
  const transactions = generateMockTransactions();
  const defiPositions = generateMockDeFiPositions();
  const omniStats = generateMockOmniStats();
  const notifications = generateMockNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const totalAssets = wallets.reduce((sum, wallet) => {
    const balance = parseFloat(wallet.balance.usd.replace(/,/g, ''));
    return sum + balance;
  }, 0);
  
  const defiValue = defiPositions.reduce((sum, pos) => sum + parseFloat(pos.valueUsd), 0);
  const totalValue = totalAssets + defiValue;
  const averageApy = defiPositions.reduce((sum, pos) => {
    const weight = parseFloat(pos.valueUsd) / defiValue;
    return sum + (pos.apy * weight);
  }, 0);
  
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
              Ω
            </div>
            <div>
              <h1 className="text-xl font-bold">OmniCore Wallet</h1>
              <p className="text-xs text-muted-foreground">Enterprise Smart Wallet Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell size={18} weight="duotone" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-3">
                  <div className="font-semibold">Notifications</div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border ${notif.read ? 'bg-background' : 'bg-accent/5'}`}
                    >
                      <div className="font-medium text-sm">{notif.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{notif.message}</div>
                      <div className="text-xs text-muted-foreground mt-2">{formatTimeAgo(notif.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm">
              <Gear size={18} weight="duotone" />
            </Button>
            
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                A
              </div>
              <div className="text-sm">
                <div className="font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">Owner</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid lg:grid-cols-8">
            <TabsTrigger value="overview" className="gap-2">
              <ChartLine size={18} weight="duotone" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="wallets" className="gap-2">
              <Wallet size={18} weight="duotone" />
              <span className="hidden sm:inline">Wallets</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <ArrowsLeftRight size={18} weight="duotone" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="defi" className="gap-2">
              <ChartLine size={18} weight="duotone" />
              <span className="hidden sm:inline">DeFi</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard size={18} weight="duotone" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="omni" className="gap-2">
              <Coins size={18} weight="duotone" />
              <span className="hidden sm:inline">OMNI</span>
            </TabsTrigger>
            <TabsTrigger value="addressbook" className="gap-2">
              <AddressBookIcon size={18} weight="duotone" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear size={18} weight="duotone" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <DashboardStats
              totalValue={totalValue}
              walletCount={wallets.length}
              monthlyVolume={234567}
              defiYield={averageApy}
            />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Wallets</h2>
                  <div className="space-y-4">
                    {wallets.slice(0, 2).map((wallet) => (
                      <WalletCard key={wallet.id} wallet={wallet} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <TransactionList transactions={transactions.slice(0, 3)} />
              </div>
            </div>
            
            <DeFiPositions positions={defiPositions} />
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Wallets</h2>
              <Button className="gap-2" onClick={() => setCreateWalletOpen(true)}>
                <Wallet size={18} weight="bold" />
                Create Wallet
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Transactions</h2>
              <Button className="gap-2">
                <ArrowsLeftRight size={18} weight="bold" />
                New Transaction
              </Button>
            </div>
            
            <TransactionList transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="defi" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">DeFi Positions</h2>
              <Button className="gap-2">
                <ChartLine size={18} weight="bold" />
                New Strategy
              </Button>
            </div>
            
            <DeFiPositions positions={defiPositions} />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Payment Gateway</h2>
              <Button className="gap-2">
                <CreditCard size={18} weight="bold" />
                Create Payment Link
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <CreditCard size={48} weight="duotone" className="mx-auto mb-4 text-primary" />
                <p>Accept payments via crypto, credit cards, Alipay, WeChat Pay, and UnionPay</p>
                <Button className="mt-4">Set Up Payment Gateway</Button>
              </div>
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <Coins size={48} weight="duotone" className="mx-auto mb-4 text-accent" />
                <p>Create payment links and QR codes for instant settlements</p>
                <Button variant="outline" className="mt-4">View Documentation</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="omni" className="space-y-6">
            <OmniTokenDashboard stats={omniStats} />
          </TabsContent>
          
          <TabsContent value="addressbook" className="space-y-6">
            <AddressBook />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <OrganizationSettings />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>OmniCore Wallet - Enterprise Smart Wallet Platform | Powered by blockchain technology</p>
          <p className="mt-2">Multi-chain support • Multi-signature security • DeFi integration • Global payments</p>
        </div>
      </footer>

      <CreateWalletDialog
        open={createWalletOpen}
        onOpenChange={setCreateWalletOpen}
      />
    </div>
  );
}

export default App;