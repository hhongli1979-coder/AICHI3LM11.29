/**
 * JeePay Third-Party Payment Integration
 * JeePay 第三方支付集成
 * 
 * 基于 https://github.com/jeequan/jeepay
 * 
 * Features:
 * - 支付宝 (Alipay)
 * - 微信支付 (WeChat Pay)
 * - 云闪付 (UnionPay)
 * - 多种支付渠道管理
 * - API 开关控制
 */

// 支付渠道类型
export type PaymentChannel = 
  | 'alipay'      // 支付宝
  | 'wxpay'       // 微信支付
  | 'unionpay'    // 云闪付
  | 'paypal'      // PayPal
  | 'stripe'      // Stripe
  | 'crypto';     // 加密货币

// 支付方式
export type PaymentMethod = 
  | 'native'      // 原生支付
  | 'jsapi'       // JSAPI
  | 'h5'          // H5支付
  | 'app'         // APP支付
  | 'qrcode'      // 扫码支付
  | 'bar'         // 付款码
  | 'web';        // 网页支付

// 订单状态
export type OrderStatus = 
  | 'pending'     // 待支付
  | 'paid'        // 已支付
  | 'failed'      // 支付失败
  | 'cancelled'   // 已取消
  | 'refunded';   // 已退款

// 支付渠道配置
export interface PaymentChannelConfig {
  id: string;
  channel: PaymentChannel;
  name: string;
  icon: string;
  enabled: boolean;
  priority: number;
  methods: PaymentMethod[];
  config: {
    appId?: string;
    mchId?: string;
    apiKey?: string;
    apiSecret?: string;
    notifyUrl?: string;
    returnUrl?: string;
    sandbox?: boolean;
  };
  limits: {
    minAmount: number;
    maxAmount: number;
    dailyLimit: number;
  };
  fees: {
    rate: number;      // 费率 (%)
    fixed: number;     // 固定费用
  };
  statistics: {
    totalOrders: number;
    totalAmount: number;
    successRate: number;
  };
}

// 支付订单
export interface PaymentOrder {
  id: string;
  orderNo: string;
  channel: PaymentChannel;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: OrderStatus;
  subject: string;
  body?: string;
  clientIp?: string;
  createdAt: number;
  paidAt?: number;
  expireAt?: number;
  notifyUrl?: string;
  returnUrl?: string;
  extra?: Record<string, any>;
}

// 默认支付渠道配置
export const DEFAULT_PAYMENT_CHANNELS: PaymentChannelConfig[] = [
  {
    id: 'alipay-001',
    channel: 'alipay',
    name: '支付宝',
    icon: '💳',
    enabled: true,
    priority: 1,
    methods: ['native', 'jsapi', 'h5', 'app', 'qrcode', 'bar', 'web'],
    config: {
      appId: '',
      mchId: '',
      apiKey: '',
      notifyUrl: '/api/payment/notify/alipay',
      sandbox: true,
    },
    limits: {
      minAmount: 0.01,
      maxAmount: 500000,
      dailyLimit: 1000000,
    },
    fees: {
      rate: 0.6,
      fixed: 0,
    },
    statistics: {
      totalOrders: 12500,
      totalAmount: 2580000,
      successRate: 99.2,
    },
  },
  {
    id: 'wxpay-001',
    channel: 'wxpay',
    name: '微信支付',
    icon: '💬',
    enabled: true,
    priority: 2,
    methods: ['native', 'jsapi', 'h5', 'app', 'qrcode'],
    config: {
      appId: '',
      mchId: '',
      apiKey: '',
      notifyUrl: '/api/payment/notify/wxpay',
      sandbox: true,
    },
    limits: {
      minAmount: 0.01,
      maxAmount: 500000,
      dailyLimit: 1000000,
    },
    fees: {
      rate: 0.6,
      fixed: 0,
    },
    statistics: {
      totalOrders: 18900,
      totalAmount: 3420000,
      successRate: 99.5,
    },
  },
  {
    id: 'unionpay-001',
    channel: 'unionpay',
    name: '云闪付',
    icon: '💎',
    enabled: true,
    priority: 3,
    methods: ['native', 'h5', 'app', 'qrcode'],
    config: {
      mchId: '',
      apiKey: '',
      notifyUrl: '/api/payment/notify/unionpay',
      sandbox: true,
    },
    limits: {
      minAmount: 1,
      maxAmount: 1000000,
      dailyLimit: 5000000,
    },
    fees: {
      rate: 0.38,
      fixed: 0,
    },
    statistics: {
      totalOrders: 5600,
      totalAmount: 1850000,
      successRate: 98.8,
    },
  },
  {
    id: 'paypal-001',
    channel: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    enabled: false,
    priority: 4,
    methods: ['web', 'app'],
    config: {
      appId: '',
      apiSecret: '',
      notifyUrl: '/api/payment/notify/paypal',
      sandbox: true,
    },
    limits: {
      minAmount: 1,
      maxAmount: 10000,
      dailyLimit: 50000,
    },
    fees: {
      rate: 3.4,
      fixed: 0.35,
    },
    statistics: {
      totalOrders: 890,
      totalAmount: 125000,
      successRate: 97.5,
    },
  },
  {
    id: 'stripe-001',
    channel: 'stripe',
    name: 'Stripe',
    icon: '💳',
    enabled: false,
    priority: 5,
    methods: ['web', 'app'],
    config: {
      apiKey: '',
      apiSecret: '',
      notifyUrl: '/api/payment/notify/stripe',
      sandbox: true,
    },
    limits: {
      minAmount: 0.5,
      maxAmount: 999999,
      dailyLimit: 10000000,
    },
    fees: {
      rate: 2.9,
      fixed: 0.30,
    },
    statistics: {
      totalOrders: 2100,
      totalAmount: 458000,
      successRate: 99.1,
    },
  },
  {
    id: 'crypto-001',
    channel: 'crypto',
    name: '加密货币',
    icon: '₿',
    enabled: true,
    priority: 6,
    methods: ['qrcode', 'web'],
    config: {
      notifyUrl: '/api/payment/notify/crypto',
    },
    limits: {
      minAmount: 1,
      maxAmount: 1000000,
      dailyLimit: 10000000,
    },
    fees: {
      rate: 1.0,
      fixed: 0,
    },
    statistics: {
      totalOrders: 3200,
      totalAmount: 890000,
      successRate: 99.8,
    },
  },
];

