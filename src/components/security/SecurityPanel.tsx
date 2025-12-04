import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  ShieldCheck,
  ShieldWarning,
  Lock,
  Key,
  Fingerprint,
  Warning,
  CheckCircle,
  Clock,
  Eye,
  EyeSlash,
  Snowflake,
  Fire,
  UserCircle,
  Gear,
  Bell,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatTimeAgo } from '@/lib/mock-data';

interface SecurityEvent {
  id: string;
  type: 'login' | 'transaction' | 'settings_change' | 'suspicious';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  resolved: boolean;
}

const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-1',
    type: 'login',
    description: '新设备登录 - Windows 11, Chrome 120',
    severity: 'low',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    resolved: true,
  },
  {
    id: 'sec-2',
    type: 'transaction',
    description: '大额交易需要审批 - 25,000 USDT',
    severity: 'high',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    resolved: false,
  },
  {
    id: 'sec-3',
    type: 'suspicious',
    description: '检测到可疑 IP 地址访问尝试',
    severity: 'critical',
    timestamp: Date.now() - 30 * 60 * 1000,
    resolved: false,
  },
  {
    id: 'sec-4',
    type: 'settings_change',
    description: '多签钱包签名者更新',
    severity: 'medium',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    resolved: true,
  },
];

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getEventIcon(type: string) {
  switch (type) {
    case 'login':
      return <UserCircle size={18} weight="duotone" className="text-blue-500" />;
    case 'transaction':
      return <Lock size={18} weight="duotone" className="text-purple-500" />;
    case 'settings_change':
      return <Gear size={18} weight="duotone" className="text-gray-500" />;
    case 'suspicious':
      return <ShieldWarning size={18} weight="duotone" className="text-red-500" />;
    default:
      return <Bell size={18} weight="duotone" />;
  }
}

