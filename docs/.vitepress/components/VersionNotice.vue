<script setup lang="ts">
// 部署后会多一个 /book/version.json（deploy.yml 在上传前写入）。
// 流程：
// 1) 页面挂载后 fetch 这个文件 → 拿到服务器当前版本（ISO 时间戳）。
// 2) 和 localStorage 里的 lastSeenVersion 比较：
//    - 一致 → 静默，不打扰
//    - 不一致 → 弹窗提示"发现新版本，点击刷新"
// 3) 用户点刷新 → location.reload()，并把 lastSeenVersion 同步到当前版本。
//
// 注意：
// - 不能用缓存的版本（HEAD/If-Modified-Since），CDN/浏览器会返回 304，
//   fetch 拿不到 body 就读不到 version。这里用 cache: 'no-store' 强制
//   直连源站。GitHub Pages 默认缓存弱，开发体验稳定。
// - SSR 期间 window 不可用，onMounted 里执行 fetch。
// - 首次访问没有 lastSeenVersion → 视为当前版本，直接写入并跳过弹窗，
//   避免每个新访客都被弹窗打扰。

import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'book:lastSeenVersion'
const VERSION_URL = `${import.meta.env.BASE}version.json`

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
    // 网络/解析失败就不弹，别让小功能挂掉整页。
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
  // 强制从服务器重拉，跳过浏览器缓存。
  location.reload()
}

function dismiss() {
  // 用户主动忽略：把当前版本记为已见，下次再变才弹。
  if (serverVersion.value) {
    localStorage.setItem(STORAGE_KEY, serverVersion.value)
  }
  visible.value = false
}

onMounted(checkVersion)
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

<style scoped>
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

.version-card {
  width: 100%;
  max-width: 360px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.version-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
}

.version-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
}

.version-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.btn-secondary {
  background: transparent;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-divider);
}

.btn-secondary:hover {
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
