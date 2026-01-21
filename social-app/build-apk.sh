#!/bin/bash
# =============================================================================
# APK 打包脚本
# 用法: ./build-apk.sh [debug|release] [--auto-install]
# 示例: ./build-apk.sh release
#       ./build-apk.sh release --auto-install
# =============================================================================

MODE=${1:-debug}
AUTO_INSTALL=false

# 解析参数
for arg in "$@"; do
    case $arg in
        --auto-install|-y)
            AUTO_INSTALL=true
            ;;
    esac
done

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          📱 趣玩社区 APK 打包脚本                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📦 构建模式: $MODE"
if [ "$AUTO_INSTALL" = true ]; then
    echo "🔧 自动安装模式: 已启用"
fi
echo ""

# =============================================================================
# 辅助函数
# =============================================================================

# 询问用户是否安装
ask_install() {
    local tool_name=$1
    if [ "$AUTO_INSTALL" = true ]; then
        return 0
    fi
    echo ""
    read -p "是否自动安装 $tool_name? (y/n): " choice
    case "$choice" in
        y|Y|yes|YES) return 0 ;;
        *) return 1 ;;
    esac
}

# 检测操作系统
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$ID"
    elif [ "$(uname)" = "Darwin" ]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# 安装 Node.js
install_nodejs() {
    local os=$(detect_os)
    echo "🔄 正在安装 Node.js..."
    
    case $os in
        ubuntu|debian)
            # 使用 NodeSource 安装最新 LTS
            echo "   使用 NodeSource 安装 Node.js 18.x..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - 2>/dev/null
            sudo apt-get install -y nodejs 2>/dev/null
            ;;
        centos|rhel|fedora)
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - 2>/dev/null
            sudo yum install -y nodejs 2>/dev/null || sudo dnf install -y nodejs 2>/dev/null
            ;;
        macos)
            if command -v brew &> /dev/null; then
                brew install node
            else
                echo "❌ 请先安装 Homebrew: https://brew.sh"
                return 1
            fi
            ;;
        *)
            # 尝试使用 nvm 安装
            if command -v nvm &> /dev/null; then
                nvm install --lts
            else
                echo "⚠️  无法自动安装，请手动安装 Node.js"
                echo "   下载地址: https://nodejs.org/"
                return 1
            fi
            ;;
    esac
    
    if command -v node &> /dev/null; then
        echo "✅ Node.js 安装成功: $(node --version)"
        return 0
    else
        echo "❌ Node.js 安装失败"
        return 1
    fi
}

# 安装 Java/JDK
install_java() {
    local os=$(detect_os)
    echo "🔄 正在安装 JDK 17..."
    
    case $os in
        ubuntu|debian)
            sudo apt-get update 2>/dev/null
            sudo apt-get install -y openjdk-17-jdk 2>/dev/null
            ;;
        centos|rhel|fedora)
            sudo yum install -y java-17-openjdk-devel 2>/dev/null || sudo dnf install -y java-17-openjdk-devel 2>/dev/null
            ;;
        macos)
            if command -v brew &> /dev/null; then
                brew install openjdk@17
                BREW_PREFIX=$(brew --prefix openjdk@17 2>/dev/null)
                if [ -n "$BREW_PREFIX" ] && [ -d "$BREW_PREFIX/libexec/openjdk.jdk" ]; then
                    sudo ln -sfn "$BREW_PREFIX/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-17.jdk 2>/dev/null
                fi
            else
                echo "❌ 请先安装 Homebrew: https://brew.sh"
                return 1
            fi
            ;;
        *)
            echo "⚠️  无法自动安装，请手动安装 JDK 17+"
            echo "   下载地址: https://adoptium.net/"
            return 1
            ;;
    esac
    
    if command -v java &> /dev/null; then
        echo "✅ Java 安装成功: $(java --version 2>&1 | head -1)"
        return 0
    else
        echo "❌ Java 安装失败"
        return 1
    fi
}

# 清理 Gradle 缓存 (修复损坏的 jar 文件问题)
# 参数: $1 = "full" 进行完全清理, 否则进行部分清理
clean_gradle_cache() {
    local clean_level="${1:-partial}"
    echo "🧹 清理 Gradle 缓存..."
    
    # 获取 Gradle 用户目录
    local gradle_home="${GRADLE_USER_HOME:-$HOME/.gradle}"
    
    # 检查缓存目录是否存在
    if [ -d "$gradle_home/caches" ]; then
        # 删除所有可能损坏的 jars 缓存 (jars-*, 不仅仅是 jars-9)
        for dir in "$gradle_home/caches"/jars-*; do
            if [ -d "$dir" ]; then
                echo "   删除 $(basename "$dir") 缓存..."
                rm -rf "$dir"
            fi
        done
        
        # 删除可能损坏的 transforms 缓存
        for dir in "$gradle_home/caches"/transforms-*; do
            if [ -d "$dir" ]; then
                echo "   删除 $(basename "$dir") 缓存..."
                rm -rf "$dir"
            fi
        done
        
        # 如果是完全清理，删除更多缓存目录
        if [ "$clean_level" = "full" ]; then
            echo "   执行完全清理..."
            # 删除 modules 缓存
            for dir in "$gradle_home/caches"/modules-*; do
                if [ -d "$dir" ]; then
                    echo "   删除 $(basename "$dir") 缓存..."
                    rm -rf "$dir"
                fi
            done
            # 删除 build-cache
            if [ -d "$gradle_home/caches/build-cache-1" ]; then
                echo "   删除 build-cache-1 缓存..."
                rm -rf "$gradle_home/caches/build-cache-1"
            fi
            # 停止所有 Gradle 守护进程
            echo "   停止 Gradle 守护进程..."
            # 使用 gradle --stop 更安全
            if [ -f "android/gradlew" ]; then
                (cd android && ./gradlew --stop 2>/dev/null || true)
            fi
        fi
        
        echo "✅ Gradle 缓存清理完成"
        return 0
    else
        echo "ℹ️  未发现 Gradle 缓存目录"
        return 0
    fi
}

