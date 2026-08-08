---
name: push
description: 執行 git push 將本地變更推送到遠端。當使用者輸入 /antigravity-git-flow:push 時觸發。
---
# Push

## 何時使用此 Skill
- 當使用者輸入 `/antigravity-git-flow:push`

## 執行流程
1. 直接透過 `run_command` 執行 `git push -u origin HEAD --follow-tags`。
   *(註：這個指令會自動把當前分支與相關標籤推送到 origin 並建立追蹤，無需分步驟判斷)*
