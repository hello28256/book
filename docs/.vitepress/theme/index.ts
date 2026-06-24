import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import RecentCommits from '../components/RecentCommits.vue'
import VersionNotice from '../components/VersionNotice.vue'
import './custom.css'

// 继承默认主题 + 加载自定义 CSS（覆盖品牌色为绿色）
// + 覆盖 Layout，在 page-bottom 插槽里塞 RecentCommits。
// 这样所有页面（首页、每本书的章节页）底部自动出现提交列表。
//
// VersionNotice 挂到 layout 外层；组件内部用 <Teleport to="body">
// 把弹窗搬到 body 末尾，规避 VitePress 默认布局的 z-index/overflow 限制。
//
// 写法来自 VitePress 官方文档：
// https://vitepress.dev/guide/extending-default-theme#layout-slots
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'page-bottom': () => h(RecentCommits),
      'layout-top': () => h(VersionNotice),
    })
  },
}
