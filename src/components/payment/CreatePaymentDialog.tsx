import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  QrCode, 
  Link as LinkIcon, 
  CheckCircle, 
  Info,
  Copy,
  CurrencyCircleDollar
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { PaymentChannel } from '@/lib/types';

// Payment link base URL - can be configured for different environments
const PAYMENT_BASE_URL = 'https://pay.omnicore.io';

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentType = 'fixed' | 'flexible' | 'subscription';

const CHANNELS: { id: PaymentChannel; name: string; icon: string; color: string }[] = [
  { id: 'crypto', name: '加密货币', icon: '₿', color: 'text-orange-500' },
  { id: 'alipay', name: '支付宝', icon: '支', color: 'text-blue-500' },
  { id: 'wechat', name: '微信支付', icon: '微', color: 'text-green-500' },
  { id: 'unionpay', name: '银联支付', icon: '银', color: 'text-red-500' },
  { id: 'stripe', name: '信用卡', icon: '💳', color: '' },
];

const CURRENCIES = [
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'EUR', name: '欧元', symbol: '€' },
  { code: 'USDT', name: 'USDT', symbol: '' },
];

export function CreatePaymentDialog({ open, onOpenChange }: CreatePaymentDialogProps) {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>('fixed');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CNY');
  const [description, setDescription] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<PaymentChannel[]>(['alipay', 'wechat']);
  const [expiryHours, setExpiryHours] = useState('24');
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const resetForm = () => {
    setStep(1);
    setPaymentType('fixed');
    setAmount('');
    setCurrency('CNY');
    setDescription('');
    setSelectedChannels(['alipay', 'wechat']);
    setExpiryHours('24');
    setCreatedLink(null);
  };

  const toggleChannel = (channelId: PaymentChannel) => {
    if (selectedChannels.includes(channelId)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== channelId));
      }
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (paymentType === 'fixed' && (!amount || parseFloat(amount) <= 0)) {
        toast.error('请输入有效的金额');
        return;
      }
      if (!description.trim()) {
        toast.error('请输入收款描述');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleCreate();
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreate = async () => {
    setIsCreating(true);

    // 模拟创建过程
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 生成模拟的收款链接
    const paymentId = `pay-${Date.now().toString(36)}`;
    const link = `${PAYMENT_BASE_URL}/${paymentId}`;
    setCreatedLink(link);
    
    toast.success('收款链接创建成功！', {
      description: '您可以复制链接或二维码发送给付款方'
    });

    setIsCreating(false);
    setStep(4);
  };

  const handleCopyLink = async () => {
    if (createdLink) {
      try {
        await navigator.clipboard.writeText(createdLink);
        toast.success('链接已复制到剪贴板');
      } catch {
        toast.error('复制失败，请手动复制链接');
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} weight="duotone" className="text-primary" />
            创建收款链接
          </DialogTitle>
          <DialogDescription>
            {step < 4 ? `步骤 ${step} / 3` : '创建完成'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: 选择收款类型 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>收款类型</Label>
                <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CurrencyCircleDollar size={20} weight="duotone" className="text-primary" />
                        <div>
                          <div className="font-medium">固定金额收款</div>
                          <div className="text-xs text-muted-foreground">
                            指定收款金额，适用于商品销售
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <LinkIcon size={20} weight="duotone" className="text-green-500" />
                        <div>
                          <div className="font-medium">自定义金额收款</div>
                          <div className="text-xs text-muted-foreground">
                            付款方可自行输入金额
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="subscription" id="subscription" />
                    <Label htmlFor="subscription" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <QrCode size={20} weight="duotone" className="text-purple-500" />
                        <div>
                          <div className="font-medium">永久收款码</div>
                          <div className="text-xs text-muted-foreground">
                            生成永久有效的收款二维码
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Alert>
                <Info size={16} weight="bold" />
                <AlertDescription className="text-xs">
                  选择适合您业务场景的收款方式。固定金额适合单次交易，永久收款码适合长期收款。
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 2: 配置收款详情 */}
          {step === 2 && (
            <div className="space-y-4">
              {paymentType === 'fixed' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">收款金额</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">货币</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">收款描述</Label>
                <Textarea
                  id="description"
                  placeholder="例如：商品购买、服务费用等"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>支付渠道</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map((channel) => (
                    <div
                      key={channel.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedChannels.includes(channel.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleChannel(channel.id)}
                    >
                      <span className={`text-lg ${channel.color}`}>{channel.icon}</span>
                      <span className="text-sm font-medium">{channel.name}</span>
                      {selectedChannels.includes(channel.id) && (
                        <CheckCircle size={16} weight="fill" className="text-primary ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {paymentType !== 'subscription' && (
                <div className="space-y-2">
                  <Label htmlFor="expiry">链接有效期</Label>
                  <Select value={expiryHours} onValueChange={setExpiryHours}>
                    <SelectTrigger id="expiry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1小时</SelectItem>
                      <SelectItem value="6">6小时</SelectItem>
                      <SelectItem value="24">24小时</SelectItem>
                      <SelectItem value="72">3天</SelectItem>
                      <SelectItem value="168">7天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: 确认信息 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">收款类型</span>
                  <span className="font-medium">
                    {paymentType === 'fixed' ? '固定金额' : 
                     paymentType === 'flexible' ? '自定义金额' : '永久收款码'}
                  </span>
                </div>
                <Separator />
                {paymentType === 'fixed' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">收款金额</span>
                      <span className="font-bold text-lg">
                        {CURRENCIES.find(c => c.code === currency)?.symbol}{amount} {currency}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">描述</span>
                  <span className="font-medium">{description}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">支付渠道</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {selectedChannels.map(channelId => {
                      const channel = CHANNELS.find(c => c.id === channelId);
                      return channel ? (
                        <Badge key={channelId} variant="outline" className="gap-1">
                          <span className={channel.color}>{channel.icon}</span>
                          {channel.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
                {paymentType !== 'subscription' && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">有效期</span>
                      <span className="font-medium">
                        {expiryHours === '1' ? '1小时' :
                         expiryHours === '6' ? '6小时' :
                         expiryHours === '24' ? '24小时' :
                         expiryHours === '72' ? '3天' : '7天'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Alert>
                <CheckCircle size={16} weight="bold" />
                <AlertDescription className="text-xs">
                  确认信息无误后，点击创建即可生成收款链接和二维码。
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 4: 创建成功 */}
          {step === 4 && createdLink && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} weight="fill" className="text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">收款链接创建成功！</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  您可以复制链接或下载二维码发送给付款方
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <Label>收款链接</Label>
                <div className="flex gap-2">
                  <Input 
                    value={createdLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    <Copy size={16} />
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <div className="w-40 h-40 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                  <QrCode size={100} weight="duotone" className="text-primary/50" />
                </div>
                <p className="text-sm text-muted-foreground">扫描二维码支付</p>
                <Button variant="outline" size="sm" className="mt-2">
                  下载二维码
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {step > 1 && step < 4 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isCreating}
              >
                返回
              </Button>
            )}
            {step < 4 ? (
              <Button
                className="flex-1 gap-2"
                onClick={handleNext}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>创建中...</>
                ) : step === 3 ? (
                  <>
                    <CheckCircle size={16} weight="bold" />
                    创建收款链接
                  </>
                ) : (
                  '下一步'
                )}
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={handleClose}
              >
                完成
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
