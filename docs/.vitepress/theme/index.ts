import { h, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import RecentCommits from '../components/RecentCommits.vue'
import VersionNotice from '../components/VersionNotice.vue'
import './custom.css'

// 继承默认主题 + 加载自定义 CSS（覆盖品牌色为绿色）
// + 覆盖 Layout，在 page-bottom 插槽里塞 RecentCommits + VersionNotice
// + 在 setup() 里挂 scroll 监听，让页脚"向上滚动才显示"——
//   跟 ../Coding 同步。
//
// VersionNotice 也挂到 page-bottom 插槽（和 RecentCommits 一起）。
// 组件内部用 <Teleport to="body"> 把弹窗搬到 body 末尾，
// 规避 VitePress 默认布局的 z-index/overflow 限制。
//
// 注意：之前试过挂在 layout-top，结果 production build 把整个组件
// 当 dead code 砍了——dist 里完全没有 VersionNotice 代码。
// 原因不明（dev 模式正常），但挂回 page-bottom 就好。
//
// 写法来自 VitePress 官方文档：
// https://vitepress.dev/guide/extending-default-theme#layout-slots

// --- 页脚 fade-in：scroll 监听 ---
// 用户向下滚动任意距离才显示页脚。
// 之前用 IntersectionObserver 在视口足够大时会被立即触发（首屏就显示），
// 改用 scroll 监听更精确：只有用户主动滚动过才浮现。
//
// scroll 用 passive + rAF 节流，避免滚动卡顿。
// 路由切换时重新绑定（footer 节点会被替换）。
let rafId: number | null = null
let boundFooter: HTMLElement | null = null

function onScroll() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    if (window.scrollY > 0 && boundFooter) {
      boundFooter.classList.add('is-visible')
    }
  })
}

function bind() {
  if (boundFooter) {
    boundFooter.classList.remove('is-visible')
  }
  boundFooter = document.querySelector<HTMLElement>('footer.VPFooter')
  if (!boundFooter) return
  window.addEventListener('scroll', onScroll, { passive: true })
}

function unbind() {
  window.removeEventListener('scroll', onScroll)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  boundFooter = null
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'page-bottom': () => [
        h(RecentCommits),
        h(VersionNotice),
      ],
    })
  },
  setup() {
    const route = useRoute()
    onMounted(() => {
      bind()
      watch(
        () => route.path,
        () => nextTick(bind)
      )
    })
    onBeforeUnmount(() => {
      unbind()
    })
  },
}
