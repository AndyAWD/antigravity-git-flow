---
name: antigravity-git-flow:github-pr
description: 建立 Pull Request。限制僅能在 hotfix/* 或 release/* 分支執行，且 PR 內容須為繁體中文。當使用者輸入 /antigravity-git-flow:github-pr 時觸發。
---

# 建立拉取請求（Pull Request）

在 Git Flow 模式下，從 release/* 或 hotfix/* 分支發起 Pull Request 到 main 主分支。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/antigravity-git-flow:github-pr`。
2. 當使用者提及「發 PR」、「建立 Pull Request」、「發起程式碼審查」時。

## 執行的實作步驟

1. 第一步：遠端狀態同步（Fetch）
   若專案設定有遠端儲存庫（`git remote`），先執行 `git fetch --all` 確保目標主分支與當前分支的遠端追蹤狀態為最新。

2. 第二步：取得目前分支名稱
   執行 `git branch --show-current`。

3. 第三步：分支檢查
   若目前分支不是 release/* 且不是 hotfix/*，必須拒絕執行，並向使用者顯示：「目前分支為 <分支名稱>。PR 僅允許由 release 或 hotfix 分支發起。」

4. 第四步：遠端推送確認
   檢查當前分支是否已推送到遠端。若尚未推送或超前遠端，先執行 `git push -u origin HEAD` 確保遠端有最新程式碼以供建立 PR。

5. 第五步：PR 內容產生
   讀取近期的 commit 紀錄（例如 `git log origin/<target_branch>..HEAD`），總結此次 PR 的變更內容。必須使用繁體中文撰寫標題與描述。

6. 第六步：環境檢查與建立 PR
   執行 `gh auth status` 檢查是否已安裝 GitHub CLI 且已完成登入：
   - 若已安裝且已登入（情境 A）：
     目標分支統一設定為主分支（main 或 master）。
     執行指令：`gh pr create --title "<繁體中文標題>" --body "<繁體中文描述>" --base <目標分支>` 自動建立 PR。
   - 若未安裝或未登入（情境 B）：
     停止後續所有動作，並提示使用者：「請先安裝 GitHub CLI（gh）並執行 `gh auth login` 完成登入後，再重新輸入 `/antigravity-git-flow:github-pr` 繼續執行。」
