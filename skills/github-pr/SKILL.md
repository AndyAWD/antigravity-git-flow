---
name: github-pr
description: 建立 Pull Request。限制僅能在 hotfix/* 或 release/* 分支執行，且 PR 內容須為繁體中文。當使用者輸入 /git-flow-agy:github-pr 時觸發。
---
# Pull Request

## 何時使用此 Skill
- 當使用者輸入 `/git-flow-agy:github-pr`

## 執行流程與限制
1. **取得目前分支名稱**：執行 `git branch --show-current`。
2. **分支檢查**：
   - 若目前分支不是 `release/*` 且不是 `hotfix/*`，必須拒絕執行，並向使用者顯示：「目前分支為 <分支名稱>。PR 僅允許由 release 或 hotfix 分支發起。」
3. **PR 內容產生**：
   - 讀取近期的 commit 紀錄（例如 `git log <target_branch>..HEAD`），總結此次 PR 的變更內容。
   - 必須使用**繁體中文**撰寫 PR 的標題 (Title) 與描述 (Body)。
4. **環境檢查與建立 PR**：
   - 執行 `gh auth status` 檢查是否已安裝 GitHub CLI 且已完成登入。
   - **若已安裝且已登入 (情境 A)**：
     - 目標分支統一設定為主分支（`main` 或 `master`）。
     - 執行指令：`gh pr create --title "<繁體中文標題>" --body "<繁體中文描述>" --base <目標分支>`，自動建立 PR。
   - **若未安裝或未登入 (情境 B)**：
     - 停止後續所有動作。
     - 以明顯的提示訊息告知使用者：「請先安裝 GitHub CLI (gh) 並執行 \`gh auth login\` 完成登入後，再重新輸入 \`/git-flow-agy:github-pr\` 繼續執行。」
