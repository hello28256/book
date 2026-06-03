# 我的书

> 用 [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) 构建的一本书。

[![Online](https://img.shields.io/badge/📖_在线阅读-hello28256.github.io%2Fbook-00c853)](https://hello28256.github.io/book/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/正文-CC%20BY--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/代码-MIT-blue)](https://opensource.org/licenses/MIT)
[![Built with VitePress](https://img.shields.io/badge/Built_with-VitePress-00c853)](https://vitepress.dev/)

线上阅读：<https://hello28256.github.io/book/>

## 关于这本书

- 📖 **5 章**，每章 1500-3000 字
- ⏱ **3 小时**读完，1 个周末上手
- 🛠 **每章都有可直接 copy 的代码**
- 🎯 **目标**：读完你能独立把一个真实后端服务装进容器并跑在生产

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

```
book/
├── package.json                # pnpm 依赖 + scripts
├── pnpm-lock.yaml              # 锁版本
├── docs/                       # VitePress srcDir
│   ├── .vitepress/
│   │   ├── config.ts           # 站点配置（侧栏、导航、主题）
│   │   └── theme/
│   │       ├── index.ts        # 主题入口
│   │       └── custom.css      # 品牌色（绿 #00c853）
│   ├── index.md                # 首页
│   ├── about.md                # 关于
│   ├── part-1/
│   │   ├── chapter-01.md
│   │   └── chapter-02.md
│   └── part-2/
│       ├── chapter-03.md
│       └── chapter-04.md
└── .github/workflows/
    └── deploy.yml              # GitHub Actions 自动部署
```

## 部署

推送到 `main` 分支会自动触发 GitHub Actions：

1. checkout → Node 20 → pnpm 9 → `pnpm install`
2. `pnpm run docs:build` 生成 `docs/.vitepress/dist/`
3. 上传 dist 到 Pages artifact → 部署

仓库 **Settings → Pages → Source** 需要选 **GitHub Actions**。

## 写新章节

1. 在 `docs/` 下新建 Markdown 文件
2. 在 `docs/.vitepress/config.ts` 的 `sidebar` 里加入索引
3. `pnpm docs:dev` 本地预览
4. git push 自动发布

## 许可

- 正文：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码：MIT
