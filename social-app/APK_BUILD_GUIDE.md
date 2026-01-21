# APK 打包教程 📱

## 简介

本教程将指导您如何将趣玩社区 React Web App 打包成 Android APK 应用。我们使用 Capacitor 作为跨平台框架。

## 前置要求

### 开发环境

1. **Node.js** 18.0+ 
2. **npm** 9.0+
3. **Android Studio** (最新版本)
4. **JDK 17+**

### 检查环境

```bash
node --version    # v18.0.0+
npm --version     # 9.0.0+
java --version    # 17+
```

---

## 步骤一：安装 Capacitor

```bash
# 进入项目目录
cd social-app

# 安装 Capacitor 核心包
npm install @capacitor/core @capacitor/cli

# 初始化 Capacitor
npx cap init "趣玩社区" "com.quwan.social" --web-dir=build

# 安装 Android 平台
npm install @capacitor/android

# 添加 Android 项目
npx cap add android
```

---

## 步骤二：配置 Capacitor

### 编辑 capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quwan.social',
  appName: '趣玩社区',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6C63FF',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#6C63FF'
    }
  }
};

export default config;
```

---

## 步骤三：构建 Web 应用

```bash
# 构建生产版本
npm run build

# 同步到 Android 项目
npx cap sync android
```

---

## 步骤四：配置 Android 项目

### 4.1 设置应用图标

将您的应用图标放置在以下目录：

```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png      (72x72)
├── mipmap-mdpi/ic_launcher.png      (48x48)
├── mipmap-xhdpi/ic_launcher.png     (96x96)
├── mipmap-xxhdpi/ic_launcher.png    (144x144)
├── mipmap-xxxhdpi/ic_launcher.png   (192x192)
```

### 4.2 配置启动画面

编辑 `android/app/src/main/res/values/styles.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">#6C63FF</item>
        <item name="colorPrimaryDark">#5B54D6</item>
        <item name="colorAccent">#FF6B9D</item>
    </style>
    
    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:background">#6C63FF</item>
    </style>
</resources>
```

### 4.3 配置权限

编辑 `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- 网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- 可选：相机权限 -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- 可选：存储权限 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <!-- ... activities ... -->
    </application>
</manifest>
```

---

## 步骤五：打包 APK

### 方式一：使用 Android Studio（推荐）

```bash
# 打开 Android Studio
npx cap open android
```

在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 选择 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. APK 文件将生成在 `android/app/build/outputs/apk/debug/`

### 方式二：使用命令行

```bash
# 进入 Android 目录
cd android

# 构建 Debug APK
./gradlew assembleDebug

# 构建 Release APK
./gradlew assembleRelease
```

APK 输出路径：
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## 步骤六：签名 Release APK

### 6.1 生成签名密钥

```bash
keytool -genkey -v -keystore quwan-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias quwan-key
```

按提示输入：
- 密钥库密码
- 您的姓名
- 组织单位
- 组织名称
- 城市
- 省份
- 国家代码 (CN)

### 6.2 配置签名

编辑 `android/app/build.gradle`:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            storeFile file('quwan-release-key.jks')
            storePassword 'your-store-password'
            keyAlias 'quwan-key'
            keyPassword 'your-key-password'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 6.3 构建签名 APK

```bash
cd android
./gradlew assembleRelease
```

---

## 自动化脚本

### build-apk.sh

```bash
#!/bin/bash
# =============================================================================
# APK 打包脚本
# 用法: ./build-apk.sh [debug|release]
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

# 构建 Web 应用
echo "🔨 构建 Web 应用..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web 构建失败！"
    exit 1
fi

# 同步 Capacitor
echo "📲 同步到 Android..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor 同步失败！"
    exit 1
fi

# 构建 APK
echo "📦 构建 APK..."
cd android

if [ "$MODE" = "release" ]; then
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "✅ APK 打包成功！"
    echo ""
    echo "📍 APK 路径: android/$APK_PATH"
    echo ""
    
    # 显示 APK 大小
    if [ -f "$APK_PATH" ]; then
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📊 APK 大小: $SIZE"
    fi
    echo "════════════════════════════════════════════════════════════"
else
    echo "❌ APK 打包失败！"
    exit 1
fi
```

---

## 常见问题

### Q: Gradle 构建失败？

```bash
# 清理并重新构建
cd android
./gradlew clean
./gradlew assembleDebug
```

### Q: Gradle 缓存损坏 (Failed to create Jar file)？

如果遇到类似以下错误：
```
Failed to create Jar file /root/.gradle/caches/jars-9/.../bcprov-jdk18on-1.79.jar
java.util.concurrent.ExecutionException: org.gradle.api.GradleException: Failed to create Jar file
```

这是 Gradle 缓存损坏问题。**build-apk.sh 脚本会自动检测并尝试修复此问题**，但如果需要手动解决：

```bash
# 方法一：清理损坏的缓存目录 + 使用 --no-daemon 模式
rm -rf ~/.gradle/caches/jars-*
rm -rf ~/.gradle/caches/transforms-*
rm -rf ~/.gradle/caches/modules-*

# 清理项目缓存并使用 --no-daemon 模式重新构建
cd android
rm -rf app/build build .gradle
./gradlew --no-daemon assembleDebug
```

```bash
# 方法二：完全清理 Gradle 缓存和守护进程（谨慎使用，会重新下载所有依赖）
cd android
./gradlew --stop  # 停止所有 Gradle 守护进程
rm -rf ~/.gradle/caches
rm -rf app/build build .gradle
./gradlew --no-daemon assembleDebug
```

```bash
# 方法三：如果以上方法都不行，尝试删除整个 Gradle 目录
rm -rf ~/.gradle
cd android
./gradlew --no-daemon assembleDebug
```

**常见原因：**
- 磁盘空间不足导致 JAR 文件写入失败
- 多个 Gradle 守护进程同时写入缓存
- 之前构建被中断导致缓存文件损坏

### Q: SDK 版本不兼容？

编辑 `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 22
        targetSdkVersion 34
    }
}
```

### Q: 应用闪退？

1. 检查 `adb logcat` 日志
2. 确保网络权限已添加
3. 确保 WebView 组件正常

```bash
# 查看日志
adb logcat | grep -i "social"
```

### Q: 如何调试？

```bash
# USB 连接手机后
npx cap run android
```

---

## 发布到应用商店

### Google Play Store

1. 登录 [Google Play Console](https://play.google.com/console)
2. 创建新应用
3. 上传 AAB 文件 (推荐) 或 APK
4. 填写应用信息
5. 提交审核

### 构建 AAB (Android App Bundle)

```bash
cd android
./gradlew bundleRelease
```

AAB 输出路径: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 项目结构

```
social-app/
├── android/                    # Android 原生项目
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/           # Java/Kotlin 代码
│   │   │   └── res/            # 资源文件
│   │   └── build.gradle
│   └── gradle/
├── build/                      # Web 构建产物
├── src/                        # React 源代码
├── capacitor.config.ts         # Capacitor 配置
└── package.json
```

---

## 更新应用

```bash
# 修改代码后
npm run build
npx cap sync android
npx cap open android
# 在 Android Studio 中重新构建
```

---

祝您打包顺利！🎉
