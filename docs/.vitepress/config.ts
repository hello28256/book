import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 扫描 docs/ 根下的 .md 生成 sidebar 条目（平铺笔记）。
// 每条用 H1 作为标题，文件名作为链接。
// 注意：只扫 docs/ 根一层 —— 2026-07 重构后所有笔记直接放在 docs/ 下，
// 不再用 docs/bookN/ 子目录结构（参见 docs/1001Reading/ 重定向到根路径）。
// 重构是为了让 URL 直接是 /book/001金句 而不是 /book/1001Reading/001金句。
function rootSidebar() {
  return readdirSync('docs')
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort()
    .map((f) => {
      const name = basename(f, '.md')
      const content = readFileSync(join('docs', f), 'utf8')
      const h1 = content.match(/^#\s+(.+)$/m)
      return {
        text: h1 ? h1[1].trim() : name,
        link: `/${name}`,
      }
    })
}

// 站点基础信息
export default withMermaid(
  defineConfig({
    // 注意：不要在这里写 srcDir: 'docs'。
    // CLI 命令 `vitepress build docs` 已经把 'docs' 当作 root，
    // 再写 srcDir: 'docs' 会拼成 docs/docs，导致找不到任何 .md。
    // srcDir 留空，默认就是当前 root（= docs/）。

    // GitHub Pages 子路径，必须以 / 开头和结尾
    base: '/book/',

    // 去掉 URL 里的 .html 后缀，访问 /foo/ 而不是 /foo.html。
    // GitHub Pages 原生支持目录 + index.html 结构，无需额外配置。
    cleanUrls: true,

    // SEO
    title: '阅读',
    description: '我的阅读记录',
    lang: 'zh-CN',
    lastUpdated: true,

    // 浏览器标签 favicon + Apple 触屏图标。
    // 显式声明而不是依赖 VitePress 默认查找,
    // 因为站点部署在 /book/ 子路径,显式声明最稳。
    head: [
      // HTML 缓存控制：让浏览器和中间代理更倾向于重新验证，避免新增笔记后看不到。
      // 注意：meta http-equiv 多数现代浏览器会忽略；真正生效依赖服务器响应头。
      // 这里作为软信号，配合 GitHub Pages 默认 max-age=600，能在大多数情况下更快刷新。
      ['meta', { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' }],
      ['meta', { 'http-equiv': 'Pragma', content: 'no-cache' }],
      ['meta', { 'http-equiv': 'Expires', content: '0' }],
      ['link', { rel: 'icon', type: 'image/png', href: '/book/favicon.png' }],
      ['link', { rel: 'apple-touch-icon', href: '/book/apple-touch-icon.png' }],
      // 缓存绕开：解决"新文章上线后浏览器看不到，要手动刷新"的问题。
      // GitHub Pages 给 /book/ 设的 cache-control: max-age=600，CDN 也缓存。
      // 思路：deploy.yml 写一个 version.json（部署时间戳），HTML 里跑这段：
      //   1. fetch version.json（cache: no-cache 强制回源）
      //   2. 取 URL 上的 ?v= 参数（缺则视作空字符串）
      //   3. 比对：
      //      - URL 没 ?v    → 跳到 ?v=<remote>  强制写版本号
      //      - URL 有但旧   → 跳到 ?v=<remote>  部署后用户停留在旧 URL
      //      - URL 一致     → 不动
      // 用 URL 的 ?v 作真相源（不是 localStorage）——
      // localStorage 会被各种情况污染（手动清缓存、隐身模式、首次访问），
      // 一旦写入正确值就永远'觉得一致'，反而让用户看不到新 HTML。
      // URL 上有 ?v= 是 v1.6.4 之后的修复关键。
      //
      // v1.6.5 增强：fetch 加 ?_<随机数> 强制绕开 CDN/浏览器对 version.json 的
      // 缓存（CDN key 是完整 URL，不同 query 视为不同资源）。否则旧版 fetch
      // 返回旧 version，用户跳到旧 ?v=，老 HTML 自我循环。
      ['script', {}, `
;(function () {
  try {
    fetch('/book/version.json?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null })
      .then(function (data) {
        if (!data || !data.version) return
        var remote = String(data.version)
        var u = new URL(location.href)
        var current = u.searchParams.get('v') || ''
        if (current !== remote) {
          u.searchParams.set('v', remote)
          location.replace(u.toString())
        }
      })
      .catch(function () { /* 网络失败 / 离线下次再试 */ })
  } catch (e) { /* localStorage 被禁时静默 */ }
})();
`],
    ],

    // VitePress 主题配置
    themeConfig: {
      // 站点 logo 文字（无图就用纯文字）
      siteTitle: '阅读',

      // 顶部导航
      // 不放"阅读"项 —— 左侧 siteTitle 已经显示"阅读"，再放会重复。
      // 不放"书籍"下拉 —— 笔记已平铺到 docs/ 根，侧栏就是全集。
      nav: [
        {
          text: '首页',
          link: 'https://hello28256.github.io/',
        },
        {
          text: '在线阅读',
          items: [
            {
              text: 'GitHub 仓库',
              link: 'https://github.com/hello28256/book',
            },
            {
              text: 'GitHub Pages',
              link: 'https://hello28256.github.io/book/',
            },
          ],
        },
      ],

      // 侧栏：所有页面都显示笔记列表（平铺）。
      // 包括首页 / (即 docs/index.md)，让侧栏随时可点。
      sidebar: [
        { text: '首页', link: '/' },
        ...rootSidebar(),
      ],

      // 内置搜索（MiniSearch，支持中文）
      search: {
        provider: 'local',
        options: {
          miniSearch: {
            tokenize: (text: string) => text.split(/\s+/),
          },
        },
      },

      // 暗色模式：默认跟随系统
      appearance: 'auto',

      // 页脚
      footer: {
        message: '正文采用 CC BY-SA 4.0 协议 · 代码示例采用 MIT 协议',
        copyright: 'Copyright © 2026 hello28256',
      },

      // 右上角图标
      socialLinks: [{ icon: 'github', link: 'https://github.com/hello28256/book' }],

      // 编辑本页
      editLink: {
        pattern: 'https://github.com/hello28256/book/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页',
      },
    },

    // Markdown 配置
    markdown: {
      lineNumbers: true,
      container: {
        tipLabel: '提示',
        warningLabel: '警告',
        dangerLabel: '危险',
        infoLabel: '提示',
        detailsLabel: '详细信息',
      },
    },

    // 死链检查：忽略 localhost 链接
    ignoreDeadLinks: [
      /^https?:\/\/localhost(:\d+)?\/?/,
    ],

    // Mermaid 配置
    mermaid: {
      theme: 'default',
    },
    mermaidPlugin: {
      class: 'mermaid',
    },
  })
)