export function SecurityPanel() {
  const [events] = useState<SecurityEvent[]>(MOCK_SECURITY_EVENTS);
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const securityScore = 85;
  const unresolvedEvents = events.filter(e => !e.resolved);

  const handleFreeze = () => {
    if (confirmText.toLowerCase() !== 'freeze') {
      toast.error('请输入 "FREEZE" 确认操作');
      return;
    }
    
    setIsFrozen(true);
    setFreezeDialogOpen(false);
    setConfirmText('');
    toast.success('紧急冻结已激活', {
      description: '所有钱包操作已暂停，联系管理员解除冻结'
    });
  };

  const handleUnfreeze = () => {
    setIsFrozen(false);
    toast.success('冻结已解除', {
      description: '所有钱包操作已恢复正常'
    });
  };

  return (
    <div className="space-y-6">
      {/* Emergency Freeze Alert */}
      {isFrozen && (
        <Alert variant="destructive" className="border-2 animate-pulse">
          <Snowflake size={20} weight="bold" className="animate-spin" />
          <AlertTitle className="text-lg">紧急冻结已激活</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>所有钱包操作已暂停。联系管理员解除冻结。</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUnfreeze}
              className="ml-4 bg-white hover:bg-gray-100"
            >
              <Fire size={16} className="mr-1" />
              解除冻结
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Security Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={24} weight="duotone" className="text-green-500" />
                安全概览
              </CardTitle>
              <CardDescription>您的账户安全状态</CardDescription>
            </div>
            <Button 
              variant={isFrozen ? "secondary" : "destructive"}
              className="gap-2"
              onClick={() => isFrozen ? handleUnfreeze() : setFreezeDialogOpen(true)}
            >
              {isFrozen ? (
                <>
                  <Fire size={18} />
                  解除冻结
                </>
              ) : (
                <>
                  <Snowflake size={18} />
                  紧急冻结
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">安全评分</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-green-600">{securityScore}</div>
                <div className="flex-1">
                  <Progress value={securityScore} className="h-3" />
                  <div className="text-xs text-muted-foreground mt-1">优秀</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">待处理事件</div>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${unresolvedEvents.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {unresolvedEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {unresolvedEvents.length > 0 ? '需要您的关注' : '一切正常'}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">账户状态</div>
              <div className="flex items-center gap-2">
                {isFrozen ? (
                  <Badge variant="destructive" className="text-lg py-1 px-3 gap-1">
                    <Snowflake size={16} />
                    已冻结
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-lg py-1 px-3 bg-green-600 gap-1">
                    <CheckCircle size={16} weight="fill" />
                    正常运行
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} weight="duotone" />
              认证设置
            </CardTitle>
            <CardDescription>配置您的账户认证方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Key size={20} weight="duotone" className="text-blue-500" />
                <div>
                  <div className="font-medium">双因素认证 (2FA)</div>
                  <div className="text-sm text-muted-foreground">使用验证器应用增强安全性</div>
                </div>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Fingerprint size={20} weight="duotone" className="text-purple-500" />
                <div>
                  <div className="font-medium">生物识别认证</div>
                  <div className="text-sm text-muted-foreground">使用指纹或面部识别登录</div>
                </div>
              </div>
              <Switch 
                checked={biometricEnabled} 
                onCheckedChange={setBiometricEnabled} 
              />
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <Key size={20} weight="duotone" className="text-amber-500" />
                <div>
                  <div className="font-medium">API 密钥</div>
                  <div className="text-sm text-muted-foreground">用于程序化访问</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type={apiKeyVisible ? 'text' : 'password'}
                  value="sk-omni-xxxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                >
                  {apiKeyVisible ? <EyeSlash size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} weight="duotone" />
              安全通知
            </CardTitle>
            <CardDescription>配置安全事件提醒</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Lock size={20} weight="duotone" className="text-green-500" />
                <div>
                  <div className="font-medium">交易提醒</div>
                  <div className="text-sm text-muted-foreground">大额交易或可疑活动通知</div>
                </div>
              </div>
              <Switch 
                checked={transactionAlerts} 
                onCheckedChange={setTransactionAlerts} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <UserCircle size={20} weight="duotone" className="text-blue-500" />
                <div>
                  <div className="font-medium">登录提醒</div>
                  <div className="text-sm text-muted-foreground">新设备或新位置登录通知</div>
                </div>
              </div>
              <Switch 
                checked={loginAlerts} 
                onCheckedChange={setLoginAlerts} 
              />
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm font-medium mb-2">通知渠道</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">邮件</Badge>
                <Badge variant="secondary">短信</Badge>
                <Badge variant="outline">应用推送</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warning size={20} weight="duotone" className="text-orange-500" />
            安全事件日志
          </CardTitle>
          <CardDescription>最近的安全相关活动</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  !event.resolved ? 'bg-orange-50 border-orange-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <div className="font-medium text-sm">{event.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(event.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(event.severity)}>
                    {event.severity === 'critical' ? '严重' : 
                     event.severity === 'high' ? '高' :
                     event.severity === 'medium' ? '中' : '低'}
                  </Badge>
                  {event.resolved ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle size={12} className="mr-1" />
                      已处理
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      <Clock size={12} className="mr-1" />
                      待处理
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Freeze Confirmation Dialog */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Snowflake size={24} />
              紧急冻结确认
            </DialogTitle>
            <DialogDescription>
              此操作将立即暂停所有钱包操作，包括转账、签名和 DeFi 交互。
              只有管理员才能解除冻结。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <Warning size={16} />
              <AlertTitle>警告</AlertTitle>
              <AlertDescription>
                冻结后，所有待处理的交易将被取消，智能合约交互将被阻止。
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="confirm">请输入 "FREEZE" 确认操作</Label>
              <Input
                id="confirm"
                placeholder="FREEZE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeDialogOpen(false)}>
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleFreeze}
              disabled={confirmText.toLowerCase() !== 'freeze'}
              className="gap-2"
            >
              <Snowflake size={16} />
              确认冻结
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
