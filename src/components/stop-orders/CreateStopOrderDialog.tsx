import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { TrendDown, TrendUp, ArrowsClockwise, Plus, Info } from '@phosphor-icons/react';
import type { StopOrderType, BlockchainNetwork } from '@/lib/types';
import { NETWORKS } from '@/lib/mock-data';

interface CreateStopOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStopOrderDialog({ open, onOpenChange }: CreateStopOrderDialogProps) {
  const [orderType, setOrderType] = useState<StopOrderType>('stop-loss');
  const [token, setToken] = useState('ETH');
  const [network, setNetwork] = useState<BlockchainNetwork>('ethereum');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [percentage, setPercentage] = useState([25]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!triggerPrice) {
      toast.error('请输入触发价格');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('止损单创建成功', {
      description: `${getTypeLabel(orderType)}: ${token} @ $${triggerPrice} (${percentage[0]}%)`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setTriggerPrice('');
    setPercentage([25]);
  };

  const getTypeLabel = (type: StopOrderType) => {
    switch (type) {
      case 'stop-loss': return '止损单';
      case 'take-profit': return '止盈单';
      case 'trailing-stop': return '追踪止损';
    }
  };

  const getTypeDescription = (type: StopOrderType) => {
    switch (type) {
      case 'stop-loss': return '当价格跌至设定价格时自动卖出，防止更大损失';
      case 'take-profit': return '当价格涨至设定价格时自动卖出，锁定利润';
      case 'trailing-stop': return '追踪价格上涨，当回撤达到设定百分比时卖出';
    }
  };

  const getTypeIcon = (type: StopOrderType) => {
    switch (type) {
      case 'stop-loss':
        return <TrendDown size={24} weight="duotone" className="text-red-500" />;
      case 'take-profit':
        return <TrendUp size={24} weight="duotone" className="text-green-500" />;
      case 'trailing-stop':
        return <ArrowsClockwise size={24} weight="duotone" className="text-blue-500" />;
    }
  };

  const tokens = ['ETH', 'BTC', 'USDC', 'USDT', 'MATIC', 'ARB', 'OP', 'AVAX'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={24} weight="bold" />
            创建止损/止盈单
          </DialogTitle>
          <DialogDescription>
            设置多停策略来自动管理您的仓位风险
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Type Selection */}
          <div className="space-y-3">
            <Label>订单类型</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['stop-loss', 'take-profit', 'trailing-stop'] as StopOrderType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`p-3 rounded-lg border text-center transition-all ${
                    orderType === type 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setOrderType(type)}
                >
                  <div className="flex flex-col items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="text-sm font-medium">{getTypeLabel(type)}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <span>{getTypeDescription(orderType)}</span>
            </div>
          </div>

          {/* Token Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token">代币</Label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger>
                  <SelectValue placeholder="选择代币" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">网络</Label>
              <Select value={network} onValueChange={(v) => setNetwork(v as BlockchainNetwork)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择网络" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NETWORKS).map(([key, net]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span style={{ color: net.color }}>{net.icon}</span>
                        {net.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trigger Price */}
          <div className="space-y-2">
            <Label htmlFor="triggerPrice">
              {orderType === 'trailing-stop' ? '回撤百分比 (%)' : '触发价格 (USD)'}
            </Label>
            <Input
              id="triggerPrice"
              type="number"
              step={orderType === 'trailing-stop' ? '1' : '0.01'}
              placeholder={orderType === 'trailing-stop' ? '10' : '2500.00'}
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
            />
            {orderType !== 'trailing-stop' && (
              <p className="text-xs text-muted-foreground">
                当 {token} 价格{orderType === 'stop-loss' ? '跌至' : '涨至'} ${triggerPrice || '---'} 时触发
              </p>
            )}
          </div>

          {/* Percentage Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>卖出比例</Label>
              <span className="text-sm font-medium">{percentage[0]}%</span>
            </div>
            <Slider
              value={percentage}
              onValueChange={setPercentage}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="font-medium">订单摘要</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>类型</span>
                <span className="font-medium text-foreground">{getTypeLabel(orderType)}</span>
              </div>
              <div className="flex justify-between">
                <span>代币</span>
                <span className="font-medium text-foreground">{token} ({NETWORKS[network]?.name})</span>
              </div>
              <div className="flex justify-between">
                <span>{orderType === 'trailing-stop' ? '回撤' : '触发价'}</span>
                <span className="font-medium text-foreground">
                  {triggerPrice ? (orderType === 'trailing-stop' ? `${triggerPrice}%` : `$${triggerPrice}`) : '---'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>卖出比例</span>
                <span className="font-medium text-foreground">{percentage[0]}%</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '创建中...' : '创建订单'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
