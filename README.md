<div align="center">
  <h1>Vben Nest</h1>
</div>

## 简介

基于 [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin.git) 的二次开发项目，使用 [Nest](https://nestjs.com/) 框架构建后端服务，适配 vben 原有的 mock 接口调用。

## 改动范围说明

- 新增 Nest 服务：apps/server, 服务按 apps/backend-mock 的接口规范适配
- 启动 playground 查看效果：pnpm dev:play
- apps 下其他 web- 前缀前端页面未改动，可正常打开，仍调用 apps/backend-mock 的 mock 服务

## 后端（apps/server）

### 技术栈

- 框架：NestJS（REST API）
- 校验与转换：class-validator / class-transformer
- 鉴权：全局 AuthGuard + @Public；JWT（access/refresh）
- 数据层：PostgreSQL + Prisma（支持 migrate + seed 初始化）

### 公共设计（src/common）

- decorators：Public、RawResponse（控制鉴权/是否包装响应）
- guards：AuthGuard（Bearer access token 校验）
- interceptors：ResponseInterceptor（统一响应包装）
- filters：HttpExceptionFilter（统一异常输出）
- dto：ApiResponse、PaginatedResponse（响应结构）
- utils：jwt、response、mock-data（token/响应/模拟数据）

### 模块

- auth：登录、刷新、登出、权限码 codes
- user：用户信息
- system：部门（dept）、菜单（menu）、角色（role）
- table / timezone / upload / demo：示例接口

## 安装与运行

### 环境要求

- Node.js >= 20.19
- pnpm >= 10（推荐使用 corepack）
- Docker Desktop（推荐，用于一键启动 PostgreSQL；不使用 Docker 也可自行安装 PostgreSQL）

### 1）获取代码

```bash
git clone https://github.com/MiniJude/vben-nest.git
```

### 2）安装依赖

```bash
cd vben-nest
npm i -g corepack
pnpm install
```

### 3）启动数据库与初始化数据（推荐：Docker Compose）

```bash
docker compose -f apps/server/docker-compose.yml up -d

# 初始化数据库结构与种子数据（会写入默认用户/角色/菜单/部门等）
pnpm -F @vben/server run db:init
```

默认数据库连接串位于 [apps/server/.env.development](./apps/server/.env.development)（Nest 运行时）与 [apps/server/prisma/.env](./apps/server/prisma/.env)（Prisma CLI）。

如果你不使用 Docker，请自行准备一个 PostgreSQL 实例，并把 `DATABASE_URL` 改成你的连接信息后再执行 `db:init`。

### 4）启动后端（Nest API）

```bash
pnpm -F @vben/server run dev
# 默认端口：3000（可在 apps/server/.env.development 中修改 PORT）
```

### 5）启动前端（Playground）

```bash
pnpm dev:play
```

### 6）打包构建

```bash
pnpm build
```

### 默认账号

- vben / 123456
- admin / 123456
- jack / 123456

### 常见问题

- Prisma 相关命令报错或找不到引擎：先在仓库根目录重新执行 `pnpm install` 再重试（本项目已为 Prisma 配置了构建许可白名单）。
- 端口占用：修改 `apps/server/.env.development` 的 `PORT` 后重启后端。

## License

[MIT © Vben-2020](./LICENSE)
