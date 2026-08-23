---
name: antigravity-git-flow:commit
description: 依照慣例式提交（Conventional Commits）v1.0.0 規範自動產生 git commit。分析目前 workspace 變更，若包含多個獨立任務會自動拆分成多個 commit。整合 Git Flow 分支策略。所有 commit 的 author 與 committer 都將強制設為 Google Antigravity。當使用者輸入 /antigravity-git-flow:commit 或提及「幫我 commit」、「整理提交」等字眼時觸發。
---

# Conventional Commits with Git Flow for Antigravity

依照慣例式提交（Conventional Commits）規範產生 commit，並整合 Git Flow 分支策略。

## 什麼是慣例式提交規範？

1. Commit 訊息整體結構：
   ```text
   <type>[optional scope]: <description>

   [optional body]

   [optional footer(s)]
   ```
   - 標題行包含 type、scope 與 description。
   - 標題行與 body 之間必須留有一個空白行。
   - body 與 footer 之間必須留有一個空白行。

2. 類型（Type），必須為以下之一（全部小寫）：
   - `feat`: 新增功能（feature）
   - `fix`: 修復錯誤（bug fix）
   - `docs`: 僅修改文件（documentation）
   - `style`: 程式碼風格調整，不影響程式碼運行（如空格、縮排、缺少分號等）
   - `refactor`: 重構程式碼（既非新增功能也非修復錯誤）
   - `perf`: 改善效能（performance）
   - `test`: 新增或修改測試（test）
   - `build`: 影響建置系統或外部依賴的變更（如 npm, webpack 等）
   - `ci`: 修改持續整合（CI）的設定檔或腳本
   - `chore`: 其他雜項工作，未修改原始碼或測試檔（如更新 .gitignore）
   - `revert`: 撤銷先前的 commit，body 中應註明 `This reverts commit <hash>.`

3. 範圍（Scope）：可選。用括號包住，提供上下文資訊（例如模組或套件名稱），如 `feat(api):`。應保持簡短且使用英文小寫。

4. 描述（Description）：
   - 必須緊接在 type/scope 的冒號與一個空白之後。
   - 依據本技能規範，必須使用繁體中文（如 `新增登入 API`）。
   - 標題行總長度建議不超過 72 個字元。

5. 主體（Body）：可選。
   - 說明為什麼（Why）要進行這些變更，或變更了哪些具體行為，而非只是描述程式碼如何修改（How）。
   - 若有多段落，段落之間需以空白行分隔。
   - 依據本技能規範，必須使用繁體中文。

6. 結尾（Footer）：可選。
   - 用於標註關聯的 Issue ID（如 `Refs: #123`, `Closes: #456`）。
   - 用於放置 `Co-authored-by` 等簽名。

7. 重大變更（Breaking Changes）：
   - 若變更會破壞向後相容性，必須在 type 或 scope 後方加上驚嘆號 `!`（如 `feat!:` 或 `feat(api)!:`）。
   - 也可以在 footer 開頭標註 `BREAKING CHANGE: <繁體中文描述>`。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/antigravity-git-flow:commit`。
2. 當使用者提及「幫我 commit」、「幫我提交」、「commit 一下」、「整理提交」、「拆 commit」時。

## 互動與確認規則（ask_question）

在執行過程中，如果遇到在主分支需要中斷或確認意圖，必須呼叫 `ask_question` 工具向使用者詢問：

```json
{
  "questions": [
    {
      "question": "目前在 main 分支，請問您要建立 hotfix 還是 feature 分支？",
      "options": ["我要建立 feature 分支", "我要建立 hotfix 分支", "取消目前操作"],
      "is_multi_select": false
    }
  ],
  "toolSummary": "確認分支",
  "toolAction": "詢問建立 hotfix 或 feature 分支"
}
```

以及 develop 分支檢查：

```json
{
  "questions": [
    {
      "question": "目前在 main，但 develop 分支已存在。可能在錯誤分支，是否要中斷並手動切換？",
      "options": ["是，中斷流程", "否，繼續執行"],
      "is_multi_select": false
    }
  ],
  "toolSummary": "確認分支",
  "toolAction": "詢問分支意圖"
}
```

## 執行的 8 個步驟

重要提示：關於腳本執行路徑，由於本技能作為 Plugin 載入，請從您的系統提示詞 `<skills>` 列表中，找出 `antigravity-git-flow:commit`（或 `commit`）技能被載入的絕對路徑（位於括號中）。請解析該絕對目錄位置，並替換為 `scripts/` 資料夾的絕對路徑後執行腳本（例如：`node /絕對路徑/scripts/analyze.js`）。絕不可使用相對路徑。

1. 第一步：確認當前分支，若在 main 或 master，則執行上述 `ask_question` 流程。
2. 第二步：執行 `git ls-files --others --exclude-standard` 檢查是否有未追蹤的新檔案。
   - 若有新檔案，必須暫停並列出清單，使用 `ask_question` 詢問安全確認。
   - 選項提供：「(Recommended) 這些檔案都安全，全部加入」、「裡面有敏感檔案，我要加入 .gitignore」、「這次先不提交這些新檔案」。
   - 若無新檔案，則直接執行 `git add -A`。
3. 第三步：透過 `run_command` 執行 `scripts/analyze.js` 蒐集工作區狀態與 diff 資訊。
4. 第四步：依 diff 內容自動分析並拆分獨立任務群組。
5. 第五步：執行 `scripts/branch-guard.js <feature|hotfix> <branch-name>` 確保分支正確。
6. 第六步：決定每組任務的 type 與 scope。
7. 第七步：撰寫符合規範的訊息（type 與 scope 保持英文，description 與 body 必須使用繁體中文）。
8. 第八步：針對每組任務，執行 `git reset` 重設暫存區，接著精準 `git add` 該組檔案，最後執行 `scripts/commit.js "<訊息>"` 完成提交。

## 規範與簽名

所有提交訊息最下方必須包含共同作者簽名：

```text
<type>[optional scope]: <繁體中文描述>

[optional body]

Co-authored-by: Google Antigravity <242056456+google-antigravity@users.noreply.github.com>
```
