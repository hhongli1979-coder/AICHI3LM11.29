import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartBar, Users, ArrowsLeftRight, Coin, ArrowClockwise, ArrowSquareOut } from '@phosphor-icons/react';
import type { DuneAnalyticsStats } from '@/lib/types';
import { formatCurrency, formatAddress, formatTimeAgo } from '@/lib/mock-data';

interface DuneAnalyticsProps {
  stats: DuneAnalyticsStats;
}

export function DuneAnalytics({ stats }: DuneAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('nft');

  // Calculate total NFT mints in past 7 days
  const totalNFTMints = stats.nftMints7Days.reduce((sum, day) => sum + day.totalNFTMint, 0);
  
  // Calculate total verified NFTs in past 30 days
  const totalVerified = stats.nftVerified30Days.reduce((sum, day) => sum + day.totalVerified, 0);
  
  // Calculate total balances across all tokens
  const totalBalanceUSD = stats.tokenBalances.reduce((sum, token) => 
    sum + (token.totalBalances * token.tokenPrice), 0);
  
  // Calculate total 24h volume
  const total24hVolume = stats.transactionVolume24h.reduce((sum, token) => 
    sum + token.totalVolume, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dune Analytics</h2>
          <p className="text-muted-foreground mt-1">
            区块链运营数据和统计信息 • Powered by Dune.com
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Last updated: {formatTimeAgo(stats.lastUpdatedAt)}
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowClockwise size={16} weight="bold" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="https://dune.com" target="_blank" rel="noopener noreferrer">
              <ArrowSquareOut size={16} weight="bold" />
              Open Dune
            </a>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">NFT Minted (7d)</CardTitle>
            <ChartBar size={20} weight="duotone" className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNFTMints}</div>
            <p className="text-xs text-muted-foreground">Past 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">NFT Verified (30d)</CardTitle>
            <Badge variant="secondary">{totalVerified}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVerified}</div>
            <p className="text-xs text-muted-foreground">Past 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balances</CardTitle>
            <Coin size={20} weight="duotone" className="text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalanceUSD)}</div>
            <p className="text-xs text-muted-foreground">Across all tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
            <ArrowsLeftRight size={20} weight="duotone" className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(total24hVolume)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="nft" className="gap-2">
            <ChartBar size={16} weight="duotone" />
            NFT Reports
          </TabsTrigger>
          <TabsTrigger value="balance" className="gap-2">
            <Coin size={16} weight="duotone" />
            Balance Reports
          </TabsTrigger>
          <TabsTrigger value="transaction" className="gap-2">
            <ArrowsLeftRight size={16} weight="duotone" />
            Transaction Reports
          </TabsTrigger>
        </TabsList>

        {/* NFT Reports Tab */}
        <TabsContent value="nft" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* NFT Mints Past 7 Days */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NFT Minted (Past 7 Days)</CardTitle>
                <CardDescription>Daily NFT minting activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total NFT Mint</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.nftMints7Days.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell className="text-right font-medium">{day.totalNFTMint}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Verified NFTs Past 30 Days */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NFT Verified (Past 30 Days)</CardTitle>
                <CardDescription>Daily NFT verification activity</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total Verified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.nftVerified30Days.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell className="text-right font-medium">{day.totalVerified}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Balance Reports Tab */}
        <TabsContent value="balance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Total Token Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Customer Balances</CardTitle>
                <CardDescription>Aggregate balances by token</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Total Balances</TableHead>
                      <TableHead className="text-right">Token Price</TableHead>
                      <TableHead className="text-right">Value (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.tokenBalances.map((token) => (
                      <TableRow key={token.symbol}>
                        <TableCell>
                          <Badge variant="outline">{token.symbol}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {token.totalBalances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(token.tokenPrice)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(token.totalBalances * token.tokenPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top 10 Customers by Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={20} weight="duotone" className="text-primary" />
                  Top 10 Customers by Balance
                </CardTitle>
                <CardDescription>Highest balance holders per token</CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {['EUR24', 'USD24', 'CHF24', 'GBP24'].map((symbol) => {
                  const customerBalances = stats.topCustomersByBalance
                    .filter((c) => c.symbol === symbol)
                    .slice(0, 10);
                  
                  return (
                    <div key={symbol} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge>{symbol}</Badge>
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerBalances.map((customer, index) => (
                            <TableRow key={`${customer.symbol}-${customer.address}`}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatAddress(customer.address, 6)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {customer.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transaction Reports Tab */}
        <TabsContent value="transaction" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 24h Transaction Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">24h Transaction Volume</CardTitle>
                <CardDescription>Total transaction volume by token</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Contract Address</TableHead>
                      <TableHead className="text-right">Total Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.transactionVolume24h.map((token) => (
                      <TableRow key={token.symbol}>
                        <TableCell>
                          <Badge variant="outline">{token.symbol}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {formatAddress(token.contractAddress, 8)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {token.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top 10 Customers by 24h Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowsLeftRight size={20} weight="duotone" className="text-green-600" />
                  Top 10 Customers by 24h Volume
                </CardTitle>
                <CardDescription>Highest volume traders in last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {['EUR24', 'USD24', 'CHF24', 'GBP24'].map((symbol) => {
                  const customerVolumes = stats.topCustomersByVolume
                    .filter((c) => c.symbol === symbol)
                    .slice(0, 10);
                  
                  return (
                    <div key={symbol} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge variant="secondary">{symbol}</Badge>
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Volume</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerVolumes.map((customer, index) => (
                            <TableRow key={`${customer.symbol}-${customer.address}`}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatAddress(customer.address, 6)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {customer.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* SQL Query Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dune SQL Queries Reference</CardTitle>
          <CardDescription>
            These queries can be used directly in Dune Analytics with your wallet provider address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Wallet Provider:</strong>{' '}
              <code className="bg-muted px-2 py-1 rounded font-mono">{stats.walletProvider}</code>
            </p>
            <p>
              Visit{' '}
              <a 
                href="https://dune.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                dune.com
              </a>{' '}
              to create custom dashboards using Fiat24 analytics queries.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
