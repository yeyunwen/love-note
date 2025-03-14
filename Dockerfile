# 构建阶段
FROM node:20-alpine as builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm (使用 npm 安装而不是 corepack)
RUN npm install -g pnpm

# 复制所有源代码和配置文件
COPY . .

# 安装依赖，跳过 husky 安装
RUN HUSKY=0 pnpm install

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建产物到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
