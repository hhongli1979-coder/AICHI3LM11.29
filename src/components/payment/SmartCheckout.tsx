import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Lightning,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  Warning,
  TrendUp,
  Globe,
  DeviceMobile,
  User,
  MapPin,
  Clock,
  ChartLine,
  Sparkle,
  ArrowRight,
  Eye,
  Lock,
  Fingerprint,
  Robot,
  Gear
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// 用户画像类型
interface CustomerProfile {
  id: string;
  device: 'mobile' | 'desktop' | 'tablet';
  location: string;
  language: string;
  currency: string;
  isNewCustomer: boolean;
  previousPurchases: number;
  averageOrderValue: number;
  preferredPaymentMethods: string[];
  riskScore: number;
  trustLevel: 'low' | 'medium' | 'high' | 'verified';
}

// 交易上下文
interface TransactionContext {
  amount: number;
  currency: string;
  merchantCategory: string;
  items: { name: string; price: number; category: string }[];
  isSubscription: boolean;
  isHighValue: boolean;
}

// AI推荐结果
interface AIRecommendation {
  paymentMethods: { method: string; score: number; reason: string }[];
  requiredFields: string[];
  authChallenges: string[];
  fraudRisk: 'low' | 'medium' | 'high';
  conversionProbability: number;
  optimizations: string[];
}

// 模拟AI推荐引擎
const generateAIRecommendation = (
  customer: CustomerProfile,
  transaction: TransactionContext
): AIRecommendation => {
  const recommendations: AIRecommendation = {
    paymentMethods: [],
    requiredFields: ['email'],
    authChallenges: [],
    fraudRisk: 'low',
    conversionProbability: 85,
    optimizations: [],
  };

  // 根据用户位置推荐支付方式
  if (customer.location.includes('中国') || customer.location.includes('China')) {
    recommendations.paymentMethods.push(
      { method: '支付宝', score: 95, reason: '中国用户首选' },
      { method: '微信支付', score: 92, reason: '高普及率' },
      { method: '银联', score: 85, reason: '银行卡支付' }
    );
  } else if (customer.location.includes('美国') || customer.location.includes('US')) {
    recommendations.paymentMethods.push(
      { method: 'Apple Pay', score: 94, reason: '一键支付，转化率高' },
      { method: 'Google Pay', score: 90, reason: '安卓用户首选' },
      { method: 'Credit Card', score: 88, reason: '通用支付方式' }
    );
  } else if (customer.location.includes('新加坡') || customer.location.includes('Singapore')) {
    recommendations.paymentMethods.push(
      { method: 'PayNow', score: 93, reason: '本地即时支付' },
      { method: 'GrabPay', score: 89, reason: '东南亚流行' },
      { method: 'Credit Card', score: 85, reason: '通用支付' }
    );
  } else {
    recommendations.paymentMethods.push(
      { method: 'Credit Card', score: 90, reason: '全球通用' },
      { method: 'PayPal', score: 88, reason: '国际认可' },
      { method: 'USDT', score: 75, reason: '加密货币支付' }
    );
  }

  // 根据设备优化
  if (customer.device === 'mobile') {
    recommendations.optimizations.push('启用一键支付');
    recommendations.optimizations.push('简化表单字段');
    recommendations.optimizations.push('使用生物识别验证');
  }

  // 根据信任度调整验证
  if (customer.trustLevel === 'verified') {
    recommendations.authChallenges = [];
    recommendations.conversionProbability += 10;
    recommendations.optimizations.push('跳过额外验证');
  } else if (customer.trustLevel === 'low' || customer.isNewCustomer) {
    recommendations.requiredFields.push('phone', 'address');
    recommendations.authChallenges.push('3DS验证');
    recommendations.conversionProbability -= 15;
  }

  // 高金额交易需要额外验证
  if (transaction.isHighValue || transaction.amount > 5000) {
    recommendations.requiredFields.push('phone');
    recommendations.authChallenges.push('短信验证');
    recommendations.fraudRisk = 'medium';
    recommendations.conversionProbability -= 5;
  }

  // 计算欺诈风险
  if (customer.riskScore > 70) {
    recommendations.fraudRisk = 'high';
    recommendations.authChallenges.push('人工审核');
    recommendations.conversionProbability -= 20;
  } else if (customer.riskScore > 40) {
    recommendations.fraudRisk = 'medium';
    recommendations.authChallenges.push('设备指纹验证');
  }

  return recommendations;
};

