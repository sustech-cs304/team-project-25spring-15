# 使用官方 Node 镜像
FROM node:22-alpine

RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json
COPY package.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 拷贝全部代码
COPY . .

# 构建 Next.js 前端
RUN pnpm run build

# 暴露端口（Next.js 默认 3000，WebSocket 假设为 1234，如有需要可调整）
EXPOSE 3000
EXPOSE 1234

# 启动脚本：同时启动 Next.js 前端和 WebSocket 服务
CMD ["sh", "-c", "node db/server.mjs & pnpm run start"]
