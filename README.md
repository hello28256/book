# 我的书

> 用 [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) 构建的一本书。

线上预览：https://hello28256.github.io/book/

## 本地开发

```bash
# 1. 安装依赖（推荐用 uv，比 pip 快）
uv tool install mkdocs --with-requirements requirements.txt
# 或者 pip install -r requirements.txt

# 2. 启动本地预览（带热重载）
mkdocs serve
# 打开 http://127.0.0.1:8000

# 3. 构建静态文件
mkdocs build --strict
```

## 目录结构

```
book/
├── mkdocs.yml              # 站点配置
├── requirements.txt        # Python 依赖
├── docs/                   # 所有 Markdown 章节
│   ├── index.md            # 首页
│   ├── about.md            # 关于
│   ├── part-1/             # 第一部分
│   │   ├── chapter-01.md
│   │   └── chapter-02.md
│   └── part-2/             # 第二部分
│       └── chapter-03.md
└── .github/workflows/
    └── deploy.yml          # GitHub Actions 自动部署
```

## 部署

推送到 `main` 分支会自动触发 GitHub Actions 构建并部署到 GitHub Pages（子路径 `/book/`）。

仓库 **Settings → Pages → Source** 需要选 **GitHub Actions**。

## 写新章节

1. 在 `docs/` 下新建 Markdown 文件
2. 在 `mkdocs.yml` 的 `nav:` 里加入索引
3. `mkdocs serve` 本地预览
4. git push 自动发布

## 许可

- 正文：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码：MIT
