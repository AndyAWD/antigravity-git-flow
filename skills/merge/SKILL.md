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
     1. 切換至 `develop` 分支（`git checkout develop`）。
     2. 執行合併（`git merge --no-ff <feature-branch>`）。
   - **若在 `hotfix/*` 分支**：
     1. 切換至主分支（`main` 或 `master`）。
     2. 執行合併（`git merge --no-ff <hotfix-branch>`）。
     3. 檢查 `develop` 分支是否存在。若不存在，請從目前的主分支建立 `develop` 分支（`git checkout -b develop`）。
     4. 切換至 `develop` 分支。
     5. 執行合併（`git merge --no-ff <hotfix-branch>`）。
   - **若在 `develop` 分支**：
     1. 切換至主分支（`main` 或 `master`）。
     2. 執行合併（`git merge --no-ff develop`）。
   - **其他分支**：若非以上分支，請詢問使用者或拒絕執行。
4. **衝突處理**：
   - 若在任何合併過程 (`git merge`) 中發生合併衝突 (Merge Conflict)，請立即中止流程。
   - 使用明顯的訊息提示使用者：「發生合併衝突，請手動解決衝突並完成 commit 後，再繼續後續操作。」
