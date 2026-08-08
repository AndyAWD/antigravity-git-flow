---
name: merge
description: 依照 Git Flow 規則執行分支合併。當使用者輸入 /git-flow-agy:merge 時觸發。
---
# Merge (Git Flow)

## 何時使用此 Skill
- 當使用者輸入 `/git-flow-agy:merge`

## 執行流程
1. **偵測主分支**：執行 `git branch -l main` 或類似指令檢查 `main` 分支是否存在。若存在則主分支為 `main`，若不存在則預設為 `master`。
2. **取得目前分支**：執行 `git branch --show-current` 取得目前所在分支名稱。
3. 根據目前的分支類型執行對應的合併邏輯（注意：所有合併動作都必須加上 `--no-ff` 以保留節點）：
   - **若在 `feature/*` 分支**：
     1. 檢查並切換至 `develop` 分支（若無則建立）。
     2. 執行合併（`git merge --no-ff <current-branch>`）。

   - **若在 `release/*` 或 `hotfix/*` 分支**：
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
     - **若選擇「是 (建立 PR)」**：
       1. 請從您的 `<skills>` 列表中找出並執行 `github-pr` 技能。
       2. 接著在本地切換至 `develop` 分支，執行合併（`git merge --no-ff <current-branch>`）同步程式碼。
     - **若選擇「否 (純本地合併)」**：
       1. 切換至主分支 (`main` 或 `master`)，執行合併（`git merge --no-ff <current-branch>`）。
       2. 切換至 `develop` 分支，執行合併（`git merge --no-ff <current-branch>`）。

   - **其他分支**：若非以上分支，請詢問使用者或拒絕執行。

4. **衝突處理**：
   - 若發生合併衝突，請評估複雜度。
   - 若衝突單純（例如新增 import、互不干涉的行），請嘗試自動解決並執行 `git add -A`。
   - 若衝突過於複雜或涉及核心業務邏輯，**請務必保留衝突狀態，並告知使用者需手動排解，待使用者排解並確認後再繼續。**

5. **合併完成後的清理作業 (Branch Cleanup)**：
   當所有合併與衝突處理完成，並且成功提交後，使用 `ask_question` 工具（啟用多選）詢問使用者是否刪除原始分支：
   ```json
   {
     "questions": [
       {
         "question": "合併已順利完成！請問您是否要刪除剛才合併的原始分支 (<原始分支名稱>) 來保持專案乾淨？",
         "options": ["刪除本地分支", "刪除遠程分支", "保留分支，不刪除"],
         "is_multi_select": true
       }
     ],
     "toolSummary": "確認刪除分支",
     "toolAction": "詢問分支刪除意願"
   }
   ```
   - 請根據使用者的「多選」結果執行：
     - 若包含「刪除本地分支」：執行 `git branch -d <原始分支>`。
     - 若包含「刪除遠程分支」：執行 `git push origin --delete <原始分支>`。
     - 若勾選「保留分支，不刪除」或「完全沒勾選任何選項」：不做任何事，直接結束流程。
