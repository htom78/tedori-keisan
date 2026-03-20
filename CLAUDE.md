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

## 令和8年税制改正対応（2026年3月完了）

### 修正内容

103万円の壁 → 123万円の引き上げに伴う甲欄電算機特例の更新：

1. **MONTHLY_SALARY_DEDUCTION（月額給与所得控除）**: 第1段階 135,416→158,333 / 45,834→54,167、40%段階廃止、丸め Math.floor→Math.ceil（1円未満切上げ）
2. **MONTHLY_BASIC_DEDUCTION（月額基礎控除）**: 4段階→5段階（¥48,334 新設）、ルックアップ入力を employmentIncome→afterSi に修正
3. **SALARY_DEDUCTION_TABLE（住民税用給与所得控除）**: 1,625,000/550,000→1,900,000/650,000、40%段階廃止
4. **住民税 basicDeduction**: 480,000→580,000

公式仕様: 国税庁 denshi_01.pdf（令和8年分以降 甲欄電算機計算の特例）で全値を検証済み。

### 注意事項

- 社長・役員は雇用保険に加入できない。UI の「雇用保険に加入」チェックボックスを外して対応する
- 税理士の手計算と電算機特例の結果は社保率の差異により数十円〜数百円の差が出るのは正常

## Tech Stack

- React 18 + Vite 6
- lucide-react (icons)
- Vitest + Testing Library (testing)
- No CSS framework — inline styles with glassmorphism theme
