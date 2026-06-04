import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import RecentCommits from '../components/RecentCommits.vue'
import './custom.css'

// 继承默认主题 + 加载自定义 CSS（覆盖品牌色为绿色）
// + 覆盖 Layout，在 page-bottom 插槽里塞 RecentCommits。
// 这样所有页面（首页、每本书的章节页）底部自动出现提交列表。
//
// 写法来自 VitePress 官方文档：
// https://vitepress.dev/guide/extending-default-theme#layout-slots
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'page-bottom': () => h(RecentCommits),
    })
  },
}