# 显示 Android SDK 安装指南
show_android_sdk_guide() {
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "📋 Android SDK 安装指南"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "方式一：安装 Android Studio（推荐）"
    echo "   1. 下载: https://developer.android.com/studio"
    echo "   2. 安装并启动 Android Studio"
    echo "   3. SDK Manager 会自动安装所需组件"
    echo ""
    echo "方式二：仅安装命令行工具"
    echo "   1. 下载: https://developer.android.com/studio#command-tools"
    echo "   2. 解压到 ~/Android/Sdk"
    echo "   3. 设置环境变量:"
    echo "      export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "      export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin"
    echo "      export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    echo ""
    echo "设置完成后，请重新运行此脚本。"
    echo "════════════════════════════════════════════════════════════"
}

# =============================================================================
# 环境检测
# =============================================================================

echo "🔍 检测开发环境..."
echo ""

MISSING_DEPS=()

# 检查 Node.js
echo -n "   Node.js: "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ $NODE_VERSION"
else
    echo "❌ 未安装"
    MISSING_DEPS+=("nodejs")
fi

# 检查 npm (npm 通常随 Node.js 一起安装)
echo -n "   npm:     "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ v$NPM_VERSION"
else
    echo "❌ 未安装"
    # npm 随 Node.js 一起安装，只有当 Node.js 存在但 npm 不存在时才单独标记
    if command -v node &> /dev/null; then
        MISSING_DEPS+=("npm")
    fi
    # 如果 Node.js 也缺失，安装 Node.js 将自动安装 npm
fi

# 检查 Java
echo -n "   Java:    "
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java --version 2>&1 | head -1)
    echo "✅ $JAVA_VERSION"
else
    echo "❌ 未安装"
    MISSING_DEPS+=("java")
fi

# 检查 Android SDK
echo -n "   Android: "
if [ -n "$ANDROID_HOME" ] || [ -n "$ANDROID_SDK_ROOT" ]; then
    SDK_PATH=${ANDROID_HOME:-$ANDROID_SDK_ROOT}
    echo "✅ $SDK_PATH"
else
    echo "⚠️  未配置 (可选，用于命令行构建)"
fi

echo ""

# =============================================================================
# 安装缺失的依赖
# =============================================================================

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo "════════════════════════════════════════════════════════════"
    echo "⚠️  发现缺失的依赖: ${MISSING_DEPS[*]}"
    echo "════════════════════════════════════════════════════════════"
    
    for dep in "${MISSING_DEPS[@]}"; do
        case $dep in
            nodejs)
                if ask_install "Node.js"; then
                    install_nodejs
                    if [ $? -ne 0 ]; then
                        echo ""
                        echo "❌ 无法继续: Node.js 是必需的依赖"
                        echo "   请手动安装 Node.js 18.x 或更高版本"
                        echo "   下载地址: https://nodejs.org/"
                        exit 1
                    fi
                else
                    echo ""
                    echo "❌ 无法继续: Node.js 是必需的依赖"
                    echo "   请手动安装后重新运行此脚本"
                    exit 1
                fi
                ;;
            npm)
                echo "⚠️  npm 通常随 Node.js 一起安装"
                echo "   请确保 Node.js 安装正确"
                exit 1
                ;;
            java)
                if ask_install "Java JDK 17"; then
                    install_java
                    if [ $? -ne 0 ]; then
                        echo ""
                        echo "⚠️  Java 安装失败，但可以继续"
                        echo "   如需命令行构建 APK，请手动安装 JDK 17+"
                    fi
                else
                    echo ""
                    echo "⚠️  跳过 Java 安装"
                    echo "   如需命令行构建 APK，请手动安装 JDK 17+"
                fi
                ;;
        esac
    done
    
    echo ""
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
    echo ""
    
    # 尝试自动检测常见路径
    POSSIBLE_PATHS=(
        "$HOME/Android/Sdk"
        "$HOME/Library/Android/sdk"
        "/usr/local/android-sdk"
        "/opt/android-sdk"
    )
    
    SDK_FOUND=false
    for path in "${POSSIBLE_PATHS[@]}"; do
        if [ -d "$path" ]; then
            echo "🔍 检测到 Android SDK: $path"
            export ANDROID_HOME="$path"
            export PATH="$PATH:$ANDROID_HOME/platform-tools"
            SDK_FOUND=true
            break
        fi
    done
    
    if [ "$SDK_FOUND" = false ]; then
        echo "   未检测到 Android SDK"
        echo ""
        echo "📋 选项:"
        echo "   1. 在 Android Studio 中打开项目并构建:"
        echo "      npx cap open android"
        echo "      选择: Build → Build Bundle(s) / APK(s) → Build APK(s)"
        echo ""
        echo "   2. 安装 Android SDK 后重新运行此脚本"
        
        if ask_install "查看 Android SDK 安装指南"; then
            show_android_sdk_guide
        fi
        
        echo ""
        read -p "是否继续尝试构建? (y/n): " continue_build
        case "$continue_build" in
            y|Y|yes|YES)
                echo "⚠️  继续构建，但可能会失败..."
                ;;
            *)
                echo "👋 退出脚本"
                exit 0
                ;;
        esac
    fi
