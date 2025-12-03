import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain,
  Lightning,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  Warning,
  TrendUp,
  TrendDown,
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
  Gear,
  Target,
  Percent,
  CurrencyDollar,
  Users,
  ChartBar,
  Database,
  Cpu,
  Graph,
  ArrowsCounterClockwise,
  Funnel,
  Money
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================
// 类型定义 - AI支付优化系统
// ============================================

// 用户会话信号 (类似Stripe的100个信号)
interface SessionSignals {
  // 设备信号
  device: 'mobile' | 'desktop' | 'tablet';
  os: string;
  browser: string;
  screenSize: string;
  touchCapable: boolean;
  
  // 位置信号
  country: string;
  region: string;
  city: string;
  timezone: string;
  language: string;
  currency: string;
  
  // 用户行为信号
  isReturningCustomer: boolean;
  previousPurchases: number;
  averageOrderValue: number;
  cartAbandonmentRate: number;
  preferredPaymentMethods: string[];
  lastPaymentMethod: string;
  
  // 交易信号
  orderAmount: number;
  itemCount: number;
  itemCategories: string[];
  isSubscription: boolean;
  isHighRisk: boolean;
  
  // 网络信号
  similarMerchantPreferences: string[];
  regionalPopularity: Record<string, number>;
  paymentMethodUptime: Record<string, number>;
  
  // 风险信号
  deviceFingerprint: string;
  ipRiskScore: number;
  velocityScore: number;
  biometricVerified: boolean;
}

// AI优化建议
interface OptimizationResult {
  // 支付方式排序
  paymentMethods: {
    id: string;
    name: string;
    icon: string;
    score: number;
    conversionLift: number;
    reasons: string[];
    isRecommended: boolean;
  }[];
  
  // 表单优化
  formFields: {
    field: string;
    required: boolean;
    reason: string;
  }[];
  
  // 验证策略
  authStrategy: {
    level: 'minimal' | 'standard' | 'enhanced';
    challenges: string[];
    skipReason?: string;
  };
  
  // 布局个性化
  layoutOptimizations: {
    type: string;
    position: string;
    reason: string;
  }[];
  
  // 预测指标
  predictions: {
    conversionProbability: number;
    fraudRisk: number;
    expectedRevenue: number;
    checkoutTime: number;
  };
  
  // 探索-利用平衡
  explorationActions: {
    action: string;
    testGroup: string;
    isExperiment: boolean;
  }[];
}

// 实时分析数据
interface AnalyticsData {
  totalTransactions: number;
  totalVolume: number;
  conversionRate: number;
  fraudRate: number;
  avgCheckoutTime: number;
  topPaymentMethods: { method: string; share: number }[];
  conversionByMethod: Record<string, number>;
  revenueByRegion: Record<string, number>;
}

// ============================================
// AI 优化引擎 (模拟Stripe的AI模型)
// ============================================

