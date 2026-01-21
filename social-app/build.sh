#!/bin/bash
# =============================================================================
# 构建 Docker 镜像脚本
# 用法: ./build.sh [version]
# 示例: ./build.sh v1.0.0
# =============================================================================

VERSION=${1:-latest}
IMAGE_NAME="social-app"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🎮 趣玩社区 Docker 构建脚本                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📦 镜像名称: $IMAGE_NAME:$VERSION"
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ 错误: Docker 未运行，请先启动 Docker"
    exit 1
fi

# 开始构建
echo "🔨 开始构建镜像..."
echo ""

docker build -t $IMAGE_NAME:$VERSION .

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "✅ 构建成功！"
    echo ""
    echo "📋 镜像信息:"
    docker images $IMAGE_NAME:$VERSION
    echo ""
    echo "🚀 运行命令:"
    echo "   docker run -d -p 3000:80 --name $IMAGE_NAME $IMAGE_NAME:$VERSION"
    echo ""
    echo "🌐 访问地址: http://localhost:3000"
    echo "════════════════════════════════════════════════════════════"
else
    echo ""
    echo "❌ 构建失败！请检查错误信息"
    exit 1
fi
