<script lang="ts">
// 改用 defineComponent + 显式 name，避免 VitePress SSR 阶段 tree-shaking
// 把整个组件当作 dead code 删掉（之前 <script setup> + Teleport + 初始
// visible=false 三者叠加触发了 rollup 的 dead-code 判定）。
//
// 关键点：
// 1. setup 内只用 ref 和函数声明，不在顶层访问 window/localStorage，
//    保证 SSR 不炸。
// 2. fetch + localStorage 操作全放在 onMounted 里（仅客户端）。
// 3. VERSION_URL 用 BASE 常量（构建期已替换为 /book/），无需运行时拼接。
import { defineComponent, onMounted, ref } from 'vue'

const STORAGE_KEY = 'book:lastSeenVersion'
// import.meta.env.BASE 在 build 阶段被 VitePress 替换为 "/book/"。
const VERSION_URL = `${import.meta.env.BASE}version.json`

export default defineComponent({
  name: 'VersionNotice',
  setup() {
    const visible = ref(false)
    const serverVersion = ref<string>('')

    async function checkVersion() {
      let next = ''
      try {
        const res = await fetch(VERSION_URL, { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { version?: string }
        next = data.version || ''
      } catch {
        return
      }
      if (!next) return

      serverVersion.value = next
      const seen = localStorage.getItem(STORAGE_KEY)

      // 首次访问：把当前版本记下来，不弹窗。
      if (!seen) {
        localStorage.setItem(STORAGE_KEY, next)
        return
      }

      // 服务器版本与上次记录的不同 → 弹窗。
      if (seen !== next) {
        visible.value = true
      }
    }

    function refresh() {
      if (serverVersion.value) {
        localStorage.setItem(STORAGE_KEY, serverVersion.value)
      }
      location.reload()
    }

    function dismiss() {
      if (serverVersion.value) {
        localStorage.setItem(STORAGE_KEY, serverVersion.value)
      }
      visible.value = false
    }

    onMounted(checkVersion)

    return { visible, refresh, dismiss }
  },
})
</script>

<template>
  <Teleport to="body">
    <transition name="version-fade">
      <div v-if="visible" class="version-notice" role="alertdialog" aria-live="polite">
        <div class="version-card">
          <div class="version-title">发现新版本</div>
          <div class="version-desc">网站已更新，点击刷新查看最新内容。</div>
          <div class="version-actions">
            <button class="btn btn-secondary" type="button" @click="dismiss">稍后</button>
            <button class="btn btn-primary" type="button" @click="refresh">刷新</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style>
/* scoped → 普通 style：Teleport 到 body 后 scoped 属性加不到 body
 * 子节点上，样式必须全局才能命中弹窗 DOM。
 * 加 .version-notice 前缀避免污染其他组件同名 class。 */
.version-notice {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 16px;
}

.version-notice .version-card {
  width: 100%;
  max-width: 360px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.version-notice .version-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
}

.version-notice .version-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
}

.version-notice .version-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.version-notice .btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.version-notice .btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.version-notice .btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.version-notice .btn-secondary {
  background: transparent;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-divider);
}

.version-notice .btn-secondary:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.version-fade-enter-active,
.version-fade-leave-active {
  transition: opacity 0.18s ease;
}
.version-fade-enter-from,
.version-fade-leave-to {
  opacity: 0;
}
</style>