// 模拟订单历史
export const MOCK_ORDERS: PaymentOrder[] = [
  {
    id: 'order-001',
    orderNo: 'PAY20231203001',
    channel: 'alipay',
    method: 'qrcode',
    amount: 199.00,
    currency: 'CNY',
    status: 'paid',
    subject: '商品购买',
    createdAt: Date.now() - 3600000,
    paidAt: Date.now() - 3500000,
  },
  {
    id: 'order-002',
    orderNo: 'PAY20231203002',
    channel: 'wxpay',
    method: 'jsapi',
    amount: 88.50,
    currency: 'CNY',
    status: 'paid',
    subject: '服务订阅',
    createdAt: Date.now() - 7200000,
    paidAt: Date.now() - 7100000,
  },
  {
    id: 'order-003',
    orderNo: 'PAY20231203003',
    channel: 'crypto',
    method: 'qrcode',
    amount: 500.00,
    currency: 'USDT',
    status: 'pending',
    subject: '加密充值',
    createdAt: Date.now() - 1800000,
    expireAt: Date.now() + 1800000,
  },
  {
    id: 'order-004',
    orderNo: 'PAY20231203004',
    channel: 'unionpay',
    method: 'h5',
    amount: 1250.00,
    currency: 'CNY',
    status: 'paid',
    subject: '大额转账',
    createdAt: Date.now() - 86400000,
    paidAt: Date.now() - 86300000,
  },
  {
    id: 'order-005',
    orderNo: 'PAY20231203005',
    channel: 'alipay',
    method: 'native',
    amount: 35.00,
    currency: 'CNY',
    status: 'failed',
    subject: '测试订单',
    createdAt: Date.now() - 172800000,
  },
];

// JeePay API 模拟
export class JeePayAPI {
  private channels: PaymentChannelConfig[];
  private orders: PaymentOrder[];

  constructor() {
    this.channels = [...DEFAULT_PAYMENT_CHANNELS];
    this.orders = [...MOCK_ORDERS];
  }

  // 获取所有支付渠道
  getChannels(): PaymentChannelConfig[] {
    return this.channels;
  }

  // 获取启用的支付渠道
  getEnabledChannels(): PaymentChannelConfig[] {
    return this.channels.filter(c => c.enabled).sort((a, b) => a.priority - b.priority);
  }

  // 更新渠道状态
  toggleChannel(channelId: string, enabled: boolean): PaymentChannelConfig | null {
    const channel = this.channels.find(c => c.id === channelId);
    if (channel) {
      channel.enabled = enabled;
      return channel;
    }
    return null;
  }

