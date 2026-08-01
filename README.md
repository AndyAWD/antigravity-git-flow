# conventional-commits-agy

一個為 Antigravity (agy) 設計的外掛，讓 Agy 依據 [慣例式提交（Conventional Commits）v1.0.0 繁體中文規範](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 自動產生 git commit，並整合 Git Flow 分支策略。

## 特色
- 📝 **符合慣例式提交規範**：`<type>[scope]: <描述>` 全部按規範。
- 🔀 **多任務自動拆分**：偵測到不相關的變更會自動分成多個 commit。
- 🌿 **整合 Git Flow**：`main` / `develop` 禁止直接提交，自動建立 `feature/*` 或 `hotfix/*` 分支。
- 🤖 **Agy 專屬身分**：自動將 Author 與 Committer 設定為 `Google Antigravity`，保留 AI 協作痕跡。

## 安裝

透過 Agy CLI 安裝本外掛：

```bash
agy plugin install https://github.com/AndyAWD/conventional-commits-agy
```

## 使用方式

在 Agy 終端機中，執行以下指令，或直接在對話中說「幫我 commit」、「整理提交」、「拆 commit」：

```bash
/conventional-commits-agy:commit
```

## 運作原理與執行流程

當 Agy 觸發本外掛的提交指令時，將會嚴格遵守以下七個步驟的自動化流程：

1. **全面暫存變更**：執行 `git add -A` 將所有工作區變更加入暫存區。
2. **分析與蒐集資訊**：呼叫內部腳本 `scripts/analyze.js`，獲取當前分支狀態與完整的變更差異（diff）資訊。
3. **智慧型任務拆分**：若偵測到您的變更包含多個獨立任務（例如：同時新增了功能與修復了無關的錯誤），Agy 會根據差異內容自動將其拆分為多個邏輯群組。
4. **Git Flow 分支守門員（Branch Guard）**：
   - 呼叫 `scripts/branch-guard.js` 檢查目前分支是否合規。
   - 若在 `main` 分支開發新功能，會自動建立 `develop` 與對應的 `feature/<分支名稱>` 分支。
   - 若為緊急修復（hotfix），則直接從 `main` 建立 `hotfix/<分支名稱>` 分支。
   - 若偵測到潛在風險（例如在錯誤分支上操作），Agy 會強制中斷流程，並透過對話方塊（Interactive Dialog）向您詢問、確認意圖，絕不擅自執行危險操作。
5. **決定類型與範圍**：針對每一組拆分出來的任務，精準定義符合慣例的 `type`（如 feat、fix、docs 等）與 `scope`。
6. **撰寫標準化訊息**：以全繁體中文撰寫符合 v1.0.0 規範的 description，並視複雜度補充詳細的 body 或 footer。
7. **精確提交**：針對每一組任務，重新執行 `git reset` 清空暫存，接著僅針對該任務的檔案執行精準的 `git add`，最後呼叫 `scripts/commit.js` 完成提交。所有產生的 commit，其 Author 與 Committer 皆會被強制設為 `Google Antigravity <google-antigravity@users.noreply.github.com>`，以符合專案規範。
