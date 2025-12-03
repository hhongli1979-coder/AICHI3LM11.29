import { useState } from 'react';
import { Toaster } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Wallet, ChartLine, CreditCard, ArrowsLeftRight, Coins, Gear, AddressBook as AddressBookIcon, Robot, Car, ShoppingCart, HardDrives, CurrencyBtc, Users } from '@phosphor-icons/react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { WalletCard } from '@/components/wallet/WalletCard';
import { CreateWalletDialog } from '@/components/wallet/CreateWalletDialog';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { TransactionList } from '@/components/transaction/TransactionList';
import { DeFiPositions } from '@/components/defi/DeFiPositions';
import { OmniTokenDashboard } from '@/components/token/OmniTokenDashboard';
import { OrganizationSettings } from '@/components/organization/OrganizationSettings';
import { AddressBook } from '@/components/addressbook/AddressBook';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';
import { VoiceAssistant } from '@/components/ai-assistant/VoiceAssistant';
import { SmartVoiceAssistant } from '@/components/ai-assistant/SmartVoiceAssistant';
import { CryptoExchange, FiatExchange } from '@/components/payment/CryptoExchange';
import { ThirdPartyPayment } from '@/components/payment/ThirdPartyPayment';
import { DriverApp } from '@/components/taxi/DriverApp';
import { PassengerApp } from '@/components/taxi/PassengerApp';
import { ProxyPurchase } from '@/components/taxi/ProxyPurchase';
import { DefiLlamaDashboard } from '@/components/admin/DefiLlamaDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { BinanceExchange, P2PTrading, FuturesTrading } from '@/components/exchange/BinanceExchange';
import { JeePayDashboard } from '@/components/payment/JeePayDashboard';
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
          <TabsList className="flex flex-wrap gap-1 h-auto p-1">
            <TabsTrigger value="overview" className="gap-2">
              <ChartLine size={18} weight="duotone" />
              <span className="hidden sm:inline">总览</span>
            </TabsTrigger>
            <TabsTrigger value="wallets" className="gap-2">
              <Wallet size={18} weight="duotone" />
              <span className="hidden sm:inline">钱包</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard size={18} weight="duotone" />
              <span className="hidden sm:inline">支付</span>
            </TabsTrigger>
            <TabsTrigger value="taxi-driver" className="gap-2">
              <Car size={18} weight="duotone" />
              <span className="hidden sm:inline">司机端</span>
            </TabsTrigger>
            <TabsTrigger value="taxi-passenger" className="gap-2">
              <Car size={18} weight="duotone" />
              <span className="hidden sm:inline">乘客端</span>
            </TabsTrigger>
            <TabsTrigger value="proxy" className="gap-2">
              <ShoppingCart size={18} weight="duotone" />
              <span className="hidden sm:inline">代购</span>
            </TabsTrigger>
            <TabsTrigger value="defi" className="gap-2">
              <ChartLine size={18} weight="duotone" />
              <span className="hidden sm:inline">DeFi</span>
            </TabsTrigger>
            <TabsTrigger value="defillama" className="gap-2">
              <HardDrives size={18} weight="duotone" />
              <span className="hidden sm:inline">DefiLlama</span>
            </TabsTrigger>
            <TabsTrigger value="binance" className="gap-2">
              <CurrencyBtc size={18} weight="duotone" />
              <span className="hidden sm:inline">币安交易</span>
            </TabsTrigger>
            <TabsTrigger value="p2p" className="gap-2">
              <Users size={18} weight="duotone" />
              <span className="hidden sm:inline">C2C交易</span>
            </TabsTrigger>
            <TabsTrigger value="jeepay" className="gap-2">
              <CreditCard size={18} weight="duotone" />
              <span className="hidden sm:inline">JeePay</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Gear size={18} weight="duotone" />
              <span className="hidden sm:inline">后台管理</span>
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="gap-2">
              <Robot size={18} weight="duotone" />
              <span className="hidden sm:inline">AI助手</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <ArrowsLeftRight size={18} weight="duotone" />
              <span className="hidden sm:inline">交易</span>
            </TabsTrigger>
            <TabsTrigger value="omni" className="gap-2">
              <Coins size={18} weight="duotone" />
              <span className="hidden sm:inline">OMNI</span>
            </TabsTrigger>
            <TabsTrigger value="addressbook" className="gap-2">
              <AddressBookIcon size={18} weight="duotone" />
              <span className="hidden sm:inline">通讯录</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear size={18} weight="duotone" />
              <span className="hidden sm:inline">设置</span>
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
            
            {/* Real Wallet Connection */}
            <div className="mb-6">
              <ConnectWallet />
            </div>
            
            {/* Mock Wallets */}
            <h3 className="text-xl font-semibold mt-8 mb-4">Portfolio Wallets</h3>
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
              <h2 className="text-3xl font-bold">支付中心</h2>
            </div>
            
            {/* Crypto Exchange */}
            <div className="grid gap-6 lg:grid-cols-2">
              <CryptoExchange />
              <FiatExchange />
            </div>
            
            {/* Third Party Payment */}
            <ThirdPartyPayment />
          </TabsContent>
          
          {/* Taxi Driver App */}
          <TabsContent value="taxi-driver" className="space-y-6">
            <DriverApp />
          </TabsContent>
          
          {/* Taxi Passenger App */}
          <TabsContent value="taxi-passenger" className="space-y-6">
            <PassengerApp />
          </TabsContent>
          
          {/* Proxy Purchase */}
          <TabsContent value="proxy" className="space-y-6">
            <ProxyPurchase />
          </TabsContent>
          
          {/* DefiLlama Dashboard */}
          <TabsContent value="defillama" className="space-y-6">
            <DefiLlamaDashboard />
          </TabsContent>
          
          {/* Binance Exchange */}
          <TabsContent value="binance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">币安交易</h2>
            </div>
            <BinanceExchange />
            <div className="mt-8">
              <FuturesTrading />
            </div>
          </TabsContent>
          
          {/* P2P Trading */}
          <TabsContent value="p2p" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">C2C/P2P 交易</h2>
            </div>
            <P2PTrading />
          </TabsContent>
          
          {/* JeePay Payment System */}
          <TabsContent value="jeepay" className="space-y-6">
            <JeePayDashboard />
          </TabsContent>
          
          {/* Admin Dashboard */}
          <TabsContent value="admin" className="space-y-6">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="omni" className="space-y-6">
            <OmniTokenDashboard stats={omniStats} />
          </TabsContent>
          
          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <SmartVoiceAssistant />
              <AIAssistant />
            </div>
            <div className="mt-6">
              <VoiceAssistant />
            </div>
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
          <p>OmniCore 智能支付平台 - 加密支付 · 出租车 · 代购 · AI智能体 · DefiLlama · 币安交易 · JeePay</p>
          <p className="mt-2">多链支持 • 语音助手 • 加密收款 • 全球代购 • DeFi后台管理 • 现货/合约/C2C交易 • 聚合支付</p>
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