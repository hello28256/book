# 书架

我的阅读记录。

[![Online](https://img.shields.io/badge/📖_在线阅读-hello28256.github.io%2Fbook-00c853)](https://hello28256.github.io/book/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/正文-CC%20BY--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/代码-MIT-blue)](https://opensource.org/licenses/MIT)
[![Built with VitePress](https://img.shields.io/badge/Built_with-VitePress-00c853)](https://vitepress.dev/)

线上阅读：<https://hello28256.github.io/book/>

## 关于

读过的书，抄过的句子，想过的想法。每本书是一个独立子目录，新增 `docs/<book>/` 即可在导航/侧栏出现，无需改配置。

## 本地预览

需要 [Node.js 18+](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)：

```bash
# 1. 装依赖
pnpm install

# 2. 启动开发服务器（带热重载）
pnpm docs:dev
# → http://localhost:5173/book/

# 3. 构建静态文件（与 CI 行为一致）
pnpm docs:build
# 产物在 docs/.vitepress/dist/

# 4. 预览构建产物
pnpm docs:preview
```

## 目录结构

```text
book/
├── package.json                # pnpm 依赖 + scripts
├── pnpm-lock.yaml              # 锁版本
├── docs/                       # VitePress srcDir
│   ├── .vitepress/
│   │   └── config.ts           # 站点配置，自动扫描 docs/ 子目录作为一本书
│   ├── index.md                # 书架首页
│   └── 1001Reading/            # 当前唯一的书
│       ├── index.md            # 书首页
│       └── 001-015.md          # 15 篇笔记（中文文件名）
├── .markdownlint.json          # markdownlint 配置
└── .github/workflows/
    └── deploy.yml              # GitHub Actions 自动部署
```

## 新增一本书

`docs/.vitepress/config.ts` 的 `discoverBooks()` 会自动扫描
`docs/` 下所有子目录作为一本书，侧栏按文件名排序，从 H1 提取章节标题。

1. 在 `docs/` 下新建子目录，例如 `docs/MyBook/`
2. 写 `docs/MyBook/index.md`，带 `title:` frontmatter（书首页标题）
3. 把章节 `.md` 放进 `docs/MyBook/`，每篇用一个 H1 作为标题
4. `pnpm docs:dev` 本地预览
5. git push 自动发布

## 部署

推送到 `main` 分支自动触发 GitHub Actions：

1. checkout → Node 22 → corepack pnpm → `pnpm install`
2. `pnpm run docs:build` 生成 `docs/.vitepress/dist/`
3. 上传 dist 到 Pages artifact → 部署

仓库 **Settings → Pages → Source** 需要选 **GitHub Actions**。

## 许可

- 正文：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码：MIT
