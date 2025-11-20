# vue-element-admin

社团管理系统前端（基于 `vue-element-admin`）

## 项目概览

**本仓库是"社团管理系统"的一部分**，与以下两个项目共同组成一个完整的端到端解决方案：

| 项目 | 说明 | 链接 |
|------|------|------|
| **vue-element-admin** | 前端 Vue 2 + Element UI | [GitHub](https://github.com/Ruvikm/vue-element-admin) |
| **club_web** | （补充/主体前端） | [GitHub](https://github.com/Ruvikm/club_web) |
| **cms-base-parent** | 后端 Java / Maven 项目 | [GitHub](https://github.com/Ruvikm/cms-base-parent) |

三个项目建议同时参考或联动开发，前端与后端接口需保持同步对接。

**简介**

这是一个基于 Vue 2 + Element UI 的后台管理模板的前端实现，已根据项目需求定制为社团管理系统前端界面。原项目为 `PanJiaChen/vue-element-admin`，本仓库在其基础上做了功能与界面定制，用于快速搭建社团管理相关的管理后台（用户、活动、财务、会议、权限等模块）。

**主要特点**
- 基于 Vue 2.x、Vuex、Vue Router 的 SPA
- 使用 Element UI 组件库，界面一致性高，易定制
- 常用后台管理功能模块（活动、收入、支出、会议、权限、用户等）
- 开发便捷：内置热重载、ESLint 校验、单元测试 Runner
- 支持生产与 staging 构建，以及本地预览

**仓库结构（部分）**
- `src/`：源码目录
	- `api/`：后端接口封装
	- `views/`：页面视图
	- `components/`：可复用组件
	- `router/`：路由配置
	- `store/`：Vuex 状态管理
- `public/`：静态资源
- `build/`：构建脚本

**快速开始（Windows / PowerShell）**

先确保安装 Node.js（仓库 `package.json` 要求 `node >= 8.9`）和 npm。建议使用 Node 10+ 或更高版本以获得更好兼容性。

安装依赖：

```powershell
npm install
```

本地开发（热重载）:

```powershell
npm run dev
```

代码校验：

```powershell
npm run lint
```

运行单元测试（本地）：

```powershell
npm run test:unit
```

打包（生产）：

```powershell
npm run build:prod
```

打包（staging 环境）：

```powershell
npm run build:stage
```

本地预览构建产物：

```powershell
npm run preview
```

其他有用脚本：

- `npm run new`：使用 `plop` 脚手架生成新的页面 / 组件模版
- `npm run svgo`：优化 `src/icons/svg` 下的 SVG

**环境与依赖（摘要）**
- Vue 2.x, Vuex, Vue Router
- Element UI
- Axios 用于网络请求
- 开发工具链基于 `@vue/cli-service`

完整依赖与脚本请参见 `package.json`。

**定制说明（此仓库）**

该仓库在 `vue-element-admin` 的基础上做了以下定制（示例）：
- 调整和新增了与社团业务相关的页面和 API（位于 `src/views/*` 与 `src/api/*`）
- 新增财务（`income`/`expense`）、活动（`activity`）和会议模块
- 根据后端接口适配权限与路由（`permission`、`router/modules`）

如果你是第一次使用此模板进行二次开发，建议：
1. 阅读 `src/router` 和 `src/store` 理解路由与权限实现
2. 查看 `src/api` 下的接口封装，按需修改 base URL 与请求拦截器（`src/utils/request.js`）
3. 逐步替换或扩展 `views` 中的页面

**开发建议**
- 在开发新页面时，使用 `plop` 生成模版能保持风格一致：`npm run new`
- 提交代码前会触发 `husky` + `lint-staged` 做 ESLint 自动修复与检查，请确保代码风格通过校验

**完整项目架构**

```
┌─────────────────────────────────────────────────────────────┐
│                   社团管理系统（整体）                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  【前端】                                                      │
│  ├─ vue-element-admin（本仓库）                              │
│  │  ├─ Vue 2.x + Element UI 为主要框架                      │
│  │  ├─ 社团管理后台页面（活动、财务、会议等）              │
│  │  └─ 页面路由、权限控制、API 集成                         │
│  │                                                            │
│  ├─ club_web（辅助前端仓库）                                 │
│  │  └─ （详情见对应仓库）                                   │
│  │                                                            │
│  【后端】                                                      │
│  ├─ cms-base-parent（Java / Maven 后端）                    │
│  │  ├─ RESTful API 服务                                     │
│  │  ├─ 数据库操作、业务逻辑                                 │
│  │  └─ 用户、权限、数据管理                                 │
│  │                                                            │
└─────────────────────────────────────────────────────────────┘
```

**开发团队建议**

- **前端开发**：使用本仓库（`vue-element-admin`）或 `club_web`
- **后端开发**：使用 `cms-base-parent` 仓库
- **API 对接**：查看 `src/api/*` 下的接口定义，确保前后端端口、请求路径、字段名一致
- **本地开发环境**：建议三个项目同时在本地启动，便于联调

**部署**

前端部署：
- 生产构建：`npm run build:prod`，生成的静态文件位于 `dist/`
- 将 `dist/` 部署到任意静态服务器（Nginx、Apache 或 CDN）
- 若 API 与前端同域，需配置反向代理；若跨域，后端需配置 CORS 头

后端部署：
- 参考 `cms-base-parent` 仓库的部署说明
- 确保前端的 API 请求地址（通常在 `src/utils/request.js` 中配置）指向正确的后端服务地址

**参与贡献**

欢迎贡献。常见流程：
1. Fork 本仓库并新建分支
2. 提交代码并确保通过 ESLint 与测试
3. 发起 PR，描述变更与理由

项目使用 `MIT` 许可证（详见 `package.json` 中 `license` 字段）。

**致谢**

该项目基于 `PanJiaChen/vue-element-admin`，在此感谢原作者及社区贡献者的工作。

---
