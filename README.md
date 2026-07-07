# 阅读

我的阅读记录。

[![Online](https://img.shields.io/badge/📖_在线阅读-hello28256.github.io%2Fbook-00c853)](https://hello28256.github.io/book/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/正文-CC%20BY--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/代码-MIT-blue)](https://opensource.org/licenses/MIT)
[![Built with VitePress](https://img.shields.io/badge/Built_with-VitePress-00c853)](https://vitepress.dev/)

线上阅读：<https://hello28256.github.io/book/>

## 关于

读过的书，抄过的句子，想过的想法。所有笔记直接放在 `docs/` 根，未来笔记多到几十、上百篇时，再拆成 `book2/` `book3/` 子目录。

## 本地预览

需要 [Node.js 22+](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)（仓库锁定 `pnpm@9.15.0`，由 `package.json` 的 `packageManager` 字段声明，corepack 会自动下载）：

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
├── package.json                        # pnpm 依赖 + scripts + packageManager
├── pnpm-lock.yaml                      # 锁版本
├── .markdownlint.json                  # markdownlint 配置
├── scripts/
│   └── gen-commits.mjs                 # build 前跑, git log → commits.json
├── docs/                               # VitePress srcDir
│   ├── .vitepress/
│   │   ├── config.ts                   # 站点配置，rootSidebar() 平铺扫描 docs/*.md
│   │   ├── components/
│   │   │   ├── RecentCommits.vue       # 页面底部的提交列表组件
│   │   │   └── VersionNotice.vue       # 检测新版本并提示刷新
│   │   ├── data/
│   │   │   └── commits.json            # gen-commits 生成的 (gitignore)
│   │   └── theme/
│   │       ├── index.ts                # 主题入口 + page-bottom 插槽
│   │       └── custom.css              # 自定义样式 (品牌色/加粗绿/图片居中)
│   ├── index.md                        # 阅读首页 (home layout)
│   ├── NNN标题.md                       # 41 篇笔记，平铺在根
│   ├── public/                         # VitePress 静态资源 (favicon 等)
│   └── 1001Reading/                    # 老路径重定向层（meta refresh）
│       └── NNN标题.md                   # 38 个 redirect 页面，老 URL 跳转
└── .github/workflows/
    └── deploy.yml                      # GitHub Actions 自动部署
```

## URL 结构

所有笔记 URL 直接是 `/book/NNN标题`，不再带 `1001Reading/` 前缀。

老链接 `/book/1001Reading/NNN标题` 仍能访问 —— `docs/1001Reading/` 下放了一份
对老 URL 的 redirect 页，浏览器通过 `<meta http-equiv="refresh">` 立即跳到新路径。

## 新增一篇笔记

1. 在 `docs/` 根创建 `NNN标题.md`（3 位编号 + 标题，例如 `039新笔记.md`）
2. 第一行写 `# 标题` —— 侧栏会从这里取显示名
3. 侧栏按文件名字典序自动排序，所以新笔记的编号决定它在侧栏的位置
4. `pnpm docs:dev` 本地预览
5. git push 自动发布

> 如果以后笔记多到几十、上百篇，按主题拆 `docs/Reading2/` `docs/Reading3/` 子目录，再把 `rootSidebar` 改回多书扫描即可。

## 主题定制

`docs/.vitepress/theme/custom.css` 集中管理 4 类视觉定制：

- **品牌色**：亮色 `#00c853` / 暗色 `#00e676`（覆盖 `--vp-c-brand-*`）
- **加粗变绿**：`.vp-doc strong` 亮色 `#00c853` / 暗色 `#00e676`，作用域仅限文章正文，不影响侧栏/导航里的 `<strong>`
- **导航染色**：`.VPNavBar .VPNavBarTitle .title` 和 `.VPNavBar .VPNavBarMenuLink` 用品牌绿
- **图片居中**：`.vp-doc p > img` 应用 `display:block + margin:0 auto + max-width:100%`，覆盖 Markdown `![](url)` 和 HTML `<img>` 两种写法

主题入口在 `theme/index.ts`：继承 DefaultTheme，在 `page-bottom` 插槽挂载 `RecentCommits` 和 `VersionNotice`。

## RecentCommits 组件

每个页面底部会自动出现「📝 最近更新」区块，列最近 50 条 git 提交（每页 10 条，共 5 页）。

- 数据源：`scripts/gen-commits.mjs` 在 `docs:build` 之前跑 `git log`，把结果写到 `docs/.vitepress/data/commits.json`
- 浅克隆 / git 不可用时，脚本会写空数组而不是让 build 崩
- 组件 `RecentCommits.vue` 负责渲染 + 分页 + 跳转 GitHub commit URL
- 想调整条数：改 `gen-commits.mjs` 的 `LIMIT` 和组件的 `PAGE_SIZE`

## 缓存绕开

GitHub Pages 默认 `cache-control: max-age=600`，CDN（Fastly）也缓存。
部署完成后用户浏览器本地可能停留老 HTML 长达 10 分钟。

解法：HTML `<head>` 注入一段 inline script，每次访问：

1. `fetch /book/version.json?_=${Date.now()}` —— 随机 query 让 CDN key 唯一；
   `cache: no-store` 不让浏览器 disk/memory 缓存
2. 取 URL 上的 `?v=` 参数，与 version.json 的 `.version` 字段比对
3. 不一致则 `location.replace` 到新 `?v=<新时间戳>` URL —— 新 URL 不在 CDN
   旧缓存里，浏览器拉到新 HTML

URL 的 `?v=` 是真相源，不依赖 localStorage（隐身/清缓存都一致工作）。

`deploy.yml` 已经在 build 结束时写 `docs/.vitepress/dist/version.json`，
所以**不需要再改 deploy.yml**。如果想完全关掉这个行为，从 `config.ts`
删掉 `head` 里的 `script` 项即可。

## 写文章风格指南

- **文件名**：`NNN标题.md`（3 位编号 + 中文标题），不带 hash 后缀、不带空格隔开编号（参考 `001金句.md`、`005家庭教育.md`）
- **加粗规范**：闭合 `**` 后紧跟中文时补 1 个半角空格；标点（，。：；！？）移入加粗范围。例：
  - ✅ `**健康管理是底线。** 不黄赌毒、不熬夜。`
  - ❌ `**健康管理是底线，**不黄赌毒、不熬夜。`
- **图片**：用 `![alt](url)` 标准 Markdown 语法即可，全局 CSS 已自动居中

## 部署

推送到 `main` 分支自动触发 GitHub Actions（`.github/workflows/deploy.yml`）：

1. `actions/checkout@v5` 拉代码（`fetch-depth: 0`，完整历史）
2. `pnpm/action-setup@v6` 装 pnpm（自动读 `packageManager` 字段）
3. `actions/setup-node@v5` 装 Node 22 + `cache: pnpm` 缓存 store
4. `pnpm install --frozen-lockfile` 装依赖
5. `pnpm run docs:build` 生成 `docs/.vitepress/dist/`（内部先跑 `gen-commits`）
6. `actions/upload-pages-artifact@v3` 上传 → `actions/deploy-pages@v4` 部署

仓库 **Settings → Pages → Source** 需要选 **GitHub Actions**。

## 许可

- 正文：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码：MIT
