import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Microphone, 
  MicrophoneSlash,
  SpeakerHigh,
  Robot,
  Lightning,
  CurrencyDollar,
  QrCode,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  ArrowRight,
  Brain,
  Waveform,
  ChatCircleDots,
  CreditCard,
  Bank
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  amount?: number;
  currency?: string;
  recipient?: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: number;
  response?: string;
}

interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  method: string;
  qrCode?: string;
  status: 'waiting' | 'paid' | 'expired';
  createdAt: number;
  paidAt?: number;
}

// 语音命令解析器
const parseVoiceCommand = (text: string): { action: string; params: Record<string, unknown> } | null => {
  const lowerText = text.toLowerCase();
  
  // 收款命令
  if (lowerText.includes('收') || lowerText.includes('收款') || lowerText.includes('收钱')) {
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;
    
    let currency = 'CNY';
    if (lowerText.includes('美元') || lowerText.includes('美金') || lowerText.includes('dollar')) currency = 'USD';
    if (lowerText.includes('usdt')) currency = 'USDT';
    if (lowerText.includes('eth') || lowerText.includes('以太')) currency = 'ETH';
    if (lowerText.includes('btc') || lowerText.includes('比特币')) currency = 'BTC';
    
    let method = 'qrcode';
    if (lowerText.includes('支付宝')) method = 'alipay';
    if (lowerText.includes('微信')) method = 'wechat';
    if (lowerText.includes('银行')) method = 'bank';
    if (lowerText.includes('加密') || lowerText.includes('crypto')) method = 'crypto';
    
    return { action: 'collect', params: { amount, currency, method } };
  }
  
  // 转账命令
  if (lowerText.includes('转') || lowerText.includes('转账') || lowerText.includes('发送')) {
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;
    
    let recipient = '';
    if (lowerText.includes('给')) {
      const parts = lowerText.split('给');
      if (parts[1]) {
        recipient = parts[1].trim().split(/\s+/)[0];
      }
    }
    
    return { action: 'transfer', params: { amount, recipient } };
  }
  
  // 查询余额
  if (lowerText.includes('余额') || lowerText.includes('还有多少') || lowerText.includes('balance')) {
    return { action: 'balance', params: {} };
  }
  
  // 查询交易
  if (lowerText.includes('交易') || lowerText.includes('记录') || lowerText.includes('历史')) {
    return { action: 'history', params: {} };
  }
  
  // 汇率查询
  if (lowerText.includes('汇率') || lowerText.includes('价格') || lowerText.includes('多少钱')) {
    let coin = 'BTC';
    if (lowerText.includes('eth') || lowerText.includes('以太')) coin = 'ETH';
    if (lowerText.includes('usdt')) coin = 'USDT';
    if (lowerText.includes('bnb')) coin = 'BNB';
    
    return { action: 'price', params: { coin } };
  }
  
  // 生成收款码
  if (lowerText.includes('收款码') || lowerText.includes('二维码')) {
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    return { action: 'qrcode', params: { amount: amountMatch ? parseFloat(amountMatch[1]) : undefined } };
  }
  
  return null;
};

// 模拟语音合成
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

