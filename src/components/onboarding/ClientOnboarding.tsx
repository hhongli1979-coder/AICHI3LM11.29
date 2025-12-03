import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  Code, 
  Link, 
  Copy, 
  CheckCircle, 
  Clock, 
  Warning,
  MapPin,
  IdentificationCard,
  UserCircle,
  Wallet,
  Info,
  ArrowRight,
  Eye,
  QrCode,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { 
  generateMockOnboardingSteps, 
  generateMockOnboardingRequests, 
  generateMockNoCodeConfig,
  getOnboardingStatusBadge,
  formatTimeAgo,
} from '@/lib/mock-data';

/**
 * ClientOnboarding - Fiat24 客户入职模块
 * 
 * 提供两种集成方式：
 * 1. 无代码集成 - 适用于 4 位数和 3 位数开发者 NFT 项目
 * 2. 基于代码的集成 - 适用于 2 位数和 1 位数开发者 NFT 项目
 */
export function ClientOnboarding() {
  const [activeTab, setActiveTab] = useState('overview');
  const [walletTokenId, setWalletTokenId] = useState('');
  const steps = generateMockOnboardingSteps();
  const requests = generateMockOnboardingRequests();
  const noCodeConfig = generateMockNoCodeConfig();

  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wallet': return <Wallet size={20} weight="duotone" />;
      case 'UserCircle': return <UserCircle size={20} weight="duotone" />;
      case 'MapPin': return <MapPin size={20} weight="duotone" />;
      case 'IdentificationCard': return <IdentificationCard size={20} weight="duotone" />;
      case 'CheckCircle': return <CheckCircle size={20} weight="duotone" />;
      default: return <Info size={20} weight="duotone" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} weight="fill" className="text-green-600" />;
      case 'in_review': return <Clock size={16} weight="fill" className="text-yellow-600" />;
      case 'pending': return <Clock size={16} weight="fill" className="text-blue-600" />;
      case 'manual_review': return <Warning size={16} weight="fill" className="text-orange-600" />;
      case 'rejected': return <Warning size={16} weight="fill" className="text-red-600" />;
      default: return <Clock size={16} weight="fill" className="text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'in_review': return '审核中';
      case 'pending': return '待处理';
      case 'manual_review': return '人工审核';
      case 'rejected': return '已拒绝';
      default: return status;
    }
  };

  const handleCopyUrl = () => {
    const url = `${noCodeConfig.baseUrl}?wallet=${walletTokenId || noCodeConfig.walletTokenId}`;
    navigator.clipboard.writeText(url);
    toast.success('链接已复制', {
      description: '入职链接已复制到剪贴板',
    });
  };

  const handleCopyApiCode = () => {
    const code = `POST https://api.fiat24.com/register
{
  "chainId": 42161,
  "nftId": ${walletTokenId || '10365'},
  "email": "client@example.com",
  "profile": { ... },
  "address": { ... },
  "id": { ... },
  "files": { ... }
}`;
    navigator.clipboard.writeText(code);
    toast.success('API 代码已复制', {
      description: 'API 请求示例已复制到剪贴板',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">客户入职</h2>
          <p className="text-muted-foreground mt-1">
            Fiat24 KYC/AML 集成 - 仅限个人客户
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          瑞士合规
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Info size={16} weight="duotone" />
            <span className="hidden sm:inline">概述</span>
          </TabsTrigger>
          <TabsTrigger value="no-code" className="gap-2">
            <Link size={16} weight="duotone" />
            <span className="hidden sm:inline">无代码集成</span>
          </TabsTrigger>
          <TabsTrigger value="code-based" className="gap-2">
            <Code size={16} weight="duotone" />
            <span className="hidden sm:inline">代码集成</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <UserPlus size={16} weight="duotone" />
            <span className="hidden sm:inline">入职请求</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Onboarding Flow */}
            <Card>
              <CardHeader>
                <CardTitle>入职流程</CardTitle>
                <CardDescription>
                  客户注册流程概述 - 符合瑞士 KYC/AML 要求
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Progress value={progressPercent} className="flex-1" />
                  <span className="text-sm text-muted-foreground">
                    {completedSteps}/{steps.length} 步骤
                  </span>
                </div>

                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        step.active 
                          ? 'bg-primary/5 border-primary' 
                          : step.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-muted/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-600 text-white' 
                          : step.active 
                            ? 'bg-primary text-white' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle size={16} weight="bold" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStepIcon(step.icon)}
                          <span className="font-medium">{step.title}</span>
                          {step.active && (
                            <Badge variant="secondary" className="text-xs">当前</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Options */}
            <Card>
              <CardHeader>
                <CardTitle>集成选项</CardTitle>
                <CardDescription>
                  选择适合您项目的集成方式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setActiveTab('no-code')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Link size={24} weight="duotone" className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">无代码集成</h4>
                      <p className="text-sm text-muted-foreground">
                        适用于 4 位数和 3 位数开发者 NFT 项目
                      </p>
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline">快速设置</Badge>
                    <Badge variant="outline">无需编码</Badge>
                    <Badge variant="outline">id.fiat24.com</Badge>
                  </div>
                </div>

                <div 
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setActiveTab('code-based')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Code size={24} weight="duotone" className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">基于代码的集成</h4>
                      <p className="text-sm text-muted-foreground">
                        适用于 2 位数和 1 位数开发者 NFT 项目
                      </p>
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline">API 集成</Badge>
                    <Badge variant="outline">完全控制</Badge>
                    <Badge variant="outline">自定义嵌入</Badge>
                  </div>
                </div>

                <Alert>
                  <Info size={16} weight="bold" />
                  <AlertDescription className="text-sm">
                    开发者 NFT 位数决定可用的集成选项。数字越少，权限越高。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Card */}
          <Card>
            <CardHeader>
              <CardTitle>入职要求</CardTitle>
              <CardDescription>
                客户必须满足以下条件才能开户
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={20} weight="duotone" className="text-primary" />
                    <h4 className="font-medium">Fiat24 NFT</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    需要从 www.fiat24.com 或 OpenSea 获取未验证的 Fiat24 NFT (NFT.status = 2)
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} weight="duotone" className="text-primary" />
                    <h4 className="font-medium">GPS 验证</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    用户必须位于指定地址 2 公里范围内。建议使用 Chrome 或 Safari 浏览器。
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <IdentificationCard size={20} weight="duotone" className="text-primary" />
                    <h4 className="font-medium">NFC 扫描</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    使用 ePassport 应用 ReadID Ready 扫描带有 NFC 芯片的护照/身份证
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* No-Code Integration Tab */}
        <TabsContent value="no-code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link size={24} weight="duotone" />
                无代码集成
              </CardTitle>
              <CardDescription>
                仅适用于 4 位数和 3 位数开发者 NFT 项目。通过专用站点 id.fiat24.com 管理客户信息。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info size={16} weight="bold" />
                <AlertDescription>
                  此集成方式非常适合希望快速、实用地进行设置而无需编写代码的 Web3 dApp 开发人员。
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="walletTokenId">钱包令牌 ID (Wallet Token ID)</Label>
                  <Input
                    id="walletTokenId"
                    placeholder="输入您的钱包令牌 ID"
                    value={walletTokenId}
                    onChange={(e) => setWalletTokenId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    如果您想使用自己的颜色和名称自定义登录页面，需要添加此参数
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>生成的入职链接</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${noCodeConfig.baseUrl}?wallet=${walletTokenId || noCodeConfig.walletTokenId}`}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-3">
                      <QrCode size={20} weight="duotone" />
                      <h4 className="font-medium">二维码集成</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      您可以生成二维码供用户扫描，直接进入入职流程
                    </p>
                    <Button variant="outline" className="w-full gap-2">
                      <QrCode size={16} />
                      生成二维码
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={20} weight="duotone" />
                      <h4 className="font-medium">预览</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      在新窗口中预览入职页面
                    </p>
                    <Button variant="outline" className="w-full gap-2">
                      <Eye size={16} />
                      预览页面
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>自定义选项</CardTitle>
              <CardDescription>
                自定义您的入职页面外观
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customName">自定义名称</Label>
                  <Input
                    id="customName"
                    placeholder="您的品牌名称"
                    defaultValue={noCodeConfig.customName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customColor">品牌颜色</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customColor"
                      placeholder="#627EEA"
                      defaultValue={noCodeConfig.customColor}
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: noCodeConfig.customColor }}
                    />
                  </div>
                </div>
              </div>
              <Button className="gap-2">
                <CheckCircle size={16} weight="bold" />
                保存自定义设置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code-Based Integration Tab */}
        <TabsContent value="code-based" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code size={24} weight="duotone" />
                基于代码的集成
              </CardTitle>
              <CardDescription>
                仅适用于 2 位数和 1 位数开发者 NFT 项目。使用 API 提供客户入职数据。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Warning size={16} weight="bold" />
                <AlertDescription>
                  这是仅限内部受信任系统使用的受限功能，确保只有授权的应用程序和用户才能访问敏感操作或数据。
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">API 端点</Label>
                  <div className="flex items-center gap-2 mt-2 p-3 bg-muted rounded-lg font-mono text-sm">
                    <Badge variant="default">POST</Badge>
                    <span>https://api.fiat24.com/register</span>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={handleCopyApiCode}>
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold mb-3 block">请求体结构</Label>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm font-mono whitespace-pre text-muted-foreground">
{`{
  "chainId"     : 42161,
  "nftId"       : 10365,
  "email"       : "your@mail.com",
  
  "profile"  : {
    "annualSalary"    : "B2",            // 年薪范围
    "totalAssets"     : "B1",            // 总资产范围
    "mainOccupation"  : "EMP",           // 职业类型
    "jobCategory"     : "EEE",           // 工作类别
    "sector"          : "ACC",           // 行业
    "sourceOfFunds"   : "SAV",           // 资金来源
    "purposes"        : "SLR,PNS,IVT",   // 账户用途（多选）
    "signature"       : "0x.........",   // TAN 签名
    "tanMessage"      : "Zürich, 13.06.2025 I confirm...",
    "tanAddress"      : "0x....",        // 签名地址
    "tanDateMs"       : 1763127436       // 签名时间戳
  },
  
  "address"  : {
    "countryISO3"     : "GBR",
    "street"          : "New Bond Street",
    "streetNumber"    : "52",
    "postalCode"      : "W1S",
    "city"            : "London",
    "gps"             : { "lat": 47.35, "lng": 8.56 },
    "addressProof"    : { "lat": 47.35, "lng": 8.56 },
    "reverseAddressProof" : "Bellerivestrasse 245, Zurich",
    "distance"        : 0.1        // GPS 距离（公里）
  },
  
  "id" : {
    "gender"          : "M",       // "M" 或 "F"
    "firstName"       : "James",   // 拉丁字符
    "lastName"        : "Bond",    // 拉丁字符
    "nameOfHolder"    : "詹姆斯·邦德",  // 原始语言
    "birthday"        : "27.06.1991",
    "documentNumber"  : "ABCDE1234",
    "documentType"    : "P",       // "P"（护照）或 "I"（身份证）
    "documentValidUntil": "27.06.2099",
    "issuerCountry"   : "GBR",
    "nationality"     : "GBR"
  },
  
  "files" : {
    "clientProfilePdfUrl": "<url_to_pdf>",
    "idVerificationPdfUrl": "<url_to_pdf>"
  }
}`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold mb-3 block">响应示例</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Badge variant="default" className="bg-green-600">成功响应 (OK)</Badge>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <pre className="text-sm font-mono text-green-800">
{`{
  "status": 200,
  "data": {
    "status": "OK"
  }
}`}
                        </pre>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="destructive">错误响应</Badge>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <pre className="text-sm font-mono text-red-800">
{`{
  "status": 400,
  "data": {
    "status": "NOT_ELIGIBLE",
    "message": "Customer does not meet requirements"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Status Types */}
          <Card>
            <CardHeader>
              <CardTitle>响应状态类型</CardTitle>
              <CardDescription>
                API 可能返回的不同状态
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={20} weight="fill" className="text-green-600" />
                    <h4 className="font-medium text-green-800">OK</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    注册成功，客户申请已通过
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Warning size={20} weight="fill" className="text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">NOT_ELIGIBLE</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    客户不符合开户条件
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} weight="fill" className="text-orange-600" />
                    <h4 className="font-medium text-orange-800">MANUAL_REVIEW</h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    需要人工审核
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Warning size={20} weight="fill" className="text-red-600" />
                    <h4 className="font-medium text-red-800">ERROR</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    请求出错，请检查参数
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>入职请求</CardTitle>
                  <CardDescription>
                    查看和管理客户入职申请
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-base">
                  {requests.length} 个请求
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>客户</TableHead>
                      <TableHead>NFT ID</TableHead>
                      <TableHead>国家</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                              {request.id_document.firstName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {request.id_document.firstName} {request.id_document.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">{request.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">#{request.nftId}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{request.id_document.nationality}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getOnboardingStatusBadge(request.status)}
                            className="gap-1"
                          >
                            {getStatusIcon(request.status)}
                            {getStatusLabel(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimeAgo(request.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye size={14} />
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {requests.filter(r => r.status === 'approved').length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">已通过</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {requests.filter(r => r.status === 'in_review').length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">审核中</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {requests.filter(r => r.status === 'pending').length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">待处理</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {requests.filter(r => r.status === 'rejected').length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">已拒绝</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
