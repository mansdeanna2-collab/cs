#!/bin/bash
# =============================================================================
# 一键部署脚本
# 用法: ./deploy.sh
# =============================================================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🐳 趣玩社区 Docker 部署脚本                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ 错误: Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: docker-compose 未安装"
    exit 1
fi

# 检查 curl 是否安装 (用于健康检查)
if ! command -v curl &> /dev/null; then
    echo "⚠️  警告: curl 未安装，将跳过健康检查"
    SKIP_HEALTH_CHECK=true
fi

# 停止旧容器
echo "⏹️  停止旧容器..."
docker-compose down 2>/dev/null
echo ""

# 清理旧镜像 (可选)
read -p "是否清理旧镜像? (y/N): " clean_images
if [ "$clean_images" = "y" ] || [ "$clean_images" = "Y" ]; then
    echo "🧹 清理旧镜像..."
    docker image prune -f
    echo ""
fi

# 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build --no-cache
echo ""

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

# 启动新容器
echo "🚀 启动新容器..."
docker-compose up -d
echo ""

# 等待容器启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查状态
echo "📊 容器状态:"
docker-compose ps
echo ""

# 健康检查
echo "🏥 健康检查..."
if [ "$SKIP_HEALTH_CHECK" = "true" ]; then
    echo "⚠️  跳过健康检查 (curl 未安装)"
elif curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ 服务运行正常！"
else
    echo "⚠️  服务可能还在启动中，请稍后再试"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址: http://localhost:3000"
echo ""
echo "📋 常用命令:"
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose stop"
echo "   重启服务: docker-compose restart"
echo "════════════════════════════════════════════════════════════"