export function VoicePaymentAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [activePayment, setActivePayment] = useState<PaymentRequest | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [confidence, setConfidence] = useState(0);

  // 模拟钱包余额
  const balances = {
    CNY: 125432.50,
    USD: 15230.80,
    USDT: 50000,
    ETH: 12.5,
    BTC: 0.85,
  };

  // 处理语音命令
  const processCommand = useCallback(async (text: string) => {
    const parsed = parseVoiceCommand(text);
    
    if (!parsed) {
      const response = '抱歉，我没有理解您的命令。您可以说"收款100元"、"查询余额"、"转账给小明"等。';
      if (voiceEnabled) speak(response);
      toast.error(response);
      return;
    }

    const command: VoiceCommand = {
      id: `cmd-${Date.now()}`,
      command: text,
      action: parsed.action,
      amount: parsed.params.amount as number,
      currency: parsed.params.currency as string,
      status: 'pending',
      timestamp: Date.now(),
    };

    setCommands(prev => [command, ...prev]);

    // 执行命令
    command.status = 'executing';
    setCommands(prev => prev.map(c => c.id === command.id ? command : c));

    await new Promise(resolve => setTimeout(resolve, 1000));

    let response = '';

    switch (parsed.action) {
      case 'collect':
        const amount = parsed.params.amount as number || 0;
        const currency = parsed.params.currency as string || 'CNY';
        const method = parsed.params.method as string || 'qrcode';
        
        // 创建收款请求
        const payment: PaymentRequest = {
          id: `pay-${Date.now()}`,
          amount,
          currency,
          method,
          status: 'waiting',
          createdAt: Date.now(),
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=omnicore://pay?amount=${amount}&currency=${currency}`,
        };
        setActivePayment(payment);
        
        response = amount > 0 
          ? `好的，正在生成${amount}${currency}的收款码，请让客户扫码支付。`
          : '请告诉我收款金额。';
        command.response = response;
        command.status = 'completed';
        break;

      case 'transfer':
        const transferAmount = parsed.params.amount as number;
        const recipient = parsed.params.recipient as string;
        
        if (!transferAmount) {
          response = '请告诉我转账金额。';
          command.status = 'failed';
        } else if (!recipient) {
          response = `请告诉我转账给谁。金额：${transferAmount}元。`;
          command.status = 'pending';
        } else {
          response = autoConfirm 
            ? `已成功转账${transferAmount}元给${recipient}。`
            : `确认转账${transferAmount}元给${recipient}？请说"确认"或"取消"。`;
          command.status = autoConfirm ? 'completed' : 'pending';
        }
        command.response = response;
        break;

      case 'balance':
        response = `您的账户余额：人民币${balances.CNY.toLocaleString()}元，USDT ${balances.USDT.toLocaleString()}，ETH ${balances.ETH}个，BTC ${balances.BTC}个。`;
        command.response = response;
        command.status = 'completed';
        break;

      case 'price':
        const prices: Record<string, number> = { BTC: 97500, ETH: 3450, BNB: 310, USDT: 1 };
        const coin = parsed.params.coin as string;
        response = `${coin}当前价格：${prices[coin]?.toLocaleString() || '未知'}美元。`;
        command.response = response;
        command.status = 'completed';
        break;

      case 'qrcode':
        const qrAmount = parsed.params.amount as number || 0;
        setActivePayment({
          id: `pay-${Date.now()}`,
          amount: qrAmount,
          currency: 'CNY',
          method: 'qrcode',
          status: 'waiting',
          createdAt: Date.now(),
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=omnicore://pay?amount=${qrAmount}`,
        });
        response = qrAmount > 0 
          ? `已生成${qrAmount}元收款码。`
          : '已生成通用收款码。';
        command.response = response;
        command.status = 'completed';
        break;

      case 'history':
        response = '您最近有3笔交易：收款500元（已完成），转账200元给张三（已完成），收款1000 USDT（待确认）。';
        command.response = response;
        command.status = 'completed';
        break;

      default:
        response = '正在处理您的请求...';
        command.status = 'completed';
    }

    setCommands(prev => prev.map(c => c.id === command.id ? command : c));

    if (voiceEnabled && response) {
      setIsSpeaking(true);
      speak(response);
      setTimeout(() => setIsSpeaking(false), 3000);
    }

    toast.success(response);
  }, [voiceEnabled, autoConfirm, balances]);

  // 模拟语音识别
  const startListening = () => {
    setIsListening(true);
    setConfidence(0);
    
    // 模拟识别过程
    const interval = setInterval(() => {
      setConfidence(prev => Math.min(prev + 10, 100));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setConfidence(100);
      // 模拟识别结果
      const mockCommands = [
        '收款100元',
        '查询余额',
        '收款500 USDT 用加密货币',
        '生成收款码200元',
        '比特币价格是多少',
      ];
      const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setTranscript(randomCommand);
      processCommand(randomCommand);
      setIsListening(false);
    }, 2500);
  };

  const stopListening = () => {
    setIsListening(false);
    setConfidence(0);
  };

  // 模拟收款成功
  useEffect(() => {
    if (activePayment && activePayment.status === 'waiting') {
      const timer = setTimeout(() => {
        setActivePayment(prev => prev ? { ...prev, status: 'paid', paidAt: Date.now() } : null);
        const msg = `收款成功！${activePayment.amount} ${activePayment.currency} 已到账。`;
        toast.success(msg);
        if (voiceEnabled) speak(msg);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activePayment, voiceEnabled]);

  return (
    <div className="space-y-6">
      {/* 主控制面板 */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={28} weight="duotone" className="text-purple-500" />
            智能语音收款助手
          </CardTitle>
          <CardDescription>说出命令即可收款、转账、查询，解放您的双手</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 语音状态 */}
          <div className="flex items-center justify-center">
            <div className={`relative ${isListening ? 'animate-pulse' : ''}`}>
              <Button
                size="lg"
                className={`w-32 h-32 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? (
                  <MicrophoneSlash size={48} weight="bold" />
                ) : (
                  <Microphone size={48} weight="bold" />
                )}
              </Button>
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
              )}
            </div>
          </div>

          {/* 识别状态 */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Waveform size={20} className="animate-pulse text-red-500" />
                  正在聆听...
                </span>
                <span>{confidence}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          )}

          {/* 识别结果 */}
          {transcript && (
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm text-muted-foreground">识别结果</Label>
              <p className="text-lg font-medium mt-1">"{transcript}"</p>
            </div>
          )}

          {/* 快捷命令 */}
          <div className="space-y-2">
            <Label>快捷命令</Label>
            <div className="flex flex-wrap gap-2">
              {['收款100元', '收款500 USDT', '查询余额', '比特币价格', '生成收款码'].map(cmd => (
                <Button
                  key={cmd}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTranscript(cmd);
                    processCommand(cmd);
                  }}
                >
                  {cmd}
                </Button>
              ))}
            </div>
          </div>

          {/* 手动输入 */}
          <div className="flex gap-2">
            <Input
              placeholder="输入命令，如：收款200元"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processCommand(transcript)}
            />
            <Button onClick={() => processCommand(transcript)}>
              <ArrowRight size={20} />
            </Button>
          </div>

          {/* 设置 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <SpeakerHigh size={20} />
                <span className="text-sm">语音回复</span>
              </div>
              <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Lightning size={20} />
                <span className="text-sm">自动确认</span>
              </div>
              <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 活跃收款 */}
      {activePayment && (
        <Card className={activePayment.status === 'paid' ? 'border-green-500' : 'border-yellow-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activePayment.status === 'paid' ? (
                <CheckCircle size={24} weight="duotone" className="text-green-500" />
              ) : (
                <Clock size={24} weight="duotone" className="text-yellow-500 animate-pulse" />
              )}
              {activePayment.status === 'paid' ? '收款成功' : '等待付款'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">
                {activePayment.currency === 'CNY' ? '¥' : activePayment.currency === 'USD' ? '$' : ''}
                {activePayment.amount.toLocaleString()}
                <span className="text-lg ml-1">{activePayment.currency}</span>
              </div>
            </div>
            
            {activePayment.status === 'waiting' && activePayment.qrCode && (
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <img 
                    src={activePayment.qrCode} 
                    alt="收款码" 
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center gap-2">
              <Badge variant="outline">
                {activePayment.method === 'alipay' ? '支付宝' :
                 activePayment.method === 'wechat' ? '微信' :
                 activePayment.method === 'crypto' ? '加密货币' : '扫码支付'}
              </Badge>
              <Badge variant={activePayment.status === 'paid' ? 'default' : 'secondary'}>
                {activePayment.status === 'paid' ? '已完成' : '待支付'}
              </Badge>
            </div>

            {activePayment.status === 'paid' && (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setActivePayment(null)}
              >
                完成
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* 命令历史 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChatCircleDots size={24} weight="duotone" />
            命令历史
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {commands.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              暂无命令记录，说"收款100元"开始体验
            </p>
          ) : (
            commands.slice(0, 10).map(cmd => (
              <div key={cmd.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      cmd.status === 'completed' ? 'default' :
                      cmd.status === 'failed' ? 'destructive' :
                      cmd.status === 'executing' ? 'secondary' : 'outline'
                    }>
                      {cmd.status === 'completed' ? '完成' :
                       cmd.status === 'failed' ? '失败' :
                       cmd.status === 'executing' ? '执行中' : '待确认'}
                    </Badge>
                    <span className="text-sm font-medium">{cmd.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(cmd.timestamp).toLocaleTimeString('zh-CN')}
                  </span>
                </div>
                <p className="text-sm">"{cmd.command}"</p>
                {cmd.response && (
                  <p className="text-sm text-muted-foreground mt-1">→ {cmd.response}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 支持的命令 */}
      <Card>
        <CardHeader>
          <CardTitle>支持的语音命令</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CurrencyDollar size={20} />
                <span className="font-medium">收款命令</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-7">
                <li>"收款100元"</li>
                <li>"收款500 USDT"</li>
                <li>"支付宝收款200"</li>
                <li>"加密货币收款1个ETH"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <ArrowRight size={20} />
                <span className="font-medium">转账命令</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-7">
                <li>"转账100元给张三"</li>
                <li>"发送0.1 ETH给小明"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-600">
                <Wallet size={20} />
                <span className="font-medium">查询命令</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-7">
                <li>"查询余额"</li>
                <li>"还有多少钱"</li>
                <li>"交易记录"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-600">
                <QrCode size={20} />
                <span className="font-medium">其他命令</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-7">
                <li>"比特币价格"</li>
                <li>"生成收款码"</li>
                <li>"ETH汇率"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 大智能收款系统
export function SmartPaymentSystem() {
  const [mode, setMode] = useState<'voice' | 'auto' | 'batch'>('voice');
  const [autoCollectEnabled, setAutoCollectEnabled] = useState(false);
  const [batchAmount, setBatchAmount] = useState('');
  const [batchCount, setBatchCount] = useState('5');

  const recentPayments = [
    { id: 1, amount: 500, currency: 'CNY', from: '张先生', method: 'wechat', time: '2分钟前', status: 'completed' },
    { id: 2, amount: 1000, currency: 'USDT', from: '0x742d...3B8F', method: 'crypto', time: '15分钟前', status: 'completed' },
    { id: 3, amount: 2500, currency: 'CNY', from: '李女士', method: 'alipay', time: '1小时前', status: 'completed' },
    { id: 4, amount: 0.5, currency: 'ETH', from: '0x8ba1...A72c', method: 'crypto', time: '2小时前', status: 'completed' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot size={28} weight="duotone" className="text-cyan-500" />
          大智能收款系统
        </CardTitle>
        <CardDescription>全自动智能收款，支持语音、批量、定时收款</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={mode === 'voice' ? 'default' : 'outline'}
            onClick={() => setMode('voice')}
            className="gap-2"
          >
            <Microphone size={20} />
            语音收款
          </Button>
          <Button
            variant={mode === 'auto' ? 'default' : 'outline'}
            onClick={() => setMode('auto')}
            className="gap-2"
          >
            <Robot size={20} />
            自动收款
          </Button>
          <Button
            variant={mode === 'batch' ? 'default' : 'outline'}
            onClick={() => setMode('batch')}
            className="gap-2"
          >
            <CreditCard size={20} />
            批量收款
          </Button>
        </div>

        {mode === 'voice' && (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-center space-y-4">
            <div className="text-6xl">🎤</div>
            <p className="text-lg font-medium">语音收款模式</p>
            <p className="text-muted-foreground">说出 "收款100元" 即可自动生成收款码</p>
            <Button size="lg" className="gap-2">
              <Microphone size={24} />
              开始语音收款
            </Button>
          </div>
        )}

        {mode === 'auto' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">自动收款监控</div>
                <div className="text-sm text-muted-foreground">自动识别并处理收款请求</div>
              </div>
              <Switch 
                checked={autoCollectEnabled} 
                onCheckedChange={(checked) => {
                  setAutoCollectEnabled(checked);
                  toast.success(checked ? '自动收款已开启' : '自动收款已关闭');
                }}
              />
            </div>
            
            {autoCollectEnabled && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} weight="fill" />
                  <span className="font-medium">自动收款运行中</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  系统正在监控所有收款渠道，收到付款将自动确认
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">今日自动收款</div>
                <div className="text-2xl font-bold">¥12,580</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">今日收款笔数</div>
                <div className="text-2xl font-bold">28 笔</div>
              </div>
            </div>
          </div>
        )}

        {mode === 'batch' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>每笔金额</Label>
                <Input
                  type="number"
                  placeholder="输入金额"
                  value={batchAmount}
                  onChange={(e) => setBatchAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>生成数量</Label>
                <Select value={batchCount} onValueChange={setBatchCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5个</SelectItem>
                    <SelectItem value="10">10个</SelectItem>
                    <SelectItem value="20">20个</SelectItem>
                    <SelectItem value="50">50个</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              className="w-full gap-2"
              onClick={() => toast.success(`已生成${batchCount}个收款码`)}
            >
              <QrCode size={20} />
              批量生成收款码
            </Button>
          </div>
        )}

        {/* 最近收款 */}
        <div className="space-y-3">
          <Label>最近收款</Label>
          {recentPayments.map(payment => (
            <div key={payment.id} className="p-3 border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  payment.method === 'wechat' ? 'bg-green-100 text-green-600' :
                  payment.method === 'alipay' ? 'bg-blue-100 text-blue-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {payment.method === 'wechat' ? '微' :
                   payment.method === 'alipay' ? '支' : '₿'}
                </div>
                <div>
                  <div className="font-medium">{payment.from}</div>
                  <div className="text-xs text-muted-foreground">{payment.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  +{payment.amount} {payment.currency}
                </div>
                <Badge variant="outline" className="text-green-600">已到账</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
