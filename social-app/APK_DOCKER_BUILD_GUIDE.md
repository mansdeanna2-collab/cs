# Docker 容器 APK 打包教程 🐳📱

## 简介

本教程将指导您如何使用 Docker 容器环境打包趣玩社区 Android APK 应用。使用 Docker 可以确保构建环境的一致性，无需在本地安装 Android SDK 和 Java 环境。

## 优势

- ✅ **环境一致性**: 无论在哪台机器上构建，都使用相同的环境
- ✅ **零配置**: 无需手动安装 Android SDK、Java、Node.js
- ✅ **隔离性**: 构建环境与本地系统完全隔离
- ✅ **可重复性**: 每次构建都从干净的环境开始
- ✅ **CI/CD 友好**: 轻松集成到自动化构建流程

## 前置要求

- 安装 Docker (版本 20.10+)
- 安装 Docker Compose (版本 2.0+)
- 至少 4GB 可用内存
- 至少 10GB 磁盘空间

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

# 2. 创建输出目录
mkdir -p output

# 3. 构建 Debug APK
docker-compose -f docker-compose.apk-builder.yml up --build

# 4. 构建完成后，APK 文件在 output 目录中
ls -la output/
```

### 方式二：使用 Docker 命令

```bash
# 1. 进入项目目录
cd social-app

# 2. 创建输出目录
mkdir -p output

# 3. 构建 Docker 镜像
docker build -f Dockerfile.apk-builder -t social-app-apk-builder .

# 4. 运行容器构建 Debug APK
docker run --rm \
    -v $(pwd)/output:/app/output \
    social-app-apk-builder debug

# 5. 或者构建 Release APK
docker run --rm \
    -v $(pwd)/output:/app/output \
    social-app-apk-builder release
```

---

## 构建模式

### Debug APK (调试版本)

用于开发和测试：

```bash
# 使用 Docker Compose
docker-compose -f docker-compose.apk-builder.yml up --build

# 或使用 Docker 命令
docker run --rm -v $(pwd)/output:/app/output social-app-apk-builder debug
```

输出文件: `output/app-debug.apk`

### Release APK (发布版本)

用于正式发布：

```bash
# 使用 Docker Compose
docker-compose -f docker-compose.apk-builder.yml run --rm apk-builder release

# 或使用 Docker 命令
docker run --rm -v $(pwd)/output:/app/output social-app-apk-builder release
```

输出文件: `output/app-release-unsigned.apk` 或 `output/app-release.apk`

> ⚠️ 注意: Release APK 需要签名后才能发布到应用商店

---

## APK 签名

### 1. 生成签名密钥

```bash
keytool -genkey -v -keystore quwan-release-key.jks \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias quwan-key
```

### 2. 签名 APK

```bash
# 使用 apksigner 签名
apksigner sign --ks quwan-release-key.jks \
    --out output/app-release-signed.apk \
    output/app-release-unsigned.apk

# 或使用 jarsigner
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
    -keystore quwan-release-key.jks \
    output/app-release-unsigned.apk quwan-key
```

---

## 自动化脚本

项目包含一个便捷的构建脚本 `build-apk-docker.sh`:

```bash
# 构建 Debug APK
./build-apk-docker.sh

# 构建 Release APK
./build-apk-docker.sh release

# 强制重新构建镜像
./build-apk-docker.sh debug --rebuild
```

---

## 高级配置

### 使用 Gradle 缓存加速构建

Docker Compose 配置已包含 Gradle 缓存挂载，第二次构建会更快：

```yaml
volumes:
  - gradle-cache:/root/.gradle
```

### 自定义 Android SDK 版本

修改 `Dockerfile.apk-builder` 中的以下参数：

```dockerfile
ARG BUILD_TOOLS_VERSION=34.0.0
ARG PLATFORM_VERSION=android-34
```

### 自定义 Kotlin 版本

构建脚本会自动修复 Kotlin stdlib 依赖冲突。默认使用 Kotlin 1.8.22，如需自定义版本，可以在运行容器时设置环境变量：

```bash
docker run --rm \
    -v $(pwd)/output:/app/output \
    -e KOTLIN_VERSION=1.9.0 \
    social-app-apk-builder debug
```

### 增加内存限制

如果构建失败，可能需要增加 Docker 内存限制：

```yaml
deploy:
  resources:
    limits:
      memory: 6G
```

---

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Build APK

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build APK in Docker
        working-directory: social-app
        run: |
          mkdir -p output
          docker build -f Dockerfile.apk-builder -t apk-builder .
          docker run --rm -v $(pwd)/output:/app/output apk-builder debug
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug
          path: social-app/output/*.apk
```

### GitLab CI 示例

```yaml
build-apk:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - cd social-app
    - mkdir -p output
    - docker build -f Dockerfile.apk-builder -t apk-builder .
    - docker run --rm -v $(pwd)/output:/app/output apk-builder debug
  artifacts:
    paths:
      - social-app/output/*.apk
```

---

## 故障排查

### 常见问题

#### 1. Kotlin stdlib 重复类冲突

```
Duplicate class kotlin.collections.jdk8.CollectionsJDK8Kt found in modules...
```

这是由于 Kotlin 1.8+ 将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到了主 `kotlin-stdlib` 中，但某些依赖可能仍然引入旧版本的这些模块，导致类重复冲突。

**解决方案**：Docker 构建脚本已自动应用此修复。如果遇到此问题，请确保使用最新版本的 `Dockerfile.apk-builder`，或者清理缓存后重新构建：

```bash
docker volume rm social-app-gradle-cache
./build-apk-docker.sh --rebuild
```

#### 2. 内存不足

```
Error: ENOMEM
```

解决方案：增加 Docker 内存限制到 4GB 以上。

#### 3. 磁盘空间不足

```
No space left on device
```

解决方案：清理 Docker 缓存。

```bash
docker system prune -a
```

#### 4. 构建超时

解决方案：首次构建需要下载较多依赖，请耐心等待。后续构建会使用缓存加速。

#### 5. Gradle 缓存问题

如果遇到 Gradle 缓存损坏，清理缓存后重试：

```bash
docker volume rm social-app-gradle-cache
docker-compose -f docker-compose.apk-builder.yml up --build
```

### 查看构建日志

```bash
# 实时查看日志
docker-compose -f docker-compose.apk-builder.yml logs -f

# 进入容器调试
docker run -it --rm social-app-apk-builder /bin/bash
```

---

## 镜像信息

| 组件 | 版本 |
|------|------|
| 基础镜像 | Ubuntu 22.04 |
| Node.js | 20.x LTS |
| Java JDK | 21 |
| Android SDK | 34 |
| Build Tools | 34.0.0 |
| Gradle | 自动下载 |

---

## 目录结构

```
social-app/
├── Dockerfile.apk-builder          # APK 构建 Docker 镜像
├── docker-compose.apk-builder.yml  # APK 构建 Docker Compose 配置
├── build-apk-docker.sh             # Docker APK 构建便捷脚本
├── build-apk.sh                    # 本地 APK 构建脚本
├── output/                         # APK 输出目录
│   ├── app-debug.apk
│   └── app-release.apk
└── ...
```

---

## 最佳实践

1. ✅ 使用 Docker Compose 管理构建环境
2. ✅ 挂载 Gradle 缓存加速后续构建
3. ✅ 在 CI/CD 中集成自动化构建
4. ✅ 妥善保管签名密钥
5. ✅ 定期更新基础镜像和 SDK 版本

---

祝您打包顺利！🎉
