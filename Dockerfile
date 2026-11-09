# 使用 Node.js 官方轻量级镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package.json .

# 安装依赖（只安装生产依赖以减少镜像大小）
RUN npm install --production

# 复制应用代码
COPY server.js .

# 暴露端口（Cloady 会自动映射）
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
