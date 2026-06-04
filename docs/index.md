---
layout: home

hero:
  name: 书架
  text: 我的阅读记录
  tagline: 读过的书，抄过的句子，想过的想法。
  actions:
    - theme: brand
      text: 进入 1001Reading
      link: /1001Reading/
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/hello28256/book

features:
  - icon: 📖
    title: 1001Reading
    details: 15 篇阅读笔记。涵盖人生哲学、心理学、文学经典。
    link: /1001Reading/
    linkText: 开始阅读
---

<script setup>
import RecentCommits from './.vitepress/components/RecentCommits.vue'
</script>

<RecentCommits />
