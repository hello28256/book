# Docker 极简手册

> 写给后端工程师的容器实战 —— 从一条命令到生产部署。

## 这本书是什么

如果你已经写了几年代码，知道"环境不一致"和"部署痛苦"是什么感觉，那这本书就是为你写的。

我不打算从"什么是容器化"讲到天荒地老。**这本书的承诺**：

- 📖 **5 章**，每章 1500-3000 字
- ⏱ **3 小时**读完，1 个周末上手
- 🛠 **每章都有可直接 copy 的代码**，不写一行废话
- 🎯 **目标**：读完你能独立把一个真实后端服务装进容器并跑在生产

## 你会学到什么

1. [第 1 章 为什么需要 Docker](part-1/chapter-01.md) —— 容器解决了什么、又没解决什么
2. [第 2 章 五分钟跑起第一个容器](part-1/chapter-02.md) —— 安装、镜像、容器、Volume 一次跑通
3. [第 3 章 Compose 编排多服务](part-2/chapter-03.md) —— 多容器协作，docker-compose.yml 从入门到生产
4. [第 4 章 上生产前你必须知道的事](part-2/chapter-04.md) —— 日志、健康检查、滚动更新、7 个真实坑

- [关于本书](about.md) —— 写作理念、版本日志、致谢

## 适合谁读

| 你是 | 这本书 |
|------|--------|
| ✅ 写过几年代码的后端工程师 | 完美匹配 |
| ✅ 部署过应用但只是 `pm2 start` 级别 | 完美匹配 |
| ✅ 听过 Docker 但没系统学过 | 完美匹配 |
| ⚠️ 完全没碰过 Linux 命令行 | 建议先补 Bash 基础 |
| ❌ 已经在生产用了几年 K8s | 你不是目标读者 |

## 用什么环境跟着学

!!! tip "推荐"
    - **macOS** 或 **Linux** 桌面（Windows 也行，用 WSL2）
    - 装一个 [Docker Desktop](https://www.docker.com/products/docker-desktop/) 或 [OrbStack](https://orbstack.dev/)（macOS 上 OrbStack 更快）
    - 一个能用的终端（iTerm2、Warp 都行）

!!! warning "国内网络注意"
    Docker 镜像默认从 Docker Hub 拉，国内可能慢或失败。
    第 2 章会教你配镜像加速器。

## 开始阅读

[👉 从第 1 章开始](part-1/chapter-01.md){ .md-button .md-button--primary }
&nbsp;&nbsp;
[🤔 跳到生产实战](part-2/chapter-04.md){ .md-button }