fi

# 构建 APK
echo ""
echo "📦 构建 APK..."
cd android

# 构建函数
# 参数: $1 = 是否使用 --no-daemon 标志 (true/false)
run_gradle_build() {
    local use_no_daemon="${1:-false}"
    
    if [ "$use_no_daemon" = "true" ]; then
        echo "   使用 --no-daemon 模式避免缓存锁定问题"
        if [ "$MODE" = "release" ]; then
            echo "   模式: Release (签名版本)"
            ./gradlew --no-daemon assembleRelease 2>&1
            return $?
        else
            echo "   模式: Debug (调试版本)"
            ./gradlew --no-daemon assembleDebug 2>&1
            return $?
        fi
    else
        if [ "$MODE" = "release" ]; then
            echo "   模式: Release (签名版本)"
            ./gradlew assembleRelease 2>&1
            return $?
        else
            echo "   模式: Debug (调试版本)"
            ./gradlew assembleDebug 2>&1
            return $?
        fi
    fi
}

# 检测 Gradle 缓存损坏错误
is_gradle_cache_error() {
    local output="$1"
    # 检测多种缓存损坏相关的错误模式
    if echo "$output" | grep -qE "(Failed to create Jar file|Could not create entry|Couldn't create parent directory|java\.util\.zip\.ZipException|Failed to read entry|Corrupt|Unable to delete stale cache)"; then
        return 0
    fi
    return 1
}

# 设置 APK 路径
if [ "$MODE" = "release" ]; then
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    APK_UNSIGNED_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
else
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

# 第一次尝试构建
BUILD_OUTPUT=$(run_gradle_build)
BUILD_RESULT=$?
echo "$BUILD_OUTPUT"

# 如果构建失败，检查是否是 Gradle 缓存损坏问题
if [ $BUILD_RESULT -ne 0 ]; then
    # 检查是否是缓存损坏错误 (bcprov-jdk18on, 其他 jar 文件创建失败等)
    if is_gradle_cache_error "$BUILD_OUTPUT"; then
        echo ""
        echo "════════════════════════════════════════════════════════════"
        echo "⚠️  检测到 Gradle 缓存损坏问题"
        echo "   正在自动清理缓存并重试..."
        echo "════════════════════════════════════════════════════════════"
        echo ""
        
        # 第一次重试: 部分清理 + no-daemon 模式
        cd ..
        clean_gradle_cache "partial"
        cd android
        
        echo ""
        echo "🔄 重新构建 APK (使用 --no-daemon 模式)..."
        BUILD_OUTPUT=$(run_gradle_build "true")
        BUILD_RESULT=$?
        echo "$BUILD_OUTPUT"
        
        # 如果仍然失败并且是缓存问题，尝试完全清理
        if [ $BUILD_RESULT -ne 0 ] && is_gradle_cache_error "$BUILD_OUTPUT"; then
            echo ""
            echo "════════════════════════════════════════════════════════════"
            echo "⚠️  部分清理后仍有缓存问题"
            echo "   正在执行完全清理并再次重试..."
            echo "════════════════════════════════════════════════════════════"
            echo ""
            
            cd ..
            clean_gradle_cache "full"
            cd android
            
            # 清理项目级别的构建目录
            echo "🧹 清理项目构建目录..."
            rm -rf app/build 2>/dev/null || true
            rm -rf build 2>/dev/null || true
            rm -rf .gradle 2>/dev/null || true
            
            echo ""
            echo "🔄 最后一次尝试构建..."
            BUILD_OUTPUT=$(run_gradle_build "true")
            BUILD_RESULT=$?
            echo "$BUILD_OUTPUT"
        fi
    fi
fi
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
    echo "   3. 清理 Gradle 缓存后重试:"
    echo "      rm -rf ~/.gradle/caches/jars-*"
    echo "      rm -rf ~/.gradle/caches/transforms-*"
    echo "      cd android && ./gradlew clean"
    echo "   4. 尝试在 Android Studio 中打开项目:"
    echo "      npx cap open android"
    echo "════════════════════════════════════════════════════════════"
    exit 1
fi
