<script setup lang="ts">
// 每次 docs:build 之前，scripts/gen-commits.mjs 会跑 git log
// 把最近 10 条提交写成这个 JSON。
import commits from '../data/commits.json'

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
      <li v-for="c in commits" :key="c.sha">
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

@media (max-width: 640px) {
  .commit-list li {
    flex-wrap: wrap;
  }
  .commit-list .sha {
    margin-left: 116px;
  }
}
</style>
