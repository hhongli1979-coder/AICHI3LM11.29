#!/bin/bash

# OmniCore Wallet - 部署脚本
# Deployment Script for OmniCore Wallet

echo "🚀 OmniCore Wallet 部署准备..."
echo ""

# 1. 备份原始文件
echo "📦 步骤 1: 备份原始文件..."
cp package.json package.json.backup 2>/dev/null || true
cp vite.config.ts vite.config.ts.backup 2>/dev/null || true
cp index.html index.html.backup 2>/dev/null || true
cp src/main.tsx src/main.tsx.backup 2>/dev/null || true

# 2. 使用生产配置
echo "⚙️  步骤 2: 应用生产配置..."
cp package.frontend.json package.json
cp vite.config.prod.ts vite.config.ts
cp index.prod.html index.html
cp src/main.prod.tsx src/main.tsx

# 3. 安装依赖
echo "📥 步骤 3: 安装依赖..."
npm install

# 4. 构建项目
echo "🔨 步骤 4: 构建生产版本..."
npm run build

# 5. 输出结果
echo ""
echo "✅ 构建完成！"
echo ""
echo "📁 生产文件位于: ./dist/"
echo ""
echo "部署选项:"
echo "  1. 静态托管 (Vercel/Netlify/GitHub Pages):"
echo "     将 dist/ 文件夹上传到托管平台"
echo ""
echo "  2. Docker 部署:"
echo "     docker build -t omnicore-wallet ."
echo "     docker run -p 80:80 omnicore-wallet"
echo ""
echo "  3. Nginx 部署:"
echo "     将 dist/ 内容复制到 /var/www/html/"
echo ""
echo "  4. 本地预览:"
echo "     npm run preview"
echo ""