  // 更新渠道配置
  updateChannelConfig(channelId: string, config: Partial<PaymentChannelConfig['config']>): PaymentChannelConfig | null {
    const channel = this.channels.find(c => c.id === channelId);
    if (channel) {
      channel.config = { ...channel.config, ...config };
      return channel;
    }
    return null;
  }

  // 创建支付订单
  async createOrder(params: {
    channel: PaymentChannel;
    method: PaymentMethod;
    amount: number;
    currency: string;
    subject: string;
    body?: string;
    notifyUrl?: string;
    returnUrl?: string;
  }): Promise<PaymentOrder> {
    const orderNo = `PAY${Date.now()}`;
    const order: PaymentOrder = {
      id: `order-${Date.now()}`,
      orderNo,
      channel: params.channel,
      method: params.method,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      subject: params.subject,
      body: params.body,
      createdAt: Date.now(),
      expireAt: Date.now() + 3600000, // 1小时过期
      notifyUrl: params.notifyUrl,
      returnUrl: params.returnUrl,
    };

    this.orders.unshift(order);
    return order;
  }

  // 查询订单
  getOrder(orderNo: string): PaymentOrder | null {
    return this.orders.find(o => o.orderNo === orderNo) || null;
  }

  // 获取订单列表
  getOrders(params?: {
    channel?: PaymentChannel;
    status?: OrderStatus;
    startDate?: number;
    endDate?: number;
    page?: number;
    pageSize?: number;
  }): { orders: PaymentOrder[]; total: number } {
    let filtered = [...this.orders];

    if (params?.channel) {
      filtered = filtered.filter(o => o.channel === params.channel);
    }
    if (params?.status) {
      filtered = filtered.filter(o => o.status === params.status);
    }
    if (params?.startDate) {
      filtered = filtered.filter(o => o.createdAt >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter(o => o.createdAt <= params.endDate!);
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const orders = filtered.slice(start, start + pageSize);

    return { orders, total: filtered.length };
  }

  // 模拟支付成功
  async simulatePayment(orderNo: string): Promise<PaymentOrder | null> {
    const order = this.orders.find(o => o.orderNo === orderNo);
    if (order && order.status === 'pending') {
      order.status = 'paid';
      order.paidAt = Date.now();
      return order;
    }
    return null;
  }

  // 退款
  async refund(orderNo: string): Promise<PaymentOrder | null> {
    const order = this.orders.find(o => o.orderNo === orderNo);
    if (order && order.status === 'paid') {
      order.status = 'refunded';
      return order;
    }
    return null;
  }

  // 取消订单
  async cancelOrder(orderNo: string): Promise<PaymentOrder | null> {
    const order = this.orders.find(o => o.orderNo === orderNo);
    if (order && order.status === 'pending') {
      order.status = 'cancelled';
      return order;
    }
    return null;
  }

  // 获取统计数据
  getStatistics(): {
    totalChannels: number;
    enabledChannels: number;
    totalOrders: number;
    totalAmount: number;
    successRate: number;
    todayOrders: number;
    todayAmount: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const todayOrders = this.orders.filter(o => o.createdAt >= todayStart);
    const paidOrders = this.orders.filter(o => o.status === 'paid');
    const totalOrders = this.orders.length;
    const totalAmount = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    return {
      totalChannels: this.channels.length,
      enabledChannels: this.channels.filter(c => c.enabled).length,
      totalOrders,
      totalAmount,
      successRate: totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0,
      todayOrders: todayOrders.length,
      todayAmount: todayOrders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0),
    };
  }
}

// 全局 JeePay 实例
export const jeepayAPI = new JeePayAPI();

// 格式化金额
export function formatAmount(amount: number, currency: string = 'CNY'): string {
  const symbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    USDT: '',
    BTC: '₿',
    ETH: 'Ξ',
  };
  const symbol = symbols[currency] || '';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${currency === 'USDT' ? ' USDT' : ''}`;
}

// 获取状态颜色
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// 获取状态文本
export function getStatusText(status: OrderStatus): string {
  const texts: Record<OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    failed: '支付失败',
    cancelled: '已取消',
    refunded: '已退款',
  };
  return texts[status] || status;
}

// 获取渠道图标
export function getChannelIcon(channel: PaymentChannel): string {
  const icons: Record<PaymentChannel, string> = {
    alipay: '💳',
    wxpay: '💬',
    unionpay: '💎',
    paypal: '🅿️',
    stripe: '💳',
    crypto: '₿',
  };
  return icons[channel] || '💰';
}
