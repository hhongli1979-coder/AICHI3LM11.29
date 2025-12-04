import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Robot,
  Brain,
  Globe,
  ShieldCheck,
  Lightning,
  ChartLine,
  ArrowsLeftRight,
  CheckCircle,
  Clock,
  Warning,
  Users,
  Gear,
  CurrencyCircleDollar,
  FileText,
  HandCoins,
  Sparkle,
  TreeStructure,
  Receipt,
  Scales,
  Target,
  TrendUp,
} from '@phosphor-icons/react';
import {
  generateMockIntelligentAgents,
  generateMockAgentCollaborations,
  generateMockGlobalPaymentAccounts,
  generateMockGlobalPaymentTransactions,
  generateMockComplianceLicenses,
  generateMockRiskMetrics,
  generateMockReconciliationReports,
  generateMockA2AProtocols,
  generateMockDAOProposals,
  generateMockMultiAgentPlatformStats,
  formatTimeAgo,
  formatCurrency,
} from '@/lib/mock-data';
import type { 
  IntelligentAgent, 
  AgentCollaboration, 
  GlobalPaymentAccount, 
  GlobalPaymentTransaction, 
  ComplianceLicense,
  A2APaymentProtocol,
  DAOGovernance,
} from '@/lib/types';

function getAgentStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700 border-green-300';
    case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'idle': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'error': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getAgentStatusLabel(status: string): string {
  switch (status) {
    case 'active': return '运行中';
    case 'processing': return '处理中';
    case 'idle': return '空闲';
    case 'error': return '异常';
    default: return status;
  }
}

function getAgentIcon(type: string) {
  switch (type) {
    case 'routing': return <ArrowsLeftRight size={20} weight="duotone" />;
    case 'compliance': return <FileText size={20} weight="duotone" />;
    case 'risk': return <ShieldCheck size={20} weight="duotone" />;
    case 'settlement': return <HandCoins size={20} weight="duotone" />;
    case 'reconciliation': return <Receipt size={20} weight="duotone" />;
    case 'analytics': return <ChartLine size={20} weight="duotone" />;
    default: return <Robot size={20} weight="duotone" />;
  }
}

