import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  User,
  ShieldCheck,
  Lightning,
  Globe,
  Lock,
  Code,
  Bank,
  ArrowsClockwise,
  Info,
  Copy,
  CheckCircle,
} from '@phosphor-icons/react';
import {
  generateMockFiat24CustomerProfile,
  generateMockFiat24Card,
  generateMockFiat24ApiConfig,
  getFiat24TierDescription,
  getFiat24NetworkName,
  formatCurrency,
} from '@/lib/mock-data';
import { toast } from 'sonner';

/**
 * Fiat24 API Dashboard Component
 * 
 * Displays Fiat24 API integration features including:
 * - Rate limiting configuration
 * - Security headers
 * - Customer profile data
 * - Card management
 */
export function Fiat24Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState<string | null>(null);

  const apiConfig = generateMockFiat24ApiConfig('tier2');
  const customerProfile = generateMockFiat24CustomerProfile();
  const card = generateMockFiat24Card();

  const rateLimitPercentage = (apiConfig.rateLimit.currentUsage / apiConfig.rateLimit.callsPerMinute) * 100;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} 已复制到剪贴板`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Fiat24 API 集成</h2>
          <p className="text-muted-foreground mt-1">
            连接传统银行与 Web3，实现无缝资金管理
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Globe size={16} weight="duotone" />
          {getFiat24NetworkName(42161)}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API 状态</CardTitle>
            <Lightning size={20} weight="duotone" className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">在线</div>
            <p className="text-xs text-muted-foreground">所有服务正常运行</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">速率限制</CardTitle>
            <ArrowsClockwise size={20} weight="duotone" className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiConfig.rateLimit.callsPerMinute}/分钟</div>
            <Progress value={rateLimitPercentage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              已使用 {apiConfig.rateLimit.currentUsage} 次
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">账户限额</CardTitle>
            <Bank size={20} weight="duotone" className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(customerProfile.limits.available, 'CHF')}
            </div>
            <Progress 
              value={(customerProfile.limits.used / customerProfile.limits.max) * 100} 
              className="mt-2 h-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              每月限额 {formatCurrency(customerProfile.limits.max, 'CHF')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">安全等级</CardTitle>
            <ShieldCheck size={20} weight="duotone" className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">已验证</div>
            <p className="text-xs text-muted-foreground">NFT 签名认证</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Info size={16} weight="duotone" />
            概览
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} weight="duotone" />
            客户资料
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-2">
            <CreditCard size={16} weight="duotone" />
            借记卡
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock size={16} weight="duotone" />
            安全配置
          </TabsTrigger>
          <TabsTrigger value="api-docs" className="gap-2">
            <Code size={16} weight="duotone" />
            API 文档
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Rate Limiting Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightning size={20} weight="duotone" />
                  速率限制
                </CardTitle>
                <CardDescription>
                  API 调用频率限制根据活跃用户数量动态调整
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {(['tier1', 'tier2', 'tier3'] as const).map((tier) => (
                    <div
                      key={tier}
                      className={`p-3 rounded-lg border ${
                        apiConfig.rateLimit.tier === tier
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {getFiat24TierDescription(tier)}
                        </span>
                        {apiConfig.rateLimit.tier === tier && (
                          <Badge>当前层级</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  速率每周五重新评估一次
                </p>
              </CardContent>
            </Card>

            {/* Network Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} weight="duotone" />
                  支持的网络
                </CardTitle>
                <CardDescription>
                  根据请求头中的 network 参数返回对应网络的数据
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="p-3 rounded-lg border border-primary bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Arbitrum One</div>
                        <div className="text-sm text-muted-foreground">
                          network: 42161
                        </div>
                      </div>
                      <Badge>主网络</Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      IBAN 示例: CH68 8305 <strong>1000</strong> 0000 1234 5
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Mantle</div>
                        <div className="text-sm text-muted-foreground">
                          network: 5000
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      IBAN 示例: CH17 8305 <strong>1100</strong> 0000 1234 5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} weight="duotone" />
                客户资料 - GET /br
              </CardTitle>
              <CardDescription>
                获取用户的 NFT 账户信息，包含敏感数据需谨慎处理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">个人信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono">{customerProfile.tokenId}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">姓名</span>
                      <span>{customerProfile.br}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">IBAN</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{customerProfile.iban}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(customerProfile.iban, 'IBAN')}
                        >
                          {copied === 'IBAN' ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">邮箱</span>
                      <span>{customerProfile.email}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">电话</span>
                      <span>{customerProfile.mobile}</span>
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">地址信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">街道</span>
                      <span>{customerProfile.street}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">邮编</span>
                      <span>{customerProfile.postalCode}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">城市</span>
                      <span>{customerProfile.city}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">国家</span>
                      <span>{customerProfile.country}</span>
                    </div>
                  </div>

                  {/* Card Eligibility */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">借记卡资格</h4>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard size={20} weight="duotone" />
                          <span>
                            {customerProfile.debitCard || '未设置'}
                          </span>
                        </div>
                        <Badge variant={customerProfile.isCardEligible ? 'default' : 'secondary'}>
                          {customerProfile.isCardEligible ? '符合资格' : '不符合资格'}
                        </Badge>
                      </div>
                      {customerProfile.cardActivation && (
                        <p className="text-sm text-muted-foreground mt-2">
                          激活费用: {customerProfile.cardActivation.amount} {customerProfile.cardActivation.currency}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deposit Bank Info */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">存款银行信息</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {(['CHF', 'EUR'] as const).map((currency) => (
                    <div key={currency} className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-3">
                        <Bank size={18} weight="duotone" />
                        <span className="font-medium">{currency}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">账户</span>
                          <span className="font-mono">
                            {customerProfile.depositBank[currency].account}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">银行</span>
                          <span>{customerProfile.depositBank[currency].bank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">BIC</span>
                          <span className="font-mono">
                            {customerProfile.depositBank[currency].BIC}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} weight="duotone" />
                借记卡管理 - GET /cards
              </CardTitle>
              <CardDescription>
                获取用户的借记卡信息，敏感数据需用户同意后显示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Card Info */}
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-xs opacity-80">Fiat24</div>
                        <div className="font-bold">{card.cardDesign}</div>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {card.status}
                      </Badge>
                    </div>
                    <div className="font-mono text-xl tracking-wider mb-4">
                      {card.masked.cardNumber}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xs opacity-80">持卡人</div>
                        <div className="font-medium">{card.cardHolder}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">有效期</div>
                        <div className="font-mono">{card.masked.expiry}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">CVV</div>
                        <div className="font-mono">{card.masked.cvv2}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-start gap-2">
                      <Info size={18} className="text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-700">重要提示</p>
                        <p className="text-yellow-600">
                          cardToken 仅有效 5 分钟。过期后需重新获取。
                          敏感数据（CVV、有效期）需使用 fiat24card.js 显示。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold">安全设置</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>非接触式支付</span>
                      <Badge variant={card.security.contactlessEnabled ? 'default' : 'secondary'}>
                        {card.security.contactlessEnabled ? '已启用' : '已禁用'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>ATM 取款</span>
                      <Badge variant={card.security.withdrawalEnabled ? 'default' : 'secondary'}>
                        {card.security.withdrawalEnabled ? '已启用' : '已禁用'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>网上购物</span>
                      <Badge variant={card.security.internetPurchaseEnabled ? 'default' : 'secondary'}>
                        {card.security.internetPurchaseEnabled ? '已启用' : '已禁用'}
                      </Badge>
                    </div>
                  </div>

                  <h4 className="font-semibold mt-6">支付限额（月度，EUR）</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>非接触式</span>
                        <span>
                          {formatCurrency(card.limits.contactless.used, 'EUR')} / {formatCurrency(card.limits.contactless.max, 'EUR')}
                        </span>
                      </div>
                      <Progress 
                        value={(card.limits.contactless.used / card.limits.contactless.max) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>网上购物</span>
                        <span>
                          {formatCurrency(card.limits.internetPurchase.used, 'EUR')} / {formatCurrency(card.limits.internetPurchase.max, 'EUR')}
                        </span>
                      </div>
                      <Progress 
                        value={(card.limits.internetPurchase.used / card.limits.internetPurchase.max) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  <h4 className="font-semibold mt-6">已授权设备</h4>
                  <div className="space-y-2">
                    {card.activeTokens.map((token) => (
                      <div key={token.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span>{token.type}</span>
                        <Badge variant="outline" className="text-green-600">活跃</Badge>
                      </div>
                    ))}
                    {card.inactiveTokens.map((token) => (
                      <div key={token.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span>{token.type}</span>
                        <Badge variant="outline">待激活</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} weight="duotone" />
                安全 API 配置
              </CardTitle>
              <CardDescription>
                访问用户个人资料的 API 需要包含由 NFT 地址签名的安全头部
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Structure */}
              <div>
                <h4 className="font-semibold mb-3">请求头结构</h4>
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-sm font-mono">
{`const headers = {
    "Content-Type"  : "application/json",
    
    tokenid         : <token id of user>,
    network         : 42161,  // 或 5000
    
    sign            : <user's wallet signature>,
    hash            : <original text that was hashed>,
    deadline        : <deadline used for signing>
}`}
                </pre>
              </div>

              {/* Signature Generation */}
              <div>
                <h4 className="font-semibold mb-3">签名生成流程</h4>
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-sm font-mono">
{`// 签名最长有效期 20 分钟
const SIGNATURE_DEADLINE_IN_SECONDS = 1200;

// 获取服务器时间戳（避免设备时钟不同步）
const serverTimestamp = await fetch("https://api.fiat24.com/timestamp");
const now = serverTimestamp.timestamp;

const deadline = Math.round(now/1000) + SIGNATURE_DEADLINE_IN_SECONDS;

const hash = "Hello world"; // 可以是任意文本

// 使用 web3.js
const deadlineHash = web3.utils.sha3(hash + deadline);

// 或使用 ethers.js
const deadlineHash = ethers.keccak256(ethers.toUtf8Bytes(hash + deadline));

const messageToSign = \`I agree to access my profile. \${deadlineHash}\`;

// 使用 web3.js
const sign = await web3.eth.personal.sign(messageToSign, address);

// 或使用 ethers.js  
const sign = await signer.signMessage(messageToSign);

return { hash, deadline, sign };`}
                </pre>
              </div>

              {/* SHA3 Note */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start gap-2">
                  <Info size={18} className="text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-700">SHA3 兼容性提示</p>
                    <p className="text-blue-600">
                      某些编程语言中，SHA3 函数的行为可能略有不同。
                      验证方式：SHA3("Fiat24") 应返回
                    </p>
                    <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-1 block">
                      0x1cf688cdaa53bf4605bfbb1ab56565651179978e63d41cf2df557d5bb5f1bd90
                    </code>
                  </div>
                </div>
              </div>

              {/* Current Config */}
              <div>
                <h4 className="font-semibold mb-3">当前配置</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">签名有效期</div>
                    <div className="text-xl font-bold">
                      {apiConfig.signatureDeadlineSeconds / 60} 分钟
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">服务器时间</div>
                    <div className="text-xl font-bold">
                      {new Date(apiConfig.serverTimestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">API 基础 URL</div>
                    <div className="text-sm font-mono truncate">
                      {apiConfig.baseUrl}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Docs Tab */}
        <TabsContent value="api-docs" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Endpoints List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code size={20} weight="duotone" />
                  API 端点
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>GET</Badge>
                    <code className="font-mono text-sm">/br</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    获取用户的 NFT 账户信息，包括 IBAN、地址、限额等
                  </p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>GET</Badge>
                    <code className="font-mono text-sm">/cards</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    获取用户的借记卡信息，包括安全设置和限额
                  </p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>GET</Badge>
                    <code className="font-mono text-sm">/iban/{'{tokenId}'}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    根据 Token ID 获取 IBAN（不同网络返回不同格式）
                  </p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="font-mono text-sm">/timestamp</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    获取服务器时间戳（用于签名生成）
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Response Codes */}
            <Card>
              <CardHeader>
                <CardTitle>响应状态码</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <span className="font-mono">200</span>
                  <span className="text-green-600">请求成功</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                  <span className="font-mono">404</span>
                  <span className="text-yellow-600">未找到（如无卡）</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                  <span className="font-mono">401</span>
                  <span className="text-red-600">签名无效或过期</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                  <span className="font-mono">429</span>
                  <span className="text-red-600">超出速率限制</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                  <span className="font-mono">500</span>
                  <span className="text-red-600">服务器错误</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Code */}
          <Card>
            <CardHeader>
              <CardTitle>示例代码</CardTitle>
              <CardDescription>
                使用 ethers.js 调用 Fiat24 API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-sm font-mono">
{`import { ethers } from 'ethers';

async function getFiat24Profile(signer, tokenId) {
  // 1. 获取服务器时间
  const { timestamp } = await fetch('https://api.fiat24.com/timestamp')
    .then(r => r.json());
  
  // 2. 生成签名
  const deadline = Math.round(timestamp / 1000) + 1200;
  const hash = 'Access profile';
  const deadlineHash = ethers.keccak256(
    ethers.toUtf8Bytes(hash + deadline)
  );
  const messageToSign = \`I agree to access my profile. \${deadlineHash}\`;
  const sign = await signer.signMessage(messageToSign);
  
  // 3. 发送请求
  const response = await fetch('https://api.fiat24.com/br', {
    headers: {
      'Content-Type': 'application/json',
      'tokenid': tokenId.toString(),
      'network': '42161',
      'sign': sign,
      'hash': hash,
      'deadline': deadline.toString()
    }
  });
  
  return response.json();
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
