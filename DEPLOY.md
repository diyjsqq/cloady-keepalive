# Cloady 快速部署指南

## 最简单的部署方式：从 GitHub 部署

### 1. 创建 GitHub 仓库

访问 https://github.com/new 创建一个新仓库：
- Repository name: `cloady-keepalive`（或任何名字）
- 可以选择 **Private**（私有仓库也可以部署到 Cloady）
- 不要勾选 "Initialize this repository with a README"
- 点击 "Create repository"

### 2. 推送代码到 GitHub

在 PowerShell 或命令提示符中执行：

```powershell
# 进入 cloady-keepalive 目录
cd c:\Users\Administrator\AndroidStudioProjects\homejian4\cloady-keepalive

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "Initial commit: Cloady keep-alive service"

# 添加远程仓库（替换为你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/cloady-keepalive.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 在 Cloady 部署

1. **登录 Cloady**
   - 访问 https://cloady.com/
   - 登录你的账号

2. **创建或选择 Workspace**
   - 如果还没有 Workspace，创建一个
   - Workspace 名字随意，例如 "My Apps"

3. **部署新应用**
   - 点击 "New App" 或 "Deploy" 按钮
   - 选择 **"From GitHub Repository"**

4. **连接 GitHub**
   - 如果第一次使用，会提示连接 GitHub 账号
   - 授权 Cloady 访问你的仓库（可以只授权特定仓库）

5. **选择仓库和分支**
   - Repository: 选择你刚创建的 `cloady-keepalive` 仓库
   - Branch: 选择 `main`

6. **配置应用**
   - **App Name**: `keepalive` 或任何你喜欢的名字
   - **Resource Allocation**（资源分配）:
     ```
     CPU: 0.1 vCPU (最小)
     RAM: 256 MB (最小)
     SSD: 512 MB (最小)
     ```
   - **Port**: 3000 (Cloady 会自动检测 Dockerfile 中的 EXPOSE)
   - **Environment Variables**: 留空（暂时不需要）

7. **开始部署**
   - 点击 "Deploy" 按钮
   - Cloady 会自动：
     1. 克隆你的 GitHub 仓库
     2. 检测到 Dockerfile
     3. 构建 Docker 镜像
     4. 启动容器
     5. 分配公开 URL

8. **等待部署完成**
   - 通常需要 2-5 分钟
   - 可以在部署日志中看到进度
   - 完成后状态会变成 "Running"

9. **测试应用**
   - Cloady 会提供一个公开 URL，例如：
     ```
     https://keepalive-abc123.cloady.app
     ```
   - 在浏览器打开这个 URL
   - 应该能看到类似这样的 JSON 响应：
     ```json
     {
       "status": "alive",
       "message": "保活服务运行中 - Cloady Keep-Alive Service",
       "uptime": "0天 0时 1分 23秒",
       "requestCount": 1,
       ...
     }
     ```

### 4. 验证保活成功

访问你的应用 URL，确认：
- ✅ 能正常访问
- ✅ 显示 `"status": "alive"`
- ✅ `uptime` 数字在增长（过一会儿刷新页面）
- ✅ Cloady 控制台显示应用状态为 "Running"

---

## 替代方案：直接上传文件夹

如果你不想使用 GitHub：

### 1. 打包文件夹

将这些文件打包成 ZIP：
- `server.js`
- `package.json`
- `Dockerfile`
- `.dockerignore`

**不要包含** `node_modules` 文件夹（如果存在）。

### 2. 在 Cloady 控制台

1. 选择 **"Upload Folder"** 或 **"Upload Archive"**
2. 上传 ZIP 文件
3. 配置资源（同上）
4. 点击 "Deploy"

---

## 部署后的维护

### 查看应用状态

在 Cloady 控制台可以看到：
- **Status**: Running / Stopped / Error
- **Resource Usage**: CPU、RAM、SSD 使用情况
- **Logs**: 应用日志（可以看到每5分钟的心跳日志）
- **Traffic**: 网络流量使用

### 更新应用

如果从 GitHub 部署：
1. 修改本地代码
2. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "Update: ..."
   git push
   ```
3. 在 Cloady 控制台点击 "Redeploy" 或 "Deploy Latest"

### 停止/启动应用

在 Cloady 控制台：
- 点击 "Stop" 暂停应用（会停止计费，但保留配置）
- 点击 "Start" 重新启动

**注意**: 如果要保活，就不要停止应用！

---

## 监控免费额度使用

在 Cloady Workspace 页面可以看到：

```
Current Usage (当前使用):
  CPU: 0.1 / 0.5 vCPU  ✅
  RAM: 80 MB / 1 GB    ✅
  SSD: 50 MB / 5 GB    ✅
  Traffic: 10 MB / 200 GB ✅

Status: FREE (免费)
```

只要所有指标都在免费额度内，就不会计费。

---

## 添加外部保活（双重保险）

虽然应用内部已经有心跳，但你也可以用 UptimeRobot 监控：

1. 注册 https://uptimerobot.com/ (免费)
2. 添加监控：
   - Monitor Type: HTTP(s)
   - Friendly Name: `Cloady Keep-Alive`
   - URL: `https://你的应用URL.cloady.app/ping`
   - Monitoring Interval: 5 minutes
3. 完成！UptimeRobot 会每5分钟访问一次

---

## 常见问题

### Q: 部署失败怎么办？

**A**: 检查部署日志：
- 如果是 "Port already in use": 确认 PORT 配置正确
- 如果是 "Build failed": 检查 Dockerfile 语法
- 如果是 "Out of resources": 增加资源分配

### Q: 应用能访问但显示 504 错误？

**A**: 应用可能启动慢，等待 1-2 分钟再试。

### Q: 会不会因为太简单被判定为不活跃？

**A**: 不会。只要应用在运行，Cloady 就认为是活跃的。应用内部还有每5分钟的心跳日志。

### Q: 如何确认免费额度没有超标？

**A**: 在 Workspace 页面查看 "Current Usage"，确保所有指标都在免费额度内。

### Q: 未来扩展时会影响保活吗？

**A**: 不会。你可以在现有应用基础上添加功能，只要不停止服务，保活就会持续。

### Q: 中国大陆能访问 Cloady 部署的应用吗？

**A**: 需要测试。Cloady 不像 Cloudflare Workers 那样明确被墙，但具体访问速度需要实测。

---

## 下一步

部署完成后，你可以：

1. **记录应用 URL**: 保存你的 Cloady 应用 URL
2. **设置提醒**: 每周检查一次应用状态
3. **慢慢研究**: 有了保活基础，可以慢慢研究如何扩展为完整的云控制服务
4. **测试访问**: 从中国大陆测试访问速度和稳定性

需要扩展功能时，我可以帮你添加：
- 数据库集成
- 控制参数 API
- WebSocket 实时推送
- 设备认证
- 位置跟踪
等等...

祝部署顺利！ 🚀
