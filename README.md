# Cloady 保活服务

这是一个部署在 Cloady.com 上的简单保活应用，用于：
1. **保持账号活跃** - 防止因不活跃被回收
2. **占住免费资源** - 确保免费额度始终可用
3. **预留扩展空间** - 未来可以扩展为完整的云端控制服务

## 功能

- ✅ 极简 Node.js + Express 应用
- ✅ 资源占用极低（约 50MB RAM）
- ✅ 提供健康检查端点
- ✅ 自动心跳日志（每5分钟）
- ✅ 可通过 Docker 部署

## API 端点

### `GET /`
返回详细的服务状态信息，包括运行时间、请求计数等。

**响应示例：**
```json
{
  "status": "alive",
  "message": "保活服务运行中 - Cloady Keep-Alive Service",
  "uptime": "3天 12时 45分 23秒",
  "uptimeSeconds": 305123,
  "startTime": "2026-11-01T08:30:00.000Z",
  "currentTime": "2026-11-04T21:15:23.000Z",
  "requestCount": 1523,
  "lastRequestTime": "2026-11-04T21:15:23.000Z",
  "purpose": "此服务用于保持 Cloady 免费账号活跃，未来将扩展为 Android 家长控制应用的云端控制服务"
}
```

### `GET /ping`
最简单的保活检查，返回 `pong`。

### `GET /health`
标准健康检查端点。

**响应示例：**
```json
{
  "status": "healthy",
  "uptime": 305123
}
```

## 部署到 Cloady

### 方法一：通过 Cloady Web 控制台

1. 登录 https://cloady.com/
2. 进入你的 Workspace
3. 点击 "New App" 或 "Deploy"
4. 选择部署方式：
   - **From Docker Image**: 先在本地构建镜像并推送到 Docker Hub
   - **From GitHub**: 将此文件夹推送到 GitHub 仓库
   - **Upload Folder**: 直接上传此文件夹

5. 配置资源（使用最小配置即可）：
   - CPU: 0.1 vCPU (最低)
   - RAM: 128 MB (最低)
   - SSD: 512 MB (最低)

6. 部署完成后，Cloady 会提供一个公开 URL（例如：`https://your-app.cloady.app`）

### 方法二：使用 Docker 本地构建后部署

```bash
# 构建镜像
docker build -t cloady-keepalive .

# 测试本地运行
docker run -p 3000:3000 cloady-keepalive

# 访问 http://localhost:3000 测试

# 推送到 Docker Hub（如果使用 Docker Image 方式部署）
docker tag cloady-keepalive your-dockerhub-username/cloady-keepalive
docker push your-dockerhub-username/cloady-keepalive
```

### 方法三：从 GitHub 部署（推荐）

1. 创建一个新的 GitHub 仓库（可以是私有仓库）
2. 将此文件夹内容推送到仓库：
   ```bash
   cd cloady-keepalive
   git init
   git add .
   git commit -m "Initial commit: Cloady keep-alive service"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```
3. 在 Cloady 控制台选择 "Deploy from GitHub"
4. 连接你的 GitHub 账号并选择仓库
5. Cloady 会自动检测 Dockerfile 并部署

## 配置外部保活（可选）

虽然应用内部有自我心跳，但你也可以设置外部保活服务（双重保险）：

### 使用 UptimeRobot（免费）
1. 注册 https://uptimerobot.com/
2. 添加新监控：
   - Monitor Type: HTTP(s)
   - URL: 你的 Cloady 应用 URL（例如 `https://your-app.cloady.app/ping`）
   - Monitoring Interval: 5 minutes
3. UptimeRobot 会每5分钟访问一次你的应用

### 使用 GitHub Actions
在你的任意 GitHub 仓库创建 `.github/workflows/ping-cloady.yml`:
```yaml
name: Ping Cloady Keep-Alive

on:
  schedule:
    - cron: '*/30 * * * *'  # 每30分钟
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Cloady App
        run: |
          curl -f https://your-app.cloady.app/ping || exit 0
```

## 本地测试

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 在浏览器访问 http://localhost:3000
```

## 资源使用

- **内存**: 约 50-80 MB
- **CPU**: 几乎为 0（空闲时）
- **存储**: 约 50 MB（包括 Node.js 运行时和依赖）
- **网络**: 极少（仅响应健康检查请求）

完全在 Cloady 免费套餐范围内：
- ✅ 0.5 vCPU（我们只用 0.1）
- ✅ 1 GB RAM（我们只用 80 MB）
- ✅ 5 GB SSD（我们只用 50 MB）
- ✅ 200 GB 流量/月（我们几乎不用）

## 未来扩展

这个简单的保活服务可以轻松扩展为完整的云端控制服务：

1. **添加数据库**: 在 Cloady 同一 Workspace 添加 PostgreSQL
2. **实现控制参数 API**: 添加 `/api/control` 端点
3. **实现 WebSocket**: 添加实时推送功能
4. **添加认证**: 实现设备认证机制
5. **位置跟踪**: 添加位置数据上传和查询
6. **数据日志**: 记录所有控制操作和状态变化

所有这些都可以在不中断保活服务的情况下逐步添加。

## 监控

访问应用主页 (`/`) 可以看到：
- 运行时间
- 处理的总请求数
- 最后一次请求时间
- 当前状态

这些信息可以帮助你确认服务一直在运行。

## 故障排除

### 应用无法访问
1. 检查 Cloady 控制台的部署日志
2. 确认应用状态为 "Running"
3. 检查是否有资源限制错误

### 应用被暂停
1. 检查是否超过免费额度
2. 检查 Cloady 邮件通知
3. 重新部署应用

## 注意事项

- 这个保活服务非常轻量，不会占用太多资源
- 即使不活跃，由于持续运行，Cloady 也会认为账号是活跃的
- 未来扩展时注意监控资源使用，避免超出免费额度
- 建议定期（每周）检查一次应用状态

## 支持

如有问题，请参考：
- Cloady 文档: https://cloady.com/docs
- Cloady 支持: 通过控制台联系客服
