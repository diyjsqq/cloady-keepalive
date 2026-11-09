const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 记录启动时间和请求计数
const startTime = new Date();
let requestCount = 0;
let lastRequestTime = new Date();

// 健康检查端点 - Cloady 会定期访问此端点检测服务是否活跃
app.get('/', (req, res) => {
  requestCount++;
  lastRequestTime = new Date();
  
  const uptime = Math.floor((Date.now() - startTime.getTime()) / 1000);
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  
  res.json({
    status: 'alive',
    message: '保活服务运行中 - Cloady Keep-Alive Service',
    uptime: `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`,
    uptimeSeconds: uptime,
    startTime: startTime.toISOString(),
    currentTime: new Date().toISOString(),
    requestCount: requestCount,
    lastRequestTime: lastRequestTime.toISOString(),
    purpose: '此服务用于保持 Cloady 免费账号活跃，未来将扩展为 Android 家长控制应用的云端控制服务'
  });
});

// Ping 端点 - 最简单的保活检查
app.get('/ping', (req, res) => {
  requestCount++;
  lastRequestTime = new Date();
  res.send('pong');
});

// 健康检查端点（标准名称）
app.get('/health', (req, res) => {
  requestCount++;
  lastRequestTime = new Date();
  res.json({ 
    status: 'healthy',
    uptime: Math.floor((Date.now() - startTime.getTime()) / 1000)
  });
});

// 自我保活 - 每5分钟自己访问自己一次（防止长时间无外部请求）
setInterval(() => {
  const now = new Date();
  console.log(`[${now.toISOString()}] 自我保活心跳 - 已运行 ${Math.floor((now - startTime) / 1000)} 秒, 处理请求 ${requestCount} 次`);
}, 5 * 60 * 1000); // 每5分钟

// 启动服务器
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Cloady 保活服务已启动`);
  console.log(`端口: ${PORT}`);
  console.log(`启动时间: ${startTime.toISOString()}`);
  console.log(`访问 / 查看详细状态`);
  console.log(`访问 /ping 进行快速检查`);
  console.log(`访问 /health 查看健康状态`);
  console.log(`=================================================`);
});

// 优雅退出
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});
