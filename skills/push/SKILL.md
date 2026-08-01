---
name: push
description: 執行 git push 將本地變更推送到遠端。當使用者輸入 /git-flow-agy:push 時觸發。
---
# Push

## 何時使用此 Skill
- 當使用者輸入 `/git-flow-agy:push`

## 執行流程
1. 取得目前分支名稱（例如使用 `git branch --show-current`）。
2. 執行 `git push`。
3. 若遠端尚未建立該分支（發生 `fatal: The current branch ... has no upstream branch` 或類似錯誤），則自動執行 `git push -u origin <branch_name>`。