function getTransactionStatusColor(status: string): string {
  switch (status) {
    case 'settled': return 'bg-green-100 text-green-700';
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'compliance_review': return 'bg-amber-100 text-amber-700';
    case 'initiated': return 'bg-gray-100 text-gray-700';
    case 'failed': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getTransactionStatusLabel(status: string): string {
  switch (status) {
    case 'settled': return '已结算';
    case 'processing': return '处理中';
    case 'compliance_review': return '合规审核';
    case 'initiated': return '已发起';
    case 'failed': return '失败';
    default: return status;
  }
}

interface AgentCardProps {
  agent: IntelligentAgent;
}

function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="border hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getAgentStatusColor(agent.status)}`}>
              {getAgentIcon(agent.type)}
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                {agent.name}
                <Badge variant="outline" className={`text-xs ${getAgentStatusColor(agent.status)}`}>
                  {getAgentStatusLabel(agent.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{agent.description}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{agent.processedCount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">处理量</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{agent.successRate}%</div>
            <div className="text-xs text-muted-foreground">成功率</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{agent.avgProcessingTime}ms</div>
            <div className="text-xs text-muted-foreground">平均耗时</div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Clock size={12} />
          最后活跃: {formatTimeAgo(agent.lastActiveAt)}
        </div>
      </CardContent>
    </Card>
  );
}

interface CollaborationCardProps {
  collaboration: AgentCollaboration;
}

function CollaborationCard({ collaboration }: CollaborationCardProps) {
  const outcomeColors = {
    success: 'text-green-600',
    pending: 'text-amber-600',
    failed: 'text-red-600',
  };
  
  const outcomeIcons = {
    success: <CheckCircle size={16} weight="fill" className="text-green-600" />,
    pending: <Clock size={16} weight="fill" className="text-amber-600" />,
    failed: <Warning size={16} weight="fill" className="text-red-600" />,
  };

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TreeStructure size={18} weight="duotone" className="text-primary" />
            <span className="font-medium text-sm">智能体协同</span>
            {outcomeIcons[collaboration.outcome]}
          </div>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(collaboration.timestamp)}</span>
        </div>
        
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="text-xs">{collaboration.triggerAgent}</Badge>
          <ArrowsLeftRight size={14} className="text-muted-foreground" />
          {collaboration.collaboratingAgents.map((agent) => (
            <Badge key={agent} variant="outline" className="text-xs">{agent}</Badge>
          ))}
        </div>
        
        <p className="text-sm mt-3">{collaboration.decision}</p>
        
        <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
          <span>处理耗时: {collaboration.processingTime}ms</span>
          <span className={outcomeColors[collaboration.outcome]}>
            {collaboration.outcome === 'success' ? '✓ 完成' : collaboration.outcome === 'pending' ? '⏳ 进行中' : '✗ 失败'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentAccountCardProps {
  account: GlobalPaymentAccount;
}

function PaymentAccountCard({ account }: PaymentAccountCardProps) {
  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {account.currency}
            </div>
            <div>
              <div className="font-semibold">{account.bankName}</div>
              <div className="text-sm text-muted-foreground">{account.country} · {account.accountNumber}</div>
            </div>
          </div>
          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
            {account.status === 'active' ? '活跃' : '待激活'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t">
          <div>
            <div className="text-xs text-muted-foreground">账户余额</div>
            <div className="text-lg font-bold">{account.currency} {account.balance}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">可用余额</div>
            <div className="text-lg font-bold text-green-600">{account.currency} {account.availableBalance}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TransactionCardProps {
  transaction: GlobalPaymentTransaction;
}

function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyCircleDollar size={24} weight="duotone" className="text-primary" />
            <div>
              <div className="font-semibold">{transaction.sourceCurrency} → {transaction.targetCurrency}</div>
              <div className="text-sm text-muted-foreground">金额: {transaction.amount} {transaction.sourceCurrency}</div>
            </div>
          </div>
          <Badge className={getTransactionStatusColor(transaction.status)}>
            {getTransactionStatusLabel(transaction.status)}
          </Badge>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">汇率:</span> {transaction.exchangeRate}
          </div>
          <div>
            <span className="text-muted-foreground">手续费:</span> {transaction.fee}
          </div>
          <div>
            <span className="text-muted-foreground">预计到账:</span> {transaction.estimatedSettlement}
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-muted-foreground mb-2">智能体决策:</div>
          <div className="flex flex-wrap gap-2">
            {transaction.agentDecisions.map((decision, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {decision.agentType}: {decision.decision} ({Math.round(decision.confidence * 100)}%)
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Clock size={12} />
          创建于: {formatTimeAgo(transaction.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}

interface LicenseCardProps {
  license: ComplianceLicense;
}

function LicenseCard({ license }: LicenseCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    expired: 'bg-red-100 text-red-700',
    renewal: 'bg-blue-100 text-blue-700',
  };
  
  const statusLabels = {
    active: '有效',
    pending: '待审批',
    expired: '已过期',
    renewal: '续期中',
  };

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Scales size={24} weight="duotone" className="text-primary" />
            <div>
              <div className="font-semibold">{license.country}</div>
              <div className="text-sm text-muted-foreground">{license.licenseType}</div>
            </div>
          </div>
          <Badge className={statusColors[license.status]}>
            {statusLabels[license.status]}
          </Badge>
        </div>
        
        <div className="text-sm mt-3">{license.licenseName}</div>
        
        <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
          <span>发证日期: {new Date(license.issueDate).toLocaleDateString('zh-CN')}</span>
          <span>到期日期: {new Date(license.expiryDate).toLocaleDateString('zh-CN')}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProtocolCardProps {
  protocol: A2APaymentProtocol;
}

function ProtocolCard({ protocol }: ProtocolCardProps) {
  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Robot size={24} weight="duotone" className="text-purple-500" />
            <div>
              <div className="font-semibold flex items-center gap-2">
                {protocol.name}
                <Badge variant="outline" className="text-xs">v{protocol.version}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{protocol.description}</p>
            </div>
          </div>
          <Badge variant={protocol.isEnabled ? 'default' : 'secondary'}>
            {protocol.isEnabled ? '已启用' : '未启用'}
          </Badge>
        </div>
        
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">支持智能体:</span>
          {protocol.supportedAgents.map((agent) => (
            <Badge key={agent} variant="outline" className="text-xs">{agent}</Badge>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">交易数:</span>
          <span className="font-semibold">{protocol.transactionCount.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DAOProposalCardProps {
  proposal: DAOGovernance;
}

function DAOProposalCard({ proposal }: DAOProposalCardProps) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const quorumPercent = totalVotes > 0 ? (totalVotes / proposal.quorum) * 100 : 0;
  
  const statusColors = {
    active: 'bg-blue-100 text-blue-700',
    passed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700',
  };
  
  const statusLabels = {
    active: '投票中',
    passed: '已通过',
    rejected: '已否决',
    pending: '待开始',
  };

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold flex items-center gap-2">
              {proposal.proposalTitle}
              <Badge className={statusColors[proposal.status]}>
                {statusLabels[proposal.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{proposal.description}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600">赞成 {(proposal.votesFor / 1000000).toFixed(2)}M</span>
            <span className="text-red-600">反对 {(proposal.votesAgainst / 1000000).toFixed(2)}M</span>
          </div>
          <Progress value={forPercent} className="h-2" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>法定人数: {Math.min(quorumPercent, 100).toFixed(1)}%</span>
            <span>截止: {new Date(proposal.endDate).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t text-xs text-muted-foreground flex items-center gap-2">
          <Users size={12} />
          提案人: {proposal.proposer}
        </div>
      </CardContent>
    </Card>
  );
}

export function MultiAgentDashboard() {
  const [agents] = useState(generateMockIntelligentAgents);
  const [collaborations] = useState(generateMockAgentCollaborations);
  const [accounts] = useState(generateMockGlobalPaymentAccounts);
  const [transactions] = useState(generateMockGlobalPaymentTransactions);
  const [licenses] = useState(generateMockComplianceLicenses);
  const [riskMetrics] = useState(generateMockRiskMetrics);
  const [reconciliationReports] = useState(generateMockReconciliationReports);
  const [a2aProtocols] = useState(generateMockA2AProtocols);
  const [daoProposals] = useState(generateMockDAOProposals);
  const [platformStats] = useState(generateMockMultiAgentPlatformStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Globe size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">多智能体全球收款平台</h2>
            <p className="text-muted-foreground">
              智能协同 · 全球覆盖 · 安全合规 · 极致体验
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Lightning size={18} weight="bold" />
          新建收款
        </Button>
      </div>

      {/* Platform Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Robot size={24} weight="duotone" className="text-primary" />
              <div>
                <div className="text-2xl font-bold">{platformStats.activeAgents}/{platformStats.totalAgents}</div>
                <div className="text-xs text-muted-foreground">活跃智能体</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CurrencyCircleDollar size={24} weight="duotone" className="text-green-600" />
              <div>
                <div className="text-2xl font-bold">{platformStats.totalVolumeToday}</div>
                <div className="text-xs text-muted-foreground">今日交易额</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe size={24} weight="duotone" className="text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{platformStats.supportedCurrencies}+</div>
                <div className="text-xs text-muted-foreground">支持币种</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} weight="duotone" className="text-amber-600" />
              <div>
                <div className="text-2xl font-bold">{platformStats.fraudRatePercent}</div>
                <div className="text-xs text-muted-foreground">欺诈风险率</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendUp size={24} weight="duotone" className="text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{platformStats.efficiencyImprovement}</div>
                <div className="text-xs text-muted-foreground">效率提升</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid lg:grid-cols-6">
          <TabsTrigger value="agents" className="gap-2">
            <Brain size={18} weight="duotone" />
            <span className="hidden sm:inline">智能协同</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="gap-2">
            <Globe size={18} weight="duotone" />
            <span className="hidden sm:inline">全球收款</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <ShieldCheck size={18} weight="duotone" />
            <span className="hidden sm:inline">安全合规</span>
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="gap-2">
            <Receipt size={18} weight="duotone" />
            <span className="hidden sm:inline">业财融合</span>
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="gap-2">
            <Sparkle size={18} weight="duotone" />
            <span className="hidden sm:inline">生态前瞻</span>
          </TabsTrigger>
          <TabsTrigger value="governance" className="gap-2">
            <Users size={18} weight="duotone" />
            <span className="hidden sm:inline">DAO治理</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain size={24} weight="duotone" className="text-primary" />
              核心智能体
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TreeStructure size={24} weight="duotone" className="text-primary" />
              智能体协同记录
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {collaborations.map((collab) => (
                <CollaborationCard key={collab.id} collaboration={collab} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CurrencyCircleDollar size={24} weight="duotone" className="text-primary" />
              全球收款账户
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <PaymentAccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ArrowsLeftRight size={24} weight="duotone" className="text-primary" />
              最近交易
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck size={20} weight="duotone" className="text-green-600" />
                  风控指标
                </CardTitle>
                <CardDescription>基于大模型的多智能体风控系统</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{(riskMetrics.fraudRate * 100).toFixed(4)}%</div>
                    <div className="text-sm text-muted-foreground">欺诈风险率</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{riskMetrics.avgRiskScore}</div>
                    <div className="text-sm text-muted-foreground">平均风险评分</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">已拦截交易</span>
                    <span className="font-bold text-red-600">{riskMetrics.blockedTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">标记交易</span>
                    <span className="font-bold text-amber-600">{riskMetrics.flaggedTransactions}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5">
                  <CheckCircle size={18} weight="fill" className="text-green-600" />
                  <span className="text-sm">7×24小时实时监控运行中</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    最后扫描: {formatTimeAgo(riskMetrics.lastScanAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scales size={20} weight="duotone" className="text-primary" />
                  全球支付牌照 ({licenses.length}张)
                </CardTitle>
                <CardDescription>覆盖主要金融市场的支付资质</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {licenses.map((license) => (
                      <LicenseCard key={license.id} license={license} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt size={20} weight="duotone" className="text-primary" />
                智能对账报告
              </CardTitle>
              <CardDescription>通过API与企业ERP/财务系统深度集成，实现支付数据自动同步、智能对账</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reconciliationReports.map((report) => (
                  <Card key={report.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText size={24} weight="duotone" className="text-primary" />
                          <div>
                            <div className="font-semibold">{report.period}</div>
                            <div className="text-sm text-muted-foreground">
                              总交易: {report.totalTransactions.toLocaleString()}笔
                            </div>
                          </div>
                        </div>
                        <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                          {report.status === 'completed' ? '已完成' : report.status === 'in_progress' ? '进行中' : '待处理'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{report.matchedTransactions.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">匹配成功</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{report.autoReconciled.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">自动对账</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-600">{report.manualReview}</div>
                          <div className="text-xs text-muted-foreground">人工复核</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{report.discrepancies}</div>
                          <div className="text-xs text-muted-foreground">差异项</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress 
                          value={(report.matchedTransactions / report.totalTransactions) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          对账完成率: {((report.matchedTransactions / report.totalTransactions) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecosystem" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Robot size={20} weight="duotone" className="text-purple-600" />
                A2A (AI间) 支付协议
              </CardTitle>
              <CardDescription>原生支持AI Agent之间直接进行价值交换的协议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {a2aProtocols.map((protocol) => (
                  <ProtocolCard key={protocol.id} protocol={protocol} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightning size={32} weight="duotone" className="text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-lg">一次授权，多次免密</h3>
                    <p className="text-sm text-muted-foreground">DePA协议支持的便捷支付体验</p>
                  </div>
                </div>
                <p className="text-sm">
                  通过DePA方案，用户只需一次授权即可享受多次免密支付，结算智能体自动代付Gas费，
                  极大简化了操作流程，为AI Agent的自主交易铺平道路。
                </p>
                <Button className="mt-4 gap-2" variant="outline">
                  <Gear size={16} />
                  配置授权
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={32} weight="duotone" className="text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">API优先集成</h3>
                    <p className="text-sm text-muted-foreground">降低开发集成成本</p>
                  </div>
                </div>
                <p className="text-sm">
                  提供完善的API接口和SDK，支持快速集成到现有企业系统。
                  通过SaaS连接器，帮助企业快速对接，为AI Agent经济提供顺滑无感的支付体验。
                </p>
                <Button className="mt-4 gap-2" variant="outline">
                  <FileText size={16} />
                  查看文档
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} weight="duotone" className="text-primary" />
                DAO治理提案
              </CardTitle>
              <CardDescription>基于DAO的社区治理模式，让生态参与者共同决定未来发展方向</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {daoProposals.map((proposal) => (
                  <DAOProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center p-6">
              <Sparkle size={48} weight="duotone" className="text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">开放生态</h3>
              <p className="text-sm text-muted-foreground">
                平台不再是单一工具，而是不断进化的金融生态系统
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <TreeStructure size={48} weight="duotone" className="text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">可演进架构</h3>
              <p className="text-sm text-muted-foreground">
                支持多智能体协作协议的持续升级和功能扩展
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <Users size={48} weight="duotone" className="text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">社区共治</h3>
              <p className="text-sm text-muted-foreground">
                通过DAO机制让所有参与者共同决定平台发展方向
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
