---
name: antigravity-git-flow:git-flow:merge
description: 依照 Git Flow 規則執行分支合併。當使用者輸入 /antigravity-git-flow:git-flow:merge 時觸發。
---

# 分支合併（Git Flow Merge）

依照 Git Flow 規則執行分支合併。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/antigravity-git-flow:git-flow:merge`。
2. 當使用者要求「合併分支」時。

## 執行的實作步驟

1. 第一步：遠端狀態同步（Fetch）
   若專案設定有遠端儲存庫（`git remote`），先執行 `git fetch --all --prune` 取得遠端所有分支的最新狀態。

2. 第二步：偵測主分支
   執行 `git branch -l main` 檢查 main 分支是否存在。若存在則主分支為 main，若不存在則預設為 master。

3. 第三步：取得目前分支名稱
   執行 `git branch --show-current` 取得目前所在分支名稱。

4. 第四步：依分支類型執行合併邏輯（切換至目標分支後先執行 `git pull --ff-only` 同步，且合併指令一律加上 `--no-ff` 保留節點）：
   - 若在 feature/* 分支：
     1. 切換至 develop 分支（若無則建立）。
     2. 執行合併：`git merge --no-ff <current-branch>`。
   - 若在 release/* 或 hotfix/* 分支：
     使用 `ask_question` 工具詢問使用者是否要發送 Pull Request：
     ```json
     {
       "questions": [
         {
           "question": "目前在發布/修復分支，請問您要透過 GitHub 建立 Pull Request 合併至主分支嗎？",
           "options": ["是，發佈 PR 到主分支，然後在本地合併回 develop", "否，完全在本地依序合併至主分支與 develop"],
           "is_multi_select": false
         }
       ],
       "toolSummary": "確認合併方式",
       "toolAction": "詢問是否建立 PR"
     }
     ```
     - 若選擇「是（建立 PR）」：
       1. 從技能列表中讀取並執行 `antigravity-git-flow:git-flow:github-pr`（或 `github-pr`）技能。
       2. 在本地切換至 develop 分支，執行合併：`git merge --no-ff <current-branch>`。
     - 若選擇「否（純本地合併）」：
       1. 切換至主分支（main 或 master），執行合併：`git merge --no-ff <current-branch>`。
       2. 切換至 develop 分支，執行合併：`git merge --no-ff <current-branch>`。

5. 第五步：衝突處理
   若發生合併衝突：
   - 單純衝突嘗試自動解決並執行 `git add -A`。
   - 複雜衝突請保留衝突狀態，並告知使用者需手動排解，待確認後再繼續。

6. 第六步：分支清理作業（Branch Cleanup）
   合併完成後，使用 `ask_question` 工具（啟用多選）詢問是否刪除原始分支：
   ```json
   {
     "questions": [
       {
         "question": "合併已順利完成！請問您是否要刪除剛才合併的原始分支來保持專案乾淨？",
         "options": ["刪除本地分支", "刪除遠端分支", "保留分支，不刪除"],
         "is_multi_select": true
       }
     ],
     "toolSummary": "確認刪除分支",
     "toolAction": "詢問分支刪除意願"
   }
   ```
   - 勾選刪除本地分支：執行 `git branch -d <原始分支>`。
   - 勾選刪除遠端分支：執行 `git push origin --delete <原始分支>`。
   - 勾選保留分支或未勾選：保持現狀，結束流程。
