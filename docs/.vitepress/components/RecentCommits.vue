<script setup lang="ts">
// 每次 docs:build 之前，scripts/gen-commits.mjs 会跑 git log
// 把最近 50 条提交写成这个 JSON，组件做分页。
import { computed, ref } from 'vue'
import commits from '../data/commits.json'

const PAGE_SIZE = 10
const page = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(commits.length / PAGE_SIZE))
)

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return commits.slice(start, start + PAGE_SIZE)
})

const fmt = (iso: string) => {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
</script>

<template>
  <section v-if="commits.length" class="recent-commits">
    <h2>📝 最近更新</h2>
    <p class="last-update">
      最后提交：<strong>{{ fmt(commits[0].date) }}</strong> · {{ commits[0].message }}
    </p>

    <ol class="commit-list">
      <li v-for="c in paged" :key="c.sha">
        <time :datetime="c.date">{{ fmt(c.date) }}</time>
        <a
          class="msg"
          :href="`https://github.com/hello28256/book/commit/${c.sha}`"
          target="_blank"
          rel="noopener"
        >
          {{ c.message }}
        </a>
        <code class="sha">{{ c.short }}</code>
      </li>
    </ol>

    <nav v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="page === 1"
        @click="page--"
        aria-label="上一页"
      >
        ← 上一页
      </button>
      <span class="page-info">第 {{ page }} / {{ totalPages }} 页</span>
      <button
        class="page-btn"
        :disabled="page === totalPages"
        @click="page++"
        aria-label="下一页"
      >
        下一页 →
      </button>
    </nav>

    <p v-if="totalPages > 1" class="all-link">
      <a
        href="https://github.com/hello28256/book/commits/main"
        target="_blank"
        rel="noopener"
      >
        在 GitHub 上查看全部提交 →
      </a>
    </p>
  </section>
</template>

<style scoped>
.recent-commits {
  max-width: 1152px;
  margin: 64px auto 0;
  padding: 0 24px;
}

.recent-commits h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.last-update {
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.last-update strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.commit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.commit-list li {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.commit-list time {
  flex-shrink: 0;
  width: 100px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.commit-list .msg {
  flex: 1;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 14px;
  line-height: 1.5;
}

.commit-list .msg:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.commit-list .sha {
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
  padding: 2px 6px;
  border-radius: 4px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  padding: 6px 14px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  min-width: 90px;
  text-align: center;
}

.all-link {
  text-align: center;
  margin: 16px 0 0;
  font-size: 13px;
}

.all-link a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.all-link a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .commit-list li {
    flex-wrap: wrap;
  }
  .commit-list .sha {
    margin-left: 116px;
  }
  .pagination {
    flex-wrap: wrap;
  }
}
</style>
