import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  SmileyWink,
  Camera,
  CheckCircle,
  XCircle,
  Warning,
  ShieldCheck,
  Lightning,
  Scan,
  User,
  Eye,
  Fingerprint,
  CreditCard,
  Clock,
  Sparkle,
  ArrowRight,
  QrCode
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================
// 刷脸支付系统 - 支付宝/微信 Face Payment
// ============================================

interface FacePaymentState {
  status: 'idle' | 'scanning' | 'verifying' | 'success' | 'failed';
  confidence: number;
  faceDetected: boolean;
  livenessCheck: boolean;
  identityVerified: boolean;
  amount: number;
  method: 'alipay' | 'wechat';
}

export function FacePayment() {
  const [state, setState] = useState<FacePaymentState>({
    status: 'idle',
    confidence: 0,
    faceDetected: false,
    livenessCheck: false,
    identityVerified: false,
    amount: 88.88,
    method: 'alipay',
  });
  
  const [cameraActive, setCameraActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 模拟摄像头启动
  const startCamera = async () => {
    setCameraActive(true);
    setState(prev => ({ ...prev, status: 'scanning' }));
    
    // 模拟人脸检测过程
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      
      if (progress >= 30) {
        setState(prev => ({ ...prev, faceDetected: true }));
      }
      if (progress >= 60) {
        setState(prev => ({ ...prev, livenessCheck: true, status: 'verifying' }));
      }
      if (progress >= 90) {
        setState(prev => ({ ...prev, identityVerified: true, confidence: 98.5 }));
      }
      if (progress >= 100) {
        clearInterval(interval);
        setState(prev => ({ ...prev, status: 'success' }));
        toast.success(`🎉 刷脸支付成功！已支付 ¥${state.amount}`);
      }
    }, 100);

    return () => clearInterval(interval);
  };

  const stopCamera = () => {
    setCameraActive(false);
    setState(prev => ({ ...prev, status: 'idle' }));
    setScanProgress(0);
  };

  const resetPayment = () => {
    setState({
      status: 'idle',
      confidence: 0,
      faceDetected: false,
      livenessCheck: false,
      identityVerified: false,
      amount: state.amount,
      method: state.method,
    });
    setScanProgress(0);
    setCameraActive(false);
  };

  return (
    <div className="space-y-6">
      {/* 主卡片 */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SmileyWink size={28} weight="duotone" className="text-blue-500" />
            刷脸支付 Face Pay
          </CardTitle>
          <CardDescription>
            支持支付宝/微信人脸识别支付 • 3D活体检测 • 毫秒级验证
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 支付方式选择 */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={state.method === 'alipay' ? 'default' : 'outline'}
              className={`h-16 gap-3 ${state.method === 'alipay' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
              onClick={() => setState(prev => ({ ...prev, method: 'alipay' }))}
            >
              <span className="text-2xl">💙</span>
              <div className="text-left">
                <div className="font-bold">支付宝</div>
                <div className="text-xs opacity-80">Alipay Face</div>
              </div>
            </Button>
            <Button
              variant={state.method === 'wechat' ? 'default' : 'outline'}
              className={`h-16 gap-3 ${state.method === 'wechat' ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={() => setState(prev => ({ ...prev, method: 'wechat' }))}
            >
              <span className="text-2xl">💚</span>
              <div className="text-left">
                <div className="font-bold">微信支付</div>
                <div className="text-xs opacity-80">WeChat Face</div>
              </div>
            </Button>
          </div>

          {/* 金额设置 */}
          <div className="space-y-2">
            <Label>支付金额</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={state.amount}
                onChange={(e) => setState(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="text-2xl font-bold text-center"
              />
              <span className="flex items-center text-2xl font-bold text-muted-foreground">CNY</span>
            </div>
          </div>

          {/* 摄像头区域 */}
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            {cameraActive ? (
              <>
                {/* 模拟摄像头画面 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* 人脸框 */}
                    <div className={`w-48 h-64 border-4 rounded-3xl transition-colors duration-300 ${
                      state.faceDetected ? 'border-green-400' : 'border-white/50'
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User size={80} className="text-white/30" />
                      </div>
                    </div>
                    
                    {/* 扫描线 */}
                    {state.status === 'scanning' && (
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
                        style={{ top: `${scanProgress}%` }}
                      />
                    )}
                    
                    {/* 角标 */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />
                  </div>
                </div>

                {/* 状态提示 */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full text-white">
                    {state.status === 'scanning' && <><Scan size={20} className="animate-pulse" /> 正在识别人脸...</>}
                    {state.status === 'verifying' && <><Eye size={20} className="animate-pulse" /> 活体检测中...</>}
                    {state.status === 'success' && <><CheckCircle size={20} className="text-green-400" /> 验证成功！</>}
                  </div>
                </div>

                {/* 进度条 */}
                <div className="absolute top-4 left-4 right-4">
                  <Progress value={scanProgress} className="h-2" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                <Camera size={64} weight="duotone" />
                <p className="mt-4">点击开始刷脸支付</p>
              </div>
            )}
          </div>

          {/* 验证状态 */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg text-center transition-colors ${
              state.faceDetected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <User size={24} className="mx-auto" />
              <div className="text-xs mt-1">人脸检测</div>
              {state.faceDetected && <CheckCircle size={16} className="mx-auto mt-1" />}
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors ${
              state.livenessCheck ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <Eye size={24} className="mx-auto" />
              <div className="text-xs mt-1">活体检测</div>
              {state.livenessCheck && <CheckCircle size={16} className="mx-auto mt-1" />}
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors ${
              state.identityVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <ShieldCheck size={24} className="mx-auto" />
              <div className="text-xs mt-1">身份核验</div>
              {state.identityVerified && <CheckCircle size={16} className="mx-auto mt-1" />}
            </div>
          </div>

          {/* 置信度 */}
          {state.confidence > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-700">人脸匹配置信度</span>
                <span className="text-2xl font-bold text-green-800">{state.confidence}%</span>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          {state.status === 'idle' ? (
            <Button
              className={`w-full h-14 text-lg gap-2 ${
                state.method === 'alipay' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={startCamera}
            >
              <Camera size={24} />
              开始刷脸支付 ¥{state.amount}
            </Button>
          ) : state.status === 'success' ? (
            <Button
              className="w-full h-14 text-lg gap-2 bg-green-500"
              onClick={resetPayment}
            >
              <CheckCircle size={24} />
              支付成功 - 完成
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full h-14 text-lg gap-2"
              onClick={stopCamera}
            >
              <XCircle size={24} />
              取消支付
            </Button>
          )}

          {/* 安全提示 */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck size={14} /> 3D活体检测</span>
            <span className="flex items-center gap-1"><Fingerprint size={14} /> 金融级加密</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 毫秒级响应</span>
          </div>
        </CardContent>
      </Card>

      {/* 设备配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">刷脸设备配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>设备类型</Label>
              <Select defaultValue="3d">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3d">3D结构光摄像头</SelectItem>
                  <SelectItem value="ir">红外双目摄像头</SelectItem>
                  <SelectItem value="tof">ToF深度摄像头</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>活体检测等级</Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">基础 (静默活体)</SelectItem>
                  <SelectItem value="medium">标准 (动作活体)</SelectItem>
                  <SelectItem value="high">高级 (3D活体)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">自动确认支付</div>
              <div className="text-sm text-muted-foreground">验证通过后自动完成支付</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">语音播报</div>
              <div className="text-sm text-muted-foreground">支付结果语音提示</div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* 支付记录 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">刷脸支付记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { amount: 128.00, method: 'alipay', time: '2分钟前', status: 'success' },
              { amount: 56.50, method: 'wechat', time: '15分钟前', status: 'success' },
              { amount: 299.00, method: 'alipay', time: '1小时前', status: 'success' },
            ].map((record, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.method === 'alipay' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <SmileyWink size={24} />
                  </div>
                  <div>
                    <div className="font-medium">¥{record.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{record.time}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">成功</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 多模态支付入口
export function MultiModalPayment() {
  const [selectedMode, setSelectedMode] = useState<'face' | 'qr' | 'nfc' | 'voice'>('face');

  const modes = [
    { id: 'face', name: '刷脸支付', icon: <SmileyWink size={32} />, desc: '人脸识别' },
    { id: 'qr', name: '扫码支付', icon: <QrCode size={32} />, desc: '二维码' },
    { id: 'nfc', name: 'NFC支付', icon: <CreditCard size={32} />, desc: '近场通信' },
    { id: 'voice', name: '语音支付', icon: <Sparkle size={32} />, desc: '语音命令' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightning size={24} weight="duotone" className="text-yellow-500" />
          多模态支付
        </CardTitle>
        <CardDescription>选择您喜欢的支付方式</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modes.map(mode => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? 'default' : 'outline'}
              className={`h-24 flex-col gap-2 ${
                selectedMode === mode.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMode(mode.id as typeof selectedMode)}
            >
              {mode.icon}
              <div className="text-sm font-medium">{mode.name}</div>
              <div className="text-xs opacity-70">{mode.desc}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
