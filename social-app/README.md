# 影视 - 视频播放平台

一个移动端视频播放应用，采用React + TypeScript构建，支持Web和APK构建。

## 功能特点

- 🎬 **首页** - 视频推荐、分类浏览、轮播图、搜索功能
- 🌐 **暗网** - 私密内容专区  
- 📺 **直播** - 直播房间列表
- 🎮 **游戏** - 游戏中心
- 👤 **我的** - 个人中心

## API集成

应用通过REST API与后端服务器通信。API服务模块位于 `src/services/api.ts`。

### API端点

- `GET /api/videos` - 获取视频列表（支持分页）
- `GET /api/videos/<id>` - 获取单个视频详情
- `GET /api/videos/search` - 搜索视频
- `GET /api/videos/category` - 按分类获取视频
- `GET /api/videos/top` - 获取热门视频
- `POST /api/videos/<id>/play` - 增加播放次数
- `GET /api/categories` - 获取所有分类
- `GET /api/statistics` - 获取统计信息

### 配置API地址 (推荐方式: .eov文件)

应用使用项目根目录的 `.eov` 文件统一管理API配置。**修改 `.eov` 文件中的 API_BASE_URL 即可更新所有API请求地址，适用于Web和APK构建。**

#### .eov 文件格式

```ini
# API服务器基础地址
API_BASE_URL=http://103.74.193.179:5000

# 可选配置
# API_VERSION=v1
# API_TIMEOUT=30000
```

#### 更新API地址步骤

1. 编辑项目根目录的 `.eov` 文件
2. 修改 `API_BASE_URL` 的值为新的API服务器地址
3. 运行 `npm run build` 或 `npm start` 应用新配置

```bash
# 示例: 更新API地址
# 编辑 ../.eov 文件，修改 API_BASE_URL=http://新地址:端口

# 构建应用
npm run build

# 或开发模式
npm start
```

#### 传统方式 (环境变量)

如果需要，也可以直接使用环境变量配置:

```bash
cp .env.example .env.local
# 编辑 .env.local 设置 REACT_APP_API_URL
```

## 界面特点

- 深色主题设计
- 5个底部导航标签
- 动态视频分类标签（从API加载）
- 每个分类展示5个视频（1大4小布局）
- 换一换和查看更多操作
- 加载状态和错误处理

## 可用脚本

### `npm start`

启动开发模式，打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

### `npm test`

运行测试。

### `npm run build`

构建生产版本到 `build` 文件夹。

## APK构建

应用使用Capacitor支持APK构建，详见 [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md)。

## 开发环境

同时运行Web应用和API服务器：

```bash
# 终端1: 启动API服务器
cd ../api
python api_server.py

# 终端2: 启动Web应用
npm start
```