// 智能结账体验组件
export function SmartCheckout() {
  const [amount, setAmount] = useState('299.99');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  // 模拟客户画像
  const [customer] = useState<CustomerProfile>({
    id: 'cust-123',
    device: 'mobile',
    location: '中国上海',
    language: 'zh-CN',
    currency: 'CNY',
    isNewCustomer: false,
    previousPurchases: 12,
    averageOrderValue: 450,
    preferredPaymentMethods: ['支付宝', '微信支付'],
    riskScore: 15,
    trustLevel: 'high',
  });

  // 模拟交易上下文
  const [transaction] = useState<TransactionContext>({
    amount: 299.99,
    currency: 'CNY',
    merchantCategory: 'retail',
    items: [
      { name: '智能手表', price: 199.99, category: '电子产品' },
      { name: '保护壳', price: 49.99, category: '配件' },
      { name: '充电线', price: 50.01, category: '配件' },
    ],
    isSubscription: false,
    isHighValue: false,
  });

  // 生成AI推荐
  useEffect(() => {
    if (aiEnabled) {
      const rec = generateAIRecommendation(customer, transaction);
      setRecommendation(rec);
      if (rec.paymentMethods.length > 0) {
        setSelectedMethod(rec.paymentMethods[0].method);
      }
    }
  }, [aiEnabled, customer, transaction]);

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    toast.success('支付成功！订单已确认');
  };

  return (
    <div className="space-y-6">
      {/* AI 状态指示 */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Brain size={28} weight="duotone" className="text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">AI 智能结账优化</div>
                <div className="text-sm text-muted-foreground">
                  根据您的偏好自动优化支付体验
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm">AI优化</span>
              <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 结账表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning size={24} weight="duotone" className="text-yellow-500" />
              快速结账
            </CardTitle>
            <CardDescription>
              {aiEnabled ? '已为您智能优化支付流程' : '标准结账流程'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 订单摘要 */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">订单金额</div>
              <div className="text-3xl font-bold">¥{amount}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {transaction.items.length} 件商品
              </div>
            </div>

            {/* AI 推荐的支付方式 */}
            {recommendation && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkle size={16} className="text-purple-500" />
                  推荐支付方式
                </Label>
                <div className="space-y-2">
                  {recommendation.paymentMethods.map((pm, idx) => (
                    <div
                      key={pm.method}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === pm.method
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedMethod(pm.method)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            pm.method.includes('支付宝') ? 'bg-blue-100 text-blue-600' :
                            pm.method.includes('微信') ? 'bg-green-100 text-green-600' :
                            pm.method.includes('Apple') ? 'bg-gray-100 text-gray-800' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            <CreditCard size={24} weight="duotone" />
                          </div>
                          <div>
                            <div className="font-medium">{pm.method}</div>
                            <div className="text-xs text-muted-foreground">{pm.reason}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <Badge className="bg-green-500">推荐</Badge>
                          )}
                          <Badge variant="outline">{pm.score}%</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 必填字段 */}
            {recommendation && recommendation.requiredFields.length > 0 && (
              <div className="space-y-3">
                <Label>必要信息</Label>
                {recommendation.requiredFields.includes('email') && (
                  <Input placeholder="电子邮箱" type="email" />
                )}
                {recommendation.requiredFields.includes('phone') && (
                  <Input placeholder="手机号码" type="tel" />
                )}
                {recommendation.requiredFields.includes('address') && (
                  <Input placeholder="收货地址" />
                )}
              </div>
            )}

            {/* 验证挑战提示 */}
            {recommendation && recommendation.authChallenges.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Lock size={18} />
                  <span className="text-sm font-medium">需要额外验证</span>
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  {recommendation.authChallenges.join('、')}
                </div>
              </div>
            )}

            {/* 支付按钮 */}
            <Button
              className="w-full h-14 text-lg gap-2"
              onClick={handlePayment}
              disabled={processing || !selectedMethod}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  处理中...
                </>
              ) : (
                <>
                  <Lightning size={24} weight="bold" />
                  立即支付 ¥{amount}
                </>
              )}
            </Button>

            {/* 安全提示 */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock size={14} />
              <span>256位SSL加密保护</span>
              <span>•</span>
              <ShieldCheck size={14} />
              <span>PCI-DSS认证</span>
            </div>
          </CardContent>
        </Card>

        {/* AI 分析面板 */}
        <div className="space-y-6">
          {/* 客户画像 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User size={20} weight="duotone" />
                客户画像分析
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DeviceMobile size={16} />
                    设备
                  </div>
                  <div className="font-medium mt-1">{customer.device}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    位置
                  </div>
                  <div className="font-medium mt-1">{customer.location}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    历史订单
                  </div>
                  <div className="font-medium mt-1">{customer.previousPurchases} 笔</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChartLine size={16} />
                    平均消费
                  </div>
                  <div className="font-medium mt-1">¥{customer.averageOrderValue}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>信任等级</span>
                  <Badge variant={customer.trustLevel === 'verified' ? 'default' : 'secondary'}>
                    {customer.trustLevel === 'verified' ? '已验证' :
                     customer.trustLevel === 'high' ? '高' :
                     customer.trustLevel === 'medium' ? '中' : '低'}
                  </Badge>
                </div>
                <Progress value={customer.trustLevel === 'verified' ? 100 : customer.trustLevel === 'high' ? 80 : 50} />
              </div>
            </CardContent>
          </Card>

          {/* 风险与转化分析 */}
          {recommendation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck size={20} weight="duotone" />
                  风险与转化分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">欺诈风险</div>
                    <div className={`text-2xl font-bold ${
                      recommendation.fraudRisk === 'low' ? 'text-green-600' :
                      recommendation.fraudRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {recommendation.fraudRisk === 'low' ? '低' :
                       recommendation.fraudRisk === 'medium' ? '中' : '高'}
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">转化概率</div>
                    <div className="text-2xl font-bold text-green-600">
                      {recommendation.conversionProbability}%
                    </div>
                  </div>
                </div>

                {recommendation.optimizations.length > 0 && (
                  <div className="space-y-2">
                    <Label>AI 优化措施</Label>
                    <div className="space-y-1">
                      {recommendation.optimizations.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle size={16} className="text-green-500" />
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Fingerprint size={20} weight="duotone" />
                快速验证
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-2 justify-start">
                <Fingerprint size={20} />
                使用指纹验证
              </Button>
              <Button variant="outline" className="w-full gap-2 justify-start">
                <Eye size={20} />
                使用面部识别
              </Button>
              <Button variant="outline" className="w-full gap-2 justify-start">
                <DeviceMobile size={20} />
                发送验证码
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// AI 防欺诈系统
export function AIFraudPrevention() {
  const [transactions] = useState([
    { id: 1, amount: 299, risk: 8, status: 'approved', method: '支付宝', time: '刚刚' },
    { id: 2, amount: 1500, risk: 35, status: 'review', method: '信用卡', time: '2分钟前' },
    { id: 3, amount: 50000, risk: 85, status: 'blocked', method: 'Wire', time: '5分钟前' },
    { id: 4, amount: 420, risk: 12, status: 'approved', method: '微信', time: '8分钟前' },
    { id: 5, amount: 8800, risk: 55, status: 'challenge', method: 'PayPal', time: '15分钟前' },
  ]);

  const stats = {
    totalTransactions: 1234,
    blockedFraud: 23,
    challengesSent: 45,
    falsePositiveRate: 0.8,
    fraudSaved: 125000,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot size={24} weight="duotone" className="text-red-500" />
          AI 智能防欺诈
        </CardTitle>
        <CardDescription>实时检测可疑交易，保护商户和用户</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700">今日交易</div>
            <div className="text-2xl font-bold text-blue-800">{stats.totalTransactions}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-700">已拦截</div>
            <div className="text-2xl font-bold text-red-800">{stats.blockedFraud}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-yellow-700">挑战验证</div>
            <div className="text-2xl font-bold text-yellow-800">{stats.challengesSent}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-700">误报率</div>
            <div className="text-2xl font-bold text-green-800">{stats.falsePositiveRate}%</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-700">挽回损失</div>
            <div className="text-2xl font-bold text-purple-800">¥{(stats.fraudSaved / 10000).toFixed(1)}万</div>
          </div>
        </div>

        {/* 实时交易监控 */}
        <div className="space-y-3">
          <Label>实时交易监控</Label>
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tx.status === 'approved' ? 'bg-green-100 text-green-600' :
                  tx.status === 'blocked' ? 'bg-red-100 text-red-600' :
                  tx.status === 'challenge' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {tx.status === 'approved' ? <CheckCircle size={24} weight="fill" /> :
                   tx.status === 'blocked' ? <XCircle size={24} weight="fill" /> :
                   <Warning size={24} weight="fill" />}
                </div>
                <div>
                  <div className="font-medium">¥{tx.amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{tx.method} • {tx.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">风险分数</div>
                  <div className={`font-bold ${
                    tx.risk < 30 ? 'text-green-600' :
                    tx.risk < 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {tx.risk}
                  </div>
                </div>
                <Badge variant={
                  tx.status === 'approved' ? 'default' :
                  tx.status === 'blocked' ? 'destructive' : 'secondary'
                }>
                  {tx.status === 'approved' ? '通过' :
                   tx.status === 'blocked' ? '拦截' :
                   tx.status === 'challenge' ? '验证中' : '审核中'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 转化率优化面板
export function ConversionOptimizer() {
  const [testResults] = useState([
    { variant: '一键支付按钮', conversion: 4.2, baseline: 3.8, lift: '+10.5%', winner: true },
    { variant: '简化表单', conversion: 4.0, baseline: 3.8, lift: '+5.3%', winner: false },
    { variant: '本地支付优先', conversion: 4.5, baseline: 3.8, lift: '+18.4%', winner: true },
    { variant: '信任徽章', conversion: 3.9, baseline: 3.8, lift: '+2.6%', winner: false },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendUp size={24} weight="duotone" className="text-green-500" />
          转化率智能优化
        </CardTitle>
        <CardDescription>AI 自动进行 A/B 测试并选择最优方案</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 当前转化率 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-sm text-green-700">当前转化率</div>
            <div className="text-3xl font-bold text-green-800">4.5%</div>
            <div className="text-xs text-green-600">+18.4% vs 基准</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-sm text-blue-700">弃购率</div>
            <div className="text-3xl font-bold text-blue-800">12.3%</div>
            <div className="text-xs text-blue-600">-5.2% vs 上周</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-sm text-purple-700">平均结账时间</div>
            <div className="text-3xl font-bold text-purple-800">28s</div>
            <div className="text-xs text-purple-600">-8s vs 优化前</div>
          </div>
        </div>

        {/* A/B 测试结果 */}
        <div className="space-y-3">
          <Label>AI A/B 测试结果</Label>
          {testResults.map((test, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{test.variant}</span>
                  {test.winner && (
                    <Badge className="bg-green-500">胜出</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${test.winner ? 'text-green-600' : ''}`}>
                    {test.lift}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={test.conversion / 5 * 100} className="flex-1" />
                <span className="text-sm font-medium w-12">{test.conversion}%</span>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full gap-2">
          <Sparkle size={20} />
          应用所有胜出方案
        </Button>
      </CardContent>
    </Card>
  );
}

// 智能支付配置面板
export function SmartPaymentConfig() {
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState('medium');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gear size={24} weight="duotone" />
          智能支付配置
        </CardTitle>
        <CardDescription>配置AI优化参数</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">自动优化</div>
            <div className="text-sm text-muted-foreground">AI 自动选择最优支付方案</div>
          </div>
          <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
        </div>

        <div className="space-y-2">
          <Label>风险容忍度</Label>
          <Select value={riskThreshold} onValueChange={setRiskThreshold}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低 - 严格防控，可能影响转化</SelectItem>
              <SelectItem value="medium">中 - 平衡防控与转化</SelectItem>
              <SelectItem value="high">高 - 优先转化，放宽防控</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">智能验证</div>
            <div className="text-sm text-muted-foreground">根据风险等级自动选择验证方式</div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">本地化支付</div>
            <div className="text-sm text-muted-foreground">根据用户位置优先展示本地支付方式</div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">一键支付</div>
            <div className="text-sm text-muted-foreground">为高信任用户启用快速支付</div>
          </div>
          <Switch defaultChecked />
        </div>

        <Button className="w-full gap-2">
          <CheckCircle size={20} />
          保存配置
        </Button>
      </CardContent>
    </Card>
  );
}
