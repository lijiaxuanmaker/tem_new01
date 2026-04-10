# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装 pnpm 和 nest cli
RUN npm install -g pnpm @nestjs/cli

# 复制配置文件
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.build.json ./
COPY nest-cli.json ./
COPY src ./src

# 安装依赖
RUN pnpm install

# 构建（使用 nest build）
RUN pnpm build

# 验证 dist 是否存在
RUN ls -la dist/ || echo "dist not found"

EXPOSE 3000

CMD ["node", "dist/main.js"]
