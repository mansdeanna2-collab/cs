# Docker 打包部署教程 🐳

## 简介

本教程将指导您如何使用 Docker 打包和部署趣玩社区 App。

## 前置要求

- 安装 Docker (版本 20.10+)
- 安装 Docker Compose (版本 2.0+)

### 检查安装

```bash
docker --version
docker-compose --version
```

---

## 快速开始

### 方式一：使用 Docker Compose（推荐）

```bash
# 1. 进入项目目录
cd social-app

# 2. 构建并启动容器
docker-compose up -d --build

# 3. 查看运行状态
docker-compose ps

# 4. 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 方式二：使用 Docker 命令

```bash
# 1. 进入项目目录
cd social-app

# 2. 构建镜像
docker build -t social-app:latest .

# 3. 运行容器
docker run -d -p 3000:80 --name social-app social-app:latest

# 4. 查看运行状态
docker ps

# 5. 访问应用
# 打开浏览器访问 http://localhost:3000
```

---

## 常用命令

### 容器管理

```bash
# 查看日志
docker-compose logs -f

# 停止容器
docker-compose stop

# 启动容器
docker-compose start

# 重启容器
docker-compose restart

# 停止并删除容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 镜像管理

```bash
# 查看所有镜像
docker images

# 删除镜像
docker rmi social-app:latest

# 清理未使用的镜像
docker image prune
```

---

## 生产环境部署

### 1. 构建生产镜像

```bash
docker build -t social-app:v1.0.0 .
```

### 2. 推送到镜像仓库

```bash
# 登录 Docker Hub 或私有仓库
docker login

# 打标签
docker tag social-app:v1.0.0 your-registry/social-app:v1.0.0

# 推送镜像
docker push your-registry/social-app:v1.0.0
```

### 3. 在服务器上部署

```bash
# 拉取镜像
docker pull your-registry/social-app:v1.0.0

# 运行容器
docker run -d \
  --name social-app \
  --restart unless-stopped \
  -p 80:80 \
  your-registry/social-app:v1.0.0
```

---

## 自动化脚本

### build.sh - 构建脚本

```bash
#!/bin/bash
# 构建 Docker 镜像

VERSION=${1:-latest}

echo "🚀 开始构建 social-app:$VERSION ..."

docker build -t social-app:$VERSION .

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "运行: docker run -d -p 3000:80 social-app:$VERSION"
else
    echo "❌ 构建失败！"
    exit 1
fi
```

### deploy.sh - 部署脚本

```bash
#!/bin/bash
# 一键部署脚本

echo "🐳 趣玩社区 Docker 部署"
echo "========================"

# 停止旧容器
echo "⏹️  停止旧容器..."
docker-compose down 2>/dev/null

# 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build --no-cache

# 启动新容器
echo "🚀 启动新容器..."
docker-compose up -d

# 检查状态
echo "📊 检查状态..."
sleep 3
docker-compose ps

echo ""
echo "✅ 部署完成！"
echo "🌐 访问地址: http://localhost:3000"
```

---

## 故障排查

### 查看容器日志

```bash
docker-compose logs -f app
```

### 进入容器调试

```bash
docker exec -it social-app sh
```

### 检查网络

```bash
docker network ls
docker network inspect social-app_default
```

### 检查资源使用

```bash
docker stats social-app
```

---

## 配置说明

### Dockerfile 说明

| 阶段 | 说明 |
|------|------|
| builder | 使用 Node.js 构建 React 应用 |
| production | 使用 Nginx 提供静态文件服务 |

### 端口映射

| 容器端口 | 主机端口 | 说明 |
|---------|---------|------|
| 80 | 3000 | Web 服务 |

---

## 最佳实践

1. ✅ 使用多阶段构建减小镜像体积
2. ✅ 使用 .dockerignore 排除不必要文件
3. ✅ 使用健康检查确保服务可用
4. ✅ 使用非 root 用户运行容器
5. ✅ 定期更新基础镜像

---

## 镜像大小优化

当前构建的镜像大约为 **30-40MB**，这得益于：

- 使用 Alpine 基础镜像
- 多阶段构建
- 仅复制必要的构建产物

---

祝您部署顺利！🎉