const generateOptimization = (signals: SessionSignals): OptimizationResult => {
  const result: OptimizationResult = {
    paymentMethods: [],
    formFields: [],
    authStrategy: { level: 'standard', challenges: [] },
    layoutOptimizations: [],
    predictions: {
      conversionProbability: 75,
      fraudRisk: 5,
      expectedRevenue: signals.orderAmount,
      checkoutTime: 45,
    },
    explorationActions: [],
  };

  // 1. 基于地区的支付方式优化 (类似Stripe的本地化)
  if (signals.country === '中国' || signals.country === 'China' || signals.country === 'CN') {
    result.paymentMethods = [
      { id: 'alipay', name: '支付宝', icon: '💙', score: 98, conversionLift: 23, reasons: ['本地首选', '73%用户曾使用', '转化率最高'], isRecommended: true },
      { id: 'wechat', name: '微信支付', icon: '💚', score: 95, conversionLift: 18, reasons: ['高普及率', '移动端优先'], isRecommended: true },
      { id: 'unionpay', name: '银联', icon: '🔴', score: 85, conversionLift: 8, reasons: ['银行卡支付', '大额交易'], isRecommended: false },
      { id: 'creditcard', name: '信用卡', icon: '💳', score: 70, conversionLift: 0, reasons: ['国际通用'], isRecommended: false },
    ];
  } else if (signals.country === '美国' || signals.country === 'US') {
    result.paymentMethods = [
      { id: 'applepay', name: 'Apple Pay', icon: '🍎', score: 96, conversionLift: 25, reasons: ['一键支付', 'Touch ID验证', '移动端最优'], isRecommended: true },
      { id: 'googlepay', name: 'Google Pay', icon: '🔵', score: 92, conversionLift: 20, reasons: ['Android用户首选'], isRecommended: true },
      { id: 'affirm', name: 'Affirm', icon: '💰', score: 88, conversionLift: 15, reasons: ['分期付款', '大额订单'], isRecommended: signals.orderAmount > 100 },
      { id: 'creditcard', name: 'Credit Card', icon: '💳', score: 80, conversionLift: 0, reasons: ['通用支付'], isRecommended: false },
    ];
  } else if (signals.country === '新加坡' || signals.country === 'Singapore' || signals.country === 'SG') {
    result.paymentMethods = [
      { id: 'paynow', name: 'PayNow', icon: '🇸🇬', score: 94, conversionLift: 20, reasons: ['本地即时支付'], isRecommended: true },
      { id: 'grabpay', name: 'GrabPay', icon: '🟢', score: 90, conversionLift: 15, reasons: ['东南亚流行'], isRecommended: true },
      { id: 'creditcard', name: 'Credit Card', icon: '💳', score: 82, conversionLift: 5, reasons: ['通用支付'], isRecommended: false },
    ];
  } else {
    result.paymentMethods = [
      { id: 'paypal', name: 'PayPal', icon: '🅿️', score: 90, conversionLift: 12, reasons: ['全球认可', '买家保护'], isRecommended: true },
      { id: 'creditcard', name: 'Credit Card', icon: '💳', score: 85, conversionLift: 0, reasons: ['通用支付'], isRecommended: true },
      { id: 'klarna', name: 'Klarna', icon: '💗', score: 80, conversionLift: 10, reasons: ['先买后付'], isRecommended: signals.orderAmount > 50 },
    ];
  }

  // 2. 基于设备优化表单
  if (signals.device === 'mobile') {
    result.formFields = [
      { field: 'email', required: true, reason: '订单确认' },
    ];
    result.layoutOptimizations.push(
      { type: 'form', position: 'top', reason: '移动端用户习惯从上往下' },
      { type: 'payment_methods', position: 'collapsed', reason: '减少滚动' },
      { type: 'one_click', position: 'prominent', reason: '提高转化' }
    );
    result.predictions.checkoutTime = 25;
  } else {
    result.formFields = [
      { field: 'email', required: true, reason: '订单确认' },
      { field: 'phone', required: false, reason: '可选验证' },
    ];
    result.layoutOptimizations.push(
      { type: 'payment_methods', position: 'expanded', reason: '桌面端空间充足' },
      { type: 'upsell', position: 'sidebar', reason: '提高客单价' }
    );
    result.predictions.checkoutTime = 35;
  }

  // 3. 基于用户历史的验证策略
  if (signals.isReturningCustomer && signals.previousPurchases > 3 && signals.ipRiskScore < 20) {
    result.authStrategy = {
      level: 'minimal',
      challenges: [],
      skipReason: '已验证的回头客',
    };
    result.predictions.conversionProbability += 15;
    result.predictions.checkoutTime -= 15;
  } else if (signals.ipRiskScore > 60 || signals.orderAmount > 5000) {
    result.authStrategy = {
      level: 'enhanced',
      challenges: ['3DS验证', '短信验证', '身份确认'],
    };
    result.predictions.conversionProbability -= 10;
    result.predictions.fraudRisk = Math.min(signals.ipRiskScore, 80);
  }

  // 4. 探索-利用策略 (A/B测试)
  result.explorationActions = [
    { action: '本地支付优先展示', testGroup: 'A', isExperiment: false }, // 利用
    { action: '新布局测试', testGroup: Math.random() > 0.9 ? 'B' : 'A', isExperiment: Math.random() > 0.9 }, // 探索
  ];

  // 5. 预测收入
  const conversionBoost = result.paymentMethods[0]?.conversionLift || 0;
  result.predictions.expectedRevenue = signals.orderAmount * (1 + conversionBoost / 100);

  return result;
};

// ============================================
// AI 智能结账主组件
// ============================================

