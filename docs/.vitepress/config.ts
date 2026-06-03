import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 站点基础信息
export default withMermaid(
  defineConfig({
    // 注意：不要在这里写 srcDir: 'docs'。
    // CLI 命令 `vitepress build docs` 已经把 'docs' 当作 root，
    // 再写 srcDir: 'docs' 会拼成 docs/docs，导致找不到任何 .md。
    // srcDir 留空，默认就是当前 root（= docs/）。

    // GitHub Pages 子路径，必须以 / 开头和结尾
    base: '/book/',

    // SEO
    title: 'Docker 极简手册',
    description: '写给后端工程师的容器实战 —— 从一条命令到生产部署',
    lang: 'zh-CN',
    lastUpdated: true,

    // VitePress 主题配置
    themeConfig: {
      // 站点 logo 文字（无图就用纯文字）
      siteTitle: 'Docker 极简手册',

      // 顶部导航
      nav: [
        { text: '首页', link: '/' },
        { text: '关于', link: '/about' },
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

      // 侧栏（4 级深度，平铺不分组）
      sidebar: {
        '/': [
          { text: '第 1 章 为什么需要 Docker', link: '/part-1/chapter-01' },
          { text: '第 2 章 五分钟跑起第一个容器', link: '/part-1/chapter-02' },
          { text: '第 3 章 Compose 编排多服务', link: '/part-2/chapter-03' },
          { text: '第 4 章 上生产前你必须知道的事', link: '/part-2/chapter-04' },
          { text: '关于本书', link: '/about' },
        ],
      },

      // 内置搜索（MiniSearch，支持中文）
      search: {
        provider: 'local',
        options: {
          miniSearch: {
            // 中文分词：按字符切（VitePress 默认对 CJK 不友好，手动配置）
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

      // 右上角图标（GitHub 链接）
      socialLinks: [{ icon: 'github', link: 'https://github.com/hello28256/book' }],

      // 编辑本页（VitePress 1.x 自动从 git 推断仓库，配置后启用）
      editLink: {
        pattern: 'https://github.com/hello28256/book/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页',
      },
    },

    // Markdown 配置
    markdown: {
      // 代码块行号
      lineNumbers: true,
      // 自定义容器的中文标题
      container: {
        tipLabel: '提示',
        warningLabel: '警告',
        dangerLabel: '危险',
        infoLabel: '提示',
        detailsLabel: '详细信息',
      },
    },

    // 死链检查：忽略 localhost 链接（chapter-02 里的 docker run 演示用）
    ignoreDeadLinks: [
      /^https?:\/\/localhost(:\d+)?/,
    ],

    // Mermaid 配置（vitepress-plugin-mermaid）
    mermaid: {
      theme: 'default',
    },
    mermaidPlugin: {
      class: 'mermaid',
    },
  })
)
