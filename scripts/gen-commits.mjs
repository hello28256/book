#!/usr/bin/env node
// 把最近 N 条 git 提交写成 JSON，VitePress 构建时 import 用。
// 在 docs:build 之前跑，CI 和本地行为一致。

import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'docs/.vitepress/data/commits.json')
const LIMIT = 10

// 用 \x1f (Unit Separator) 当字段分隔符：标题里几乎不会出现的字符。
// 避免标题里的 | 或空格干扰 CSV/空格分隔。
const FORMAT = ['%H', '%h', '%aI', '%an', '%s'].join('%x1f')

try {
  const log = execSync(`git log -${LIMIT} --pretty=format:${FORMAT}`, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  })

  const commits = log
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, short, date, author, message] = line.split('\x1f')
      return { sha, short, date, author, message }
    })

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(commits, null, 2) + '\n')
  console.log(`[gen-commits] wrote ${commits.length} commits → ${OUT}`)
} catch (e) {
  // 浅克隆 / git 不可用时，输出空数组而不是让 build 崩。
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, '[]\n')
  console.warn(`[gen-commits] git log failed (${e.message}), wrote empty list`)
}