export function AIOptimizedCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // 模拟会话信号
  const [signals] = useState<SessionSignals>({
    device: 'mobile',
    os: 'iOS 17',
    browser: 'Safari',
    screenSize: '390x844',
    touchCapable: true,
    country: '中国',
    region: '上海',
    city: '浦东新区',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    currency: 'CNY',
    isReturningCustomer: true,
    previousPurchases: 8,
    averageOrderValue: 520,
    cartAbandonmentRate: 0.15,
    preferredPaymentMethods: ['alipay', 'wechat'],
    lastPaymentMethod: 'alipay',
    orderAmount: 899,
    itemCount: 3,
    itemCategories: ['电子产品', '配件'],
    isSubscription: false,
    isHighRisk: false,
    similarMerchantPreferences: ['alipay', 'wechat', 'creditcard'],
    regionalPopularity: { alipay: 0.65, wechat: 0.25, unionpay: 0.08 },
    paymentMethodUptime: { alipay: 99.9, wechat: 99.8, unionpay: 99.5 },
    deviceFingerprint: 'fp_abc123',
    ipRiskScore: 12,
    velocityScore: 5,
    biometricVerified: true,
  });

  // 生成AI优化
  useEffect(() => {
    if (aiEnabled) {
      const opt = generateOptimization(signals);
      setOptimization(opt);
      if (opt.paymentMethods.length > 0) {
        setSelectedMethod(opt.paymentMethods[0].id);
      }
    }
  }, [aiEnabled, signals]);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success('🎉 支付成功！AI优化帮助提升了23%转化率');
  };

  return (
    <div className="space-y-6">
      {/* AI状态横幅 */}
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Brain size={32} weight="duotone" className="text-white" />
              </div>
              <div>
                <div className="font-bold text-lg flex items-center gap-2">
                  Stripe 级 AI 智能结账
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">Pro</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  基于 {Object.keys(signals).length}+ 会话信号实时优化 • 探索-利用框架
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowAnalysis(!showAnalysis)}>
                <ChartBar size={18} className="mr-2" />
                {showAnalysis ? '隐藏分析' : '查看分析'}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">AI优化</span>
                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 主结账区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 订单摘要 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">订单摘要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div>
                  <div className="text-3xl font-bold">¥{signals.orderAmount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{signals.itemCount} 件商品</div>
                </div>
                {optimization && (
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">预计转化提升</div>
                    <div className="text-xl font-bold text-green-600">
                      +{optimization.paymentMethods[0]?.conversionLift || 0}%
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI推荐的支付方式 */}
          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle size={20} className="text-purple-500" />
                  AI 智能推荐支付方式
                </CardTitle>
                <CardDescription>
                  基于您的位置({signals.country} {signals.region})、设备({signals.device})和历史偏好动态排序
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {optimization.paymentMethods.map((pm, idx) => (
                  <div
                    key={pm.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedMethod === pm.id
                        ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                        : 'border-transparent bg-gray-50 hover:border-primary/30 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMethod(pm.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{pm.icon}</div>
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {pm.name}
                            {pm.isRecommended && idx === 0 && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">
                                ✨ 最佳匹配
                              </Badge>
                            )}
                            {pm.isRecommended && idx > 0 && (
                              <Badge variant="outline" className="text-xs">推荐</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {pm.reasons.slice(0, 2).join(' • ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">匹配度</div>
                          <Badge variant="secondary">{pm.score}%</Badge>
                        </div>
                        {pm.conversionLift > 0 && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            +{pm.conversionLift}% 转化提升
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 表单字段 (AI优化后) */}
          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock size={18} />
                  {optimization.authStrategy.level === 'minimal' ? '极简验证' : '安全信息'}
                </CardTitle>
                {optimization.authStrategy.skipReason && (
                  <CardDescription className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={14} />
                    {optimization.authStrategy.skipReason} - 已跳过额外验证
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {optimization.formFields.map(field => (
                  <div key={field.field} className="space-y-1">
                    <Label className="flex items-center gap-2">
                      {field.field === 'email' ? '电子邮箱' : field.field === 'phone' ? '手机号码' : field.field}
                      {!field.required && <span className="text-xs text-muted-foreground">(可选)</span>}
                    </Label>
                    <Input 
                      placeholder={field.field === 'email' ? 'your@email.com' : '请输入'}
                      type={field.field === 'email' ? 'email' : 'text'}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 支付按钮 */}
          <Button
            className="w-full h-16 text-xl gap-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                AI 优化支付处理中...
              </>
            ) : (
              <>
                <Lightning size={28} weight="bold" />
                立即支付 ¥{signals.orderAmount.toLocaleString()}
              </>
            )}
          </Button>

          {/* 安全保障 */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock size={14} /> 256位加密</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} /> PCI DSS</span>
            <span className="flex items-center gap-1"><Fingerprint size={14} /> 生物识别</span>
            <span className="flex items-center gap-1"><Brain size={14} /> AI防欺诈</span>
          </div>
        </div>

        {/* 侧边栏 - AI分析面板 */}
        <div className="space-y-6">
          {/* 预测指标 */}
          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target size={18} className="text-purple-500" />
                  AI 预测
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-700">转化概率</div>
                    <div className="text-2xl font-bold text-green-800">
                      {optimization.predictions.conversionProbability}%
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-700">结账时间</div>
                    <div className="text-2xl font-bold text-blue-800">
                      {optimization.predictions.checkoutTime}s
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs text-purple-700">预计收入</div>
                    <div className="text-2xl font-bold text-purple-800">
                      ¥{Math.round(optimization.predictions.expectedRevenue)}
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-xs text-red-700">欺诈风险</div>
                    <div className="text-2xl font-bold text-red-800">
                      {optimization.predictions.fraudRisk}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 会话信号 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database size={18} className="text-blue-500" />
                会话信号
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">设备</span><span>{signals.device} / {signals.os}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">位置</span><span>{signals.country} {signals.city}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">语言</span><span>{signals.language}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">回头客</span><span>{signals.isReturningCustomer ? '是' : '否'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">历史订单</span><span>{signals.previousPurchases} 笔</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">平均消费</span><span>¥{signals.averageOrderValue}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">IP风险</span><span className="text-green-600">{signals.ipRiskScore}分</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">生物验证</span><span>{signals.biometricVerified ? '✓' : '✗'}</span></div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 布局优化 */}
          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gear size={18} />
                  布局个性化
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {optimization.layoutOptimizations.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>{opt.type}: {opt.reason}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 探索-利用 */}
          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowsCounterClockwise size={18} className="text-orange-500" />
                  探索-利用框架
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {optimization.explorationActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                    <span>{action.action}</span>
                    <Badge variant={action.isExperiment ? 'secondary' : 'outline'}>
                      {action.isExperiment ? '🔬 探索' : '✓ 利用'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 详细分析面板 */}
      {showAnalysis && <AIAnalyticsDashboard signals={signals} />}
    </div>
  );
}

// ============================================
// AI 分析仪表盘
// ============================================

function AIAnalyticsDashboard({ signals }: { signals: SessionSignals }) {
  const [analytics] = useState<AnalyticsData>({
    totalTransactions: 125680,
    totalVolume: 14000000000000, // 1.4万亿
    conversionRate: 4.5,
    fraudRate: 0.08,
    avgCheckoutTime: 28,
    topPaymentMethods: [
      { method: '支付宝', share: 35 },
      { method: '微信支付', share: 28 },
      { method: 'Apple Pay', share: 15 },
      { method: '信用卡', share: 12 },
      { method: 'PayPal', share: 10 },
    ],
    conversionByMethod: {
      '支付宝': 5.2,
      '微信支付': 4.8,
      'Apple Pay': 6.1,
      '信用卡': 3.8,
      'PayPal': 4.2,
    },
    revenueByRegion: {
      '中国': 4800,
      '美国': 3200,
      '欧洲': 2100,
      '东南亚': 1500,
      '其他': 2400,
    },
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar size={24} weight="duotone" className="text-blue-500" />
          AI 支付优化分析
        </CardTitle>
        <CardDescription>
          基于 Stripe 级全球网络数据 • 1.4万亿美元交易量 • 73%回头客识别率
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 关键指标 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-sm text-blue-700">全球交易量</div>
            <div className="text-2xl font-bold text-blue-800">$1.4万亿</div>
            <div className="text-xs text-blue-600">占全球GDP 1.3%</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-sm text-green-700">转化率</div>
            <div className="text-2xl font-bold text-green-800">{analytics.conversionRate}%</div>
            <div className="text-xs text-green-600">+18.4% vs 基准</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-sm text-purple-700">回头客识别</div>
            <div className="text-2xl font-bold text-purple-800">73%</div>
            <div className="text-xs text-purple-600">个性化匹配</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-sm text-orange-700">结账时间</div>
            <div className="text-2xl font-bold text-orange-800">{analytics.avgCheckoutTime}s</div>
            <div className="text-xs text-orange-600">-8s 优化后</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <div className="text-sm text-red-700">欺诈率</div>
            <div className="text-2xl font-bold text-red-800">{analytics.fraudRate}%</div>
            <div className="text-xs text-red-600">-30% AI防控</div>
          </div>
        </div>

        {/* 支付方式转化对比 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-3 block">支付方式市场份额</Label>
            <div className="space-y-3">
              {analytics.topPaymentMethods.map(pm => (
                <div key={pm.method} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{pm.method}</span>
                    <span className="font-medium">{pm.share}%</span>
                  </div>
                  <Progress value={pm.share} className="h-2" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-3 block">各支付方式转化率</Label>
            <div className="space-y-3">
              {Object.entries(analytics.conversionByMethod).map(([method, rate]) => (
                <div key={method} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">{method}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={rate * 15} className="w-24 h-2" />
                    <span className="font-bold text-sm w-12">{rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI优化效果 */}
        <div className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 rounded-xl">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold">AI 优化效果</div>
            <div className="text-muted-foreground">实时个性化 • 动态排序 • 智能防欺诈</div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-muted-foreground">收入增长</div>
              <div className="text-xs">动态展示本地支付</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">+7.4%</div>
              <div className="text-sm text-muted-foreground">转化率提升</div>
              <div className="text-xs">智能支付方式排序</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600">-30%</div>
              <div className="text-sm text-muted-foreground">欺诈率下降</div>
              <div className="text-xs">动态验证策略</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Pay-Java-Parent 集成配置
// ============================================

export function PayJavaIntegration() {
  const [channels, setChannels] = useState([
    { id: 'ali', name: '支付宝', enabled: true, configured: true, sdk: 'pay-java-ali' },
    { id: 'wx', name: '微信支付', enabled: true, configured: true, sdk: 'pay-java-wx' },
    { id: 'union', name: '银联', enabled: true, configured: false, sdk: 'pay-java-union' },
    { id: 'paypal', name: 'PayPal', enabled: false, configured: false, sdk: 'pay-java-paypal' },
    { id: 'baidu', name: '百度钱包', enabled: false, configured: false, sdk: 'pay-java-baidu' },
    { id: 'fuiou', name: '富友支付', enabled: false, configured: false, sdk: 'pay-java-fuiou' },
    { id: 'payoneer', name: 'Payoneer', enabled: false, configured: false, sdk: 'pay-java-payoneer' },
    { id: 'yiji', name: '易极付', enabled: false, configured: false, sdk: 'pay-java-yiji' },
  ]);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    toast.success('配置已更新');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu size={24} weight="duotone" className="text-green-500" />
          Pay-Java-Parent SDK 集成
        </CardTitle>
        <CardDescription>
          开源多渠道支付SDK • 支持支付宝/微信/银联/PayPal等
          <a href="https://github.com/egzosn/pay-java-parent" target="_blank" className="text-primary ml-2">
            GitHub →
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {channels.map(channel => (
            <div 
              key={channel.id}
              className={`p-4 border rounded-lg ${channel.enabled ? 'border-green-200 bg-green-50/50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    channel.id === 'ali' ? 'bg-blue-100 text-blue-600' :
                    channel.id === 'wx' ? 'bg-green-100 text-green-600' :
                    channel.id === 'union' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <CreditCard size={24} weight="duotone" />
                  </div>
                  <div>
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-xs text-muted-foreground">{channel.sdk}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={channel.configured ? 'default' : 'secondary'}>
                    {channel.configured ? '已配置' : '未配置'}
                  </Badge>
                  <Switch checked={channel.enabled} onCheckedChange={() => toggleChannel(channel.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="font-medium mb-2">Maven 依赖</div>
          <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`<dependency>
  <groupId>com.egzosn</groupId>
  <artifactId>pay-java-ali</artifactId>
  <version>2.14.7</version>
</dependency>
<dependency>
  <groupId>com.egzosn</groupId>
  <artifactId>pay-java-wx</artifactId>
  <version>2.14.7</version>
</dependency>`}
          </pre>
        </div>

        <Button className="w-full gap-2">
          <CheckCircle size={20} />
          保存SDK配置
        </Button>
      </CardContent>
    </Card>
  );
}
