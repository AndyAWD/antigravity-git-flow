---
name: agy-git-flow:merge
description: 依照 Git Flow 規則執行分支合併。當使用者輸入 /agy-git-flow:merge 時觸發。
---

# 分支合併（Git Flow Merge）

依照 Git Flow 規則執行分支合併。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/agy-git-flow:merge`。
2. 當使用者要求「合併分支」時。

## 執行的實作步驟

重要提示：關於腳本執行路徑，由於本技能作為 Plugin 載入，請從您的系統提示詞 `<skills>` 列表中，找出 `agy-git-flow:commit`（或 `commit`）技能被載入的絕對路徑（位於括號中）。請解析該絕對目錄位置，並替換為 `scripts/commit.js` 執行提交腳本，絕不可使用相對路徑。

### 步驟 0：工作區狀態檢查（防越界機制）

1. 執行 `git status --untracked-files=no --porcelain` 檢查工作區是否乾淨。
2. 若偵測到有已追蹤檔案之未暫存或已暫存的修改（工作區非乾淨狀態）：
   - **必須立即中止流程**，嚴格禁止在本技能內自行拼湊或執行原生 `git add` 或 `git commit` 指令，亦嚴格禁止詢問使用者是否代為提交。
   - 明確提示使用者：「偵測到工作區尚有已追蹤檔案之未提交變更。合併前工作區必須保持乾淨，避免切換分支或合併時發生檔案衝突。請先使用 `/agy-git-flow:commit` 完成正規提交流程後再執行合併。」
   - 注意：未追蹤檔案（Untracked files）不阻擋合併流程。

### 步驟 1：遠端狀態同步（Fetch）

若專案設定有遠端儲存庫（`git remote`），先執行 `git fetch --all --prune` 取得遠端所有分支的最新狀態。

### 步驟 2：偵測主分支

執行 `git branch -l main` 檢查 main 分支是否存在。若存在則主分支為 main，若不存在則預設為 master。

### 步驟 3：取得目前分支名稱

執行 `git branch --show-current` 取得目前所在分支名稱。

### 步驟 4：依分支類型執行合併邏輯

切換至目標分支後先執行 `git pull --ff-only` 同步，且合併指令一律加上 `--no-ff` 保留節點：
- 若在 feature/* 分支：
  1. 切換至 develop 分支（若無則建立）。
  2. 執行合併：`git merge --no-ff <current-branch>`。
  3. 進入步驟 6 詢問分支清理。
- 若在 release/* 或 hotfix/* 分支：
  使用 `ask_question` 工具詢問使用者是否要發送 Pull Request：
  ```json
  {
    "questions": [
      {
        "question": "目前在發布/修復分支，請問您要透過 GitHub 建立 Pull Request 合併至主分支嗎？",
        "options": ["是，發佈 PR 到主分支（等待線上審查與合併）", "否，完全在本地依序合併至主分支與 develop"],
        "is_multi_select": false
      }
    ],
    "toolSummary": "確認合併方式",
    "toolAction": "詢問是否建立 PR"
  }
  ```
  - 若選擇「是（建立 PR）」：
    1. 從技能列表中讀取並執行 `agy-git-flow:github-pr`（或 `github-pr`）技能。
    2. **嚴格流程防護**：發起 PR 後，線上審查合併前**絕對禁止刪除遠端或本地來源分支**。明確告知使用者：「PR 已在 GitHub 上發起，請等待線上審查與合併完成。為防 PR 遭到 GitHub 關閉，本階段嚴格禁止刪除來源分支。」並直接結束流程，**不可進入步驟 6**。
  - 若選擇「否（純本地合併）」：
    1. 切換至主分支（main 或 master），執行合併：`git merge --no-ff <current-branch>`。
    2. **維持在主分支（main 或 master）**，此時主分支具有最新的發布節點，接續引導或執行 `/agy-git-flow:tag` 技能打上版本標籤（Tag）。
    3. 接著切換至 develop 分支，執行合併：`git merge --no-ff <current-branch>`（同步發布變更回 develop 分支）。
    4. 若有設定遠端，執行雙分支推播：`git push origin main develop --follow-tags`，確保 main 與 develop 同步更新且發布標籤完整推送到遠端。
    5. 完成上述雙向合併與標籤作業後，進入步驟 6 進行分支清理。

### 步驟 5：衝突處理

若發生合併衝突：
- 單純衝突由 AI 嘗試自動排解，排解後僅針對衝突檔案執行精準暫存（`git add <衝突檔案>`，嚴格禁止無差別 `git add -A`）。
- 完成合併提交時，**必須執行 commit 技能之腳本執行提交**：
  ```bash
  node <commit技能絕對目錄>/scripts/commit.js "Merge branch '<原始分支>' into <目標分支>"
  ```
  （該腳本會自動注入 AI 產生者簽名 `Generated-by: [模型名稱] ([思考等級])`（未註明時預設 `Generated-by: Google Antigravity`））。
  **嚴格禁止執行原生 `git commit` 指令**。
- 複雜衝突請保留衝突狀態，並告知使用者需手動排解，待確認後再繼續。

### 步驟 6：分支清理作業（Branch Cleanup）

**注意**：本步驟僅在純本地合併完成後執行；若先前選擇「建立 PR」，嚴格禁止執行本步驟。
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

## 嚴格禁止事項（Anti-patterns）

1. **嚴格禁止執行原生 `git commit` 指令**：所有提交與衝突排解後之合併提交，必須統一由 `scripts/commit.js` 執行，以確保 AI 產生者簽名與格式正確無誤。
2. **嚴格禁止在非乾淨工作區執行分支切換或合併**：若偵測到未提交變更，必須直接中斷並向使用者明確說明，嚴格禁止自行詢問代為提交或私自執行 git 提交指令。
3. **嚴格禁止無差別全量暫存（`git add -A`）**：排解衝突時僅允許精準暫存已解決衝突的檔案。
