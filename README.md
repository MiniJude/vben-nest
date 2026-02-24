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
- 数据层：当前以内存/Mock 实现；规划 PostgreSQL + Prisma

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

1. 获取代码

```bash
git clone https://github.com/MiniJude/vben-nest.git
```

2. 安装依赖

```bash
cd vben-nest
npm i -g corepack
pnpm install
```

3. 本地开发

启动接口服务：
```bash
  pnpm dev:server
  # 接口服务默认端口 3000
```

启动前端服务：
```bash
pnpm dev:play
```

1. 打包构建

```bash
pnpm build
```

## License

[MIT © Vben-2020](./LICENSE)
