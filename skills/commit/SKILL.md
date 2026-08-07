---
name: commit
description: 依照慣例式提交（Conventional Commits）v1.0.0 規範自動產生 git commit。分析目前 workspace 變更，若包含多個獨立任務會自動拆分成多個 commit。整合 Git Flow 分支策略。所有 commit 的 author 與 committer 都將強制設為 Google Antigravity。當使用者輸入 /git-flow-agy:commit 或提及「幫我 commit」、「整理提交」等字眼時觸發。
---

# Conventional Commits with Git Flow for Antigravity

依照 [慣例式提交 v1.0.0](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 規範產生 commit，並整合 Git Flow 分支策略。

## 何時使用此 Skill
- 當使用者輸入 `/git-flow-agy:commit`
- 「幫我 commit」「幫我提交」「commit 一下」
- 「整理提交」「拆 commit」「分成幾個 commit」
- 「conventional commit」「按規範提交」

## 互動與確認規則 (ask_question)
在執行過程中，如果遇到以下情況（例如在錯誤分支需要中斷或確認意圖），**必須呼叫 `ask_question` 工具**來向使用者詢問，**絕不可使用原有的純文字反問或自行揣測**。

1. **若目前在 `main` 或 `master` 分支：**
   必須先呼叫 `ask_question` 詢問使用者要建立 `hotfix` 還是 `feature` 分支。
   - 若選擇 `feature`：依循原本的檢查邏輯（檢查是否有 `develop` 分支，若有則提醒可能在錯誤分支，並詢問是否中斷或手動切換）。
   - 若選擇 `hotfix`：直接繼續執行建立 hotfix 分支的流程。
範例：
```json
{
  "questions": [
    {
      "question": "目前在 main 分支，請問您要建立 hotfix 還是 feature 分支？",
      "options": ["(Recommended) feature", "hotfix", "取消"],
      "is_multi_select": false
    }
  ],
  "toolSummary": "確認分支",
  "toolAction": "詢問建立 hotfix 或 feature 分支"
}
```
以及原有的 develop 分支檢查範例：
```json
{
  "questions": [
    {
      "question": "目前在 main，但 develop 分支已存在。可能在錯誤分支，是否要中斷並手動切換？",
      "options": ["(Recommended) 是，中斷流程", "否，繼續執行"],
      "is_multi_select": false
    }
  ],
  "toolSummary": "確認分支",
  "toolAction": "詢問分支意圖"
}
```

## 執行流程（8 步驟）
Step 1: 確認當前分支，若在 `main` 或 `master`，則執行上述 `ask_question` 流程。
Step 2: 執行 `git add -A`
Step 3: 呼叫本技能目錄下 `scripts/analyze.js` 蒐集資訊（透過 run_command 執行，請確保路徑正確）
Step 4: 依 diff 內容分組任務（自動拆分）
Step 5: 呼叫本技能目錄下 `scripts/branch-guard.js <feature|hotfix> <branch-name>` 檢查分支
Step 6: 決定每組的 type/scope
Step 7: 撰寫符合規範的訊息（**type 與 scope 必須保持英文，但 description 必須使用繁體中文**，例如：`feat(auth): 新增登入功能`，可選的 body/footer 亦需為繁體中文）
Step 8: 對每組任務，執行 `git reset` -> 精準 `git add` -> 呼叫 `scripts/commit.js "<訊息>"`

## 規範與限制
- **Author/Committer**：依使用者全域規則，請勿竄改 Author 身分，而必須在 Commit 訊息最下方加上 `Co-authored-by: Google Antigravity <242056456+google-antigravity@users.noreply.github.com>` 簽名。
- **Commit 訊息格式**：
  ```
  <type>[optional scope]: <繁體中文描述 (description)>

  [optional body]

  Co-authored-by: Google Antigravity <242056456+google-antigravity@users.noreply.github.com>
  ```
