# OmniCore Wallet 部署指南

## 📦 项目概述

OmniCore Wallet 是一个企业级智能钱包平台，具备以下功能：

- 🧠 **超级智能体系统** - 多智能体协同、动态调度、自主进化
- 💰 **多签钱包管理** - 企业级安全控制
- 📊 **DeFi 策略管理** - 收益优化和风险分析
- 🔐 **AI 风险分析** - 实时交易风险评估
- 💳 **全球支付集成** - 多渠道支付支持

---

## 🚀 快速部署

### 方式一：一键部署脚本

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 方式二：手动部署

```bash
# 1. 使用生产配置
cp package.frontend.json package.json
cp vite.config.prod.ts vite.config.ts
cp index.prod.html index.html
cp src/main.prod.tsx src/main.tsx

# 2. 安装依赖
npm install

# 3. 构建
npm run build

# 4. 预览
npm run preview
```

---

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -f Dockerfile.prod -t omnicore-wallet:latest .
```

### 运行容器

```bash
docker run -d \
  --name omnicore-wallet \
  -p 80:80 \
  --restart unless-stopped \
  omnicore-wallet:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  omnicore-wallet:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    restart: unless-stopped
```

---

## ☁️ 云平台部署

### Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 构建命令设置为：
   ```
   cp package.frontend.json package.json && cp vite.config.prod.ts vite.config.ts && cp index.prod.html index.html && cp src/main.prod.tsx src/main.tsx && npm install && npm run build
   ```
4. 输出目录设置为：`dist`

### Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 导入项目
3. 构建命令：`./deploy.sh`
4. 发布目录：`dist`

### GitHub Pages

```bash
# 构建后
npm run build

# 部署到 gh-pages 分支
npx gh-pages -d dist
```

---

## 🖥️ Nginx 部署

1. 构建项目：
```bash
./deploy.sh
```

2. 复制文件到服务器：
```bash
scp -r dist/* user@server:/var/www/omnicore/
```

3. 配置 Nginx (使用 `nginx.prod.conf` 作为参考)

4. 重启 Nginx：
```bash
sudo systemctl restart nginx
```

---

## 📁 文件结构

```
omnicore-wallet/
├── src/
│   ├── components/
│   │   ├── ai-assistant/
│   │   │   ├── AIAssistant.tsx      # AI 助手主组件
│   │   │   ├── AIModelSettings.tsx   # 模型配置
│   │   │   └── SuperAgentDashboard.tsx # 超级智能体面板
│   │   ├── dashboard/
│   │   ├── wallet/
│   │   ├── defi/
│   │   └── ui/                       # shadcn/ui 组件
│   ├── lib/
│   │   ├── types.ts                  # TypeScript 类型
│   │   ├── mock-data.ts              # 模拟数据
│   │   └── utils.ts                  # 工具函数
│   └── styles/
│       └── theme.css                 # 主题样式
├── package.frontend.json              # 生产依赖
├── vite.config.prod.ts               # 生产 Vite 配置
├── Dockerfile.prod                   # Docker 构建
├── nginx.prod.conf                   # Nginx 配置
└── deploy.sh                         # 部署脚本
```

---

## ⚙️ 环境变量 (可选)

如需连接真实后端 API，创建 `.env` 文件：

```env
VITE_API_URL=https://api.your-domain.com
VITE_AI_API_KEY=your-openai-key
VITE_ENABLE_ANALYTICS=true
```

---

## 🔧 后续开发

当前版本使用模拟数据。要连接真实服务：

1. **AI 服务集成**
   - 修改 `src/components/ai-assistant/AIAssistant.tsx`
   - 替换 `generateAIResponse()` 为真实 API 调用

2. **钱包服务集成**
   - 集成 Web3 库 (ethers.js / wagmi)
   - 连接区块链 RPC

3. **后端 API**
   - 实现用户认证
   - 数据持久化

---

## 📞 支持

如有问题，请创建 Issue 或联系开发团队。

---

**OmniCore Wallet** - 企业级智能钱包平台 🚀
