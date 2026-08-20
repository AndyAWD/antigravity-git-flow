---
name: push
description: 執行 git push 將本地變更推送到遠端。當使用者輸入 /antigravity-git-flow:push 時觸發。
---
# Push

## 何時使用此 Skill
- 當使用者輸入 `/antigravity-git-flow:push`

## 執行流程
1. **遠端狀態擷取 (Fetch)**：
   若專案設定有遠端儲存庫（`git remote`），先透過 `run_command` 執行 `git fetch origin --tags` 獲取遠端最新變更與標籤。
2. **防呆檢查 (Behind Check)**：
   檢查當前分支是否落後遠端（例如透過 `git status` 或 `git rev-list --left-right --count HEAD...@{u}`）。
   - **若落後遠端 (Behind > 0)**：請告知使用者「遠端已有新的提交，需要先同步更新」，並執行 `git pull --rebase`（或 `git pull`）完成整合。
   - **若無落後 (Behind == 0 或無 upstream)**：直接透過 `run_command` 執行 `git push -u origin HEAD --follow-tags` 將當前分支與相關標籤推送到遠端並建立追蹤。

