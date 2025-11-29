import { useState } from 'react';
import { Toaster } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Wallet, ChartLine, CreditCard, ArrowsLeftRight, Coins, Gear, AddressBook as AddressBookIcon, Crown, Lightning } from '@phosphor-icons/react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Enhanced Header with Glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            {/* Enhanced Logo */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30 transition-transform hover:scale-105">
                Ω
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <Lightning size={10} weight="fill" className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">OmniCore Wallet</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Enterprise Smart Wallet Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Bell size={18} weight="duotone" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-white shadow-lg animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 border-0 shadow-2xl" align="end">
                <div className="space-y-3">
                  <div className="font-bold text-lg flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer ${notif.read ? 'bg-background' : 'bg-gradient-to-r from-blue-50/50 to-violet-50/50 border-blue-100'}`}
                      >
                        <div className="font-semibold text-sm">{notif.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{notif.message}</div>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                          {formatTimeAgo(notif.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Gear size={18} weight="duotone" />
            </Button>
            
            {/* Enhanced User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l-2 border-slate-200">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  A
                </div>
                <Crown size={14} weight="fill" className="absolute -top-1 -right-1 text-amber-500" />
              </div>
              <div className="text-sm">
                <div className="font-bold">Admin</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <TabsList className="enterprise-tabs-list grid w-full grid-cols-4 lg:w-auto lg:inline-grid lg:grid-cols-8">
            <TabsTrigger value="overview" className="enterprise-tab">
              <ChartLine size={18} weight="duotone" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="wallets" className="enterprise-tab">
              <Wallet size={18} weight="duotone" />
              <span className="hidden sm:inline">Wallets</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="enterprise-tab">
              <ArrowsLeftRight size={18} weight="duotone" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="defi" className="enterprise-tab">
              <ChartLine size={18} weight="duotone" />
              <span className="hidden sm:inline">DeFi</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="enterprise-tab">
              <CreditCard size={18} weight="duotone" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="omni" className="enterprise-tab">
              <Coins size={18} weight="duotone" />
              <span className="hidden sm:inline">OMNI</span>
            </TabsTrigger>
            <TabsTrigger value="addressbook" className="enterprise-tab">
              <AddressBookIcon size={18} weight="duotone" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="enterprise-tab">
              <Gear size={18} weight="duotone" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <DashboardStats
              totalValue={totalValue}
              walletCount={wallets.length}
              monthlyVolume={234567}
              defiYield={averageApy}
            />
            
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
                    Your Wallets
                  </h2>
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
          
          <TabsContent value="wallets" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
                Wallets
              </h2>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all" onClick={() => setCreateWalletOpen(true)}>
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
          
          <TabsContent value="transactions" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
                Transactions
              </h2>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                <ArrowsLeftRight size={18} weight="bold" />
                New Transaction
              </Button>
            </div>
            
            <TransactionList transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="defi" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                DeFi Positions
              </h2>
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all">
                <ChartLine size={18} weight="bold" />
                New Strategy
              </Button>
            </div>
            
            <DeFiPositions positions={defiPositions} />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-amber-500 to-orange-600" />
                Payment Gateway
              </h2>
              <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all text-white">
                <CreditCard size={18} weight="bold" />
                Create Payment Link
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border-0 rounded-2xl p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CreditCard size={40} weight="duotone" className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Accept Global Payments</h3>
                <p className="text-muted-foreground mb-6">Accept payments via crypto, credit cards, Alipay, WeChat Pay, and UnionPay</p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">Set Up Payment Gateway</Button>
              </div>
              <div className="border-0 rounded-2xl p-8 text-center bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Coins size={40} weight="duotone" className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Instant Settlements</h3>
                <p className="text-muted-foreground mb-6">Create payment links and QR codes for instant settlements</p>
                <Button variant="outline" className="border-2 border-violet-300 hover:bg-violet-50 hover:border-violet-400">View Documentation</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="omni" className="space-y-8">
            <OmniTokenDashboard stats={omniStats} />
          </TabsContent>
          
          <TabsContent value="addressbook" className="space-y-8">
            <AddressBook />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <OrganizationSettings />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="border-t border-slate-200/50 mt-12 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              Ω
            </div>
            <span className="font-bold text-lg">OmniCore Wallet</span>
          </div>
          <p className="text-sm text-muted-foreground">Enterprise Smart Wallet Platform | Powered by blockchain technology</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Multi-chain support</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" />Multi-signature security</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />DeFi integration</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Global payments</span>
          </div>
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