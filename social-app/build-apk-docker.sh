#!/bin/bash
# =============================================================================
# Docker 容器 APK 打包脚本
# 用法: ./build-apk-docker.sh [debug|release] [--rebuild]
# 示例: ./build-apk-docker.sh release
#       ./build-apk-docker.sh debug --rebuild
# =============================================================================

MODE=${1:-debug}
REBUILD=false
IMAGE_NAME="social-app-apk-builder"

# 解析参数
for arg in "$@"; do
    case $arg in
        --rebuild|-r)
            REBUILD=true
            ;;
        debug|release)
            MODE=$arg
            ;;
    esac
done

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      🐳 Docker APK 打包脚本                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📦 构建模式: $MODE"
if [ "$REBUILD" = true ]; then
    echo "🔄 强制重新构建镜像: 是"
fi
echo ""

# =============================================================================
# 检查 Docker 环境
# =============================================================================

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ 错误: Docker 未运行，请先启动 Docker"
    echo ""
    echo "📋 安装 Docker:"
    echo "   - macOS/Windows: https://www.docker.com/products/docker-desktop"
    echo "   - Linux: https://docs.docker.com/engine/install/"
    exit 1
fi

echo "✅ Docker 已运行"

# =============================================================================
# 创建输出目录
# =============================================================================

OUTPUT_DIR="$(pwd)/output"
mkdir -p "$OUTPUT_DIR"
echo "📁 输出目录: $OUTPUT_DIR"
echo ""

# =============================================================================
# 检查或构建 Docker 镜像
# =============================================================================

IMAGE_EXISTS=$(docker images -q "$IMAGE_NAME" 2> /dev/null)

if [ -z "$IMAGE_EXISTS" ] || [ "$REBUILD" = true ]; then
    echo "🔨 构建 Docker 镜像..."
    echo ""
    
    docker build -f Dockerfile.apk-builder -t $IMAGE_NAME .
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Docker 镜像构建失败！"
        exit 1
    fi
    
    echo ""
    echo "✅ Docker 镜像构建成功"
else
    echo "✅ 使用现有 Docker 镜像: $IMAGE_NAME"
    echo "   (使用 --rebuild 参数可强制重新构建镜像)"
fi

echo ""

# =============================================================================
# 运行容器构建 APK
# =============================================================================

echo "🚀 开始在 Docker 容器中构建 APK..."
echo ""

docker run --rm \
    -v "$OUTPUT_DIR:/app/output" \
    -v social-app-gradle-cache:/root/.gradle \
    --name "${IMAGE_NAME}-running" \
    $IMAGE_NAME $MODE

BUILD_RESULT=$?

echo ""

if [ $BUILD_RESULT -eq 0 ]; then
    echo "════════════════════════════════════════════════════════════"
    echo "✅ APK 打包成功！"
    echo ""
    echo "📁 输出目录: $OUTPUT_DIR"
    echo "📦 APK 文件:"
    ls -la "$OUTPUT_DIR"/*.apk 2>/dev/null || echo "   (未找到 APK 文件)"
    echo ""
    echo "📲 安装到设备:"
    if [ "$MODE" = "release" ]; then
        echo "   adb install \"$OUTPUT_DIR/app-release.apk\""
    else
        echo "   adb install \"$OUTPUT_DIR/app-debug.apk\""
    fi
    echo "════════════════════════════════════════════════════════════"
else
    echo "════════════════════════════════════════════════════════════"
    echo "❌ APK 打包失败！"
    echo ""
    echo "📋 故障排查:"
    echo "   1. 检查 Docker 日志获取详细错误信息"
    echo "   2. 尝试强制重新构建镜像: ./build-apk-docker.sh $MODE --rebuild"
    echo "   3. 清理 Gradle 缓存: docker volume rm social-app-gradle-cache"
    echo "   4. 查看完整文档: APK_DOCKER_BUILD_GUIDE.md"
    echo "════════════════════════════════════════════════════════════"
    exit 1
fi
