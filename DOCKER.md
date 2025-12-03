# OmniCore Wallet - Docker 镜像管理指南

## 概述

本仓库集中管理所有环境的 Docker 镜像。核心镜像名称为 **ogegge**，支持开发和生产两种模式。

## 镜像信息

| 镜像名称 | 标签 | 用途 |
|---------|-----|------|
| `omnicore/ogegge` | `latest` | 生产环境 |
| `omnicore/ogegge` | `dev` | 开发环境 |

## 快速开始

### 生产环境

```bash
# 构建并启动生产环境
docker compose up ogegge -d

# 或直接使用预构建镜像
docker pull omnicore/ogegge:latest
docker run -p 80:80 omnicore/ogegge:latest
```

### 开发环境

```bash
# 启动开发环境（支持热重载）
docker compose --profile dev up ogegge-dev

# 开发服务器将在 http://localhost:5173 运行
```

### 遗留服务（可选）

```bash
# 启动遗留的 MySQL 和 phpMyAdmin 服务
docker compose --profile legacy up -d
```

## 构建镜像

```bash
# 构建生产镜像
docker build --target production -t omnicore/ogegge:latest .

# 构建开发镜像
docker build --target development -t omnicore/ogegge:dev .

# 构建所有镜像
docker compose build
```

## 镜像架构

```
Dockerfile
├── Stage 1: builder      # Node.js 22 Alpine - 编译构建
├── Stage 2: production   # Nginx Alpine - 生产服务
└── Stage 3: development  # Node.js 22 Alpine - 开发服务
```

## 服务配置

### ogegge (生产环境)
- **端口**: 80
- **技术栈**: Nginx + 静态文件
- **特性**: 
  - Gzip 压缩
  - 静态资源缓存
  - SPA 路由支持
  - 健康检查

### ogegge-dev (开发环境)
- **端口**: 5173
- **技术栈**: Vite Dev Server
- **特性**:
  - 热模块替换 (HMR)
  - 源代码挂载
  - 实时编译

## 环境变量

### 开发环境
```yaml
NODE_ENV: development
```

### 生产环境
通过 Nginx 配置管理，无需额外环境变量。

## 网络配置

所有服务连接到 `app-network` 桥接网络，支持服务间通信。

## 健康检查

生产环境镜像包含健康检查配置：
- 检查间隔: 30秒
- 超时时间: 10秒
- 重试次数: 3次
- 启动延迟: 10秒

## 常用命令

```bash
# 查看运行中的容器
docker compose ps

# 查看日志
docker compose logs ogegge -f

# 停止所有服务
docker compose down

# 清理未使用的镜像
docker image prune -f

# 完全清理（包括数据卷）
docker compose down -v --rmi all
```

## 推送镜像到仓库

```bash
# 登录 Docker Hub
docker login

# 推送镜像
docker push omnicore/ogegge:latest
docker push omnicore/ogegge:dev
```

## 故障排除

### 端口冲突
```bash
# 检查端口占用
netstat -tlnp | grep :80

# 停止占用端口的服务
docker compose down
```

### 构建失败
```bash
# 清理构建缓存
docker builder prune -f

# 无缓存重新构建
docker compose build --no-cache
```

## 相关文件

- `Dockerfile` - 多阶段 Docker 构建配置
- `docker-compose.yml` - 服务编排配置
- `nginx.conf` - Nginx 服务器配置
- `.dockerignore` - 构建排除列表
