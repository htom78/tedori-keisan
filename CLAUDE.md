# CLAUDE.md

## Project Overview

手取り計算機 — Japanese monthly salary take-home calculator.
React 18 + Vite, deployed to GitHub Pages at https://htom78.github.io/tedori-keisan/

## Deployment

### GitHub Pages 部署流程

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) 自动执行 `npm ci && npm run build` → 部署 `dist/` 到 Pages。

### 踩坑记录：push 后线上未更新

**问题**: push 了源码到 main，但线上页面没有变化（dist 未更新）。

**原因**: 没有配置 CI/CD，push 只是上传了源码，并不会自动 build 和部署。GitHub Pages 需要有构建产物（dist/）才能更新。

**解决方法**:
1. 添加 `.github/workflows/deploy.yml`，配置 push to main 触发自动构建和部署
2. `vite.config.js` 中设置 `base: '/tedori-keisan/'`（仓库名），否则 Pages 上资源路径 404
3. GitHub 仓库 Settings → Pages → Source 设为 "GitHub Actions"

**教训**: 对于 GitHub Pages 项目，必须确保以下三点同时满足：
- 有 GitHub Actions workflow 在 push 时自动 build
- Vite `base` 配置与仓库名一致
- Pages source 设为 GitHub Actions（不是 branch）

## Commands

- `npm run dev` — 本地开发 (port 5173)
- `npm run build` — 生产构建
- `npm test` — 运行测试 (`vitest run`)
- `npm run test:watch` — 测试 watch 模式

## Tech Stack

- React 18 + Vite 6
- lucide-react (icons)
- Vitest + Testing Library (testing)
- No CSS framework — inline styles with glassmorphism theme
