#!/bin/bash
# =============================================================================
# APK 打包脚本
# 用法: ./build-apk.sh [debug|release]
# 示例: ./build-apk.sh release
# =============================================================================

MODE=${1:-debug}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          📱 趣玩社区 APK 打包脚本                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📦 构建模式: $MODE"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    exit 1
fi

# 检查是否安装了 Capacitor
if [ ! -d "node_modules/@capacitor" ]; then
    echo "⚠️  Capacitor 未安装，正在安装..."
    npm install @capacitor/core @capacitor/cli @capacitor/android
    
    if [ $? -ne 0 ]; then
        echo "❌ Capacitor 安装失败！"
        exit 1
    fi
fi

# 检查是否初始化了 Capacitor
if [ ! -f "capacitor.config.ts" ] && [ ! -f "capacitor.config.json" ]; then
    echo "📝 初始化 Capacitor..."
    npx cap init "趣玩社区" "com.quwan.social" --web-dir=build
fi

# 检查是否添加了 Android 平台
if [ ! -d "android" ]; then
    echo "📲 添加 Android 平台..."
    npx cap add android
    
    if [ $? -ne 0 ]; then
        echo "❌ 添加 Android 平台失败！"
        exit 1
    fi
fi

# 构建 Web 应用
echo ""
echo "🔨 构建 Web 应用..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web 构建失败！"
    exit 1
fi

# 同步 Capacitor
echo ""
echo "📲 同步到 Android..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor 同步失败！"
    exit 1
fi

# 检查 Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo ""
    echo "⚠️  警告: ANDROID_HOME 或 ANDROID_SDK_ROOT 未设置"
    echo "   请确保 Android Studio 已安装并配置正确"
    echo ""
    echo "📋 在 Android Studio 中打开项目:"
    echo "   npx cap open android"
    echo ""
    echo "   然后选择: Build → Build Bundle(s) / APK(s) → Build APK(s)"
    exit 0
fi

# 构建 APK
echo ""
echo "📦 构建 APK..."
cd android

if [ "$MODE" = "release" ]; then
    echo "   模式: Release (签名版本)"
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    APK_UNSIGNED_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
else
    echo "   模式: Debug (调试版本)"
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

BUILD_RESULT=$?
cd ..

if [ $BUILD_RESULT -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "✅ APK 打包成功！"
    echo ""
    
    # 显示 APK 路径和大小
    FULL_APK_PATH="android/$APK_PATH"
    if [ -f "$FULL_APK_PATH" ]; then
        SIZE=$(du -h "$FULL_APK_PATH" | cut -f1)
        echo "📍 APK 路径: $FULL_APK_PATH"
        echo "📊 APK 大小: $SIZE"
    elif [ -f "android/$APK_UNSIGNED_PATH" ]; then
        SIZE=$(du -h "android/$APK_UNSIGNED_PATH" | cut -f1)
        echo "📍 APK 路径: android/$APK_UNSIGNED_PATH"
        echo "📊 APK 大小: $SIZE"
        echo ""
        echo "⚠️  注意: 这是未签名的 APK，需要签名后才能发布"
    fi
    
    echo ""
    echo "📲 安装到设备:"
    echo "   adb install \"$FULL_APK_PATH\""
    echo "════════════════════════════════════════════════════════════"
else
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "❌ APK 打包失败！"
    echo ""
    echo "📋 故障排查:"
    echo "   1. 确保 Android Studio 已安装"
    echo "   2. 确保 ANDROID_HOME 环境变量已设置"
    echo "   3. 尝试在 Android Studio 中打开项目:"
    echo "      npx cap open android"
    echo "════════════════════════════════════════════════════════════"
    exit 1
fi
