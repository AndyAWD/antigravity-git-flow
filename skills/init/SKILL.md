---
name: agy-git-flow:init
description: 一鍵為全新專案搭建 Git Flow 標準的 main 與 develop 雙軌分支架構。當使用者輸入 /agy-git-flow:init 時觸發。
---

# Git Flow 專案初始化（Init）

本技能旨在為新的 Git 儲存庫建立 Git Flow 的基礎雙軌分支。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/agy-git-flow:init`。
2. 當使用者要求「初始化 Git Flow」、「建立 main 和 develop」時。

## 執行的實作步驟

重要提示：關於腳本執行路徑，由於本技能作為 Plugin 載入，請從您的系統提示詞 `<skills>` 列表中，找出 `agy-git-flow:commit`（或 `commit`）技能被載入的絕對路徑（位於括號中）。請解析該絕對目錄位置，並替換為 `scripts/commit.js` 執行提交腳本，絕不可使用相對路徑。

### 步驟 0：工作區狀態檢查（防越界機制）

1. 若當前專案已為 Git 儲存庫（無論是否已有提交紀錄）：
   - 執行 `git status --porcelain` 檢查工作區是否乾淨。
   - 若偵測到有未暫存、已暫存或未追蹤的檔案（工作區非乾淨狀態）：
     - **必須立即中止流程**，嚴格禁止在本技能內自行拼湊或執行原生 `git add` 或 `git commit` 指令，亦嚴格禁止詢問使用者是否代為提交。
     - 明確提示使用者：「偵測到工作區尚有未提交的變更。初始化技能不處理既有程式碼提交，請先使用 `/agy-git-flow:commit` 完成正規提交流程後再進行初始化。」

### 步驟 1：檢查儲存庫狀態

1. 執行 `git status` 檢查是否為 Git 儲存庫。若不是，執行 `git init`。
2. 若已設定遠端儲存庫，先執行 `git fetch --all --prune` 確保取得遠端分支資訊。

### 步驟 2：建立初始提交（若為全新空白儲存庫）

1. 檢查是否有任何 Commit（例如 `git rev-parse --verify HEAD` 或 `git log -1`）。
2. 若為全新空白儲存庫（無任何提交且工作區無程式碼）：
   - 建立基礎的 `README.md` 檔案。
   - 執行 `git add README.md`。
   - **必須透過 commit 技能之腳本執行提交**：
     ```bash
     node <commit技能絕對目錄>/scripts/commit.js "chore: 初始化專案"
     ```
     （該腳本會自動注入官方共同作者簽名 `Co-authored-by: Google Antigravity <242056456+google-antigravity@users.noreply.github.com>`）。
   - **嚴格禁止執行原生 `git commit` 指令**。
3. 若儲存庫已有其他檔案但尚未提交，不得擅自代理提交，應中斷並指引使用者使用 `/agy-git-flow:commit`。

### 步驟 3：設定 main 與 develop 分支

1. 將當前分支更名為 main（`git branch -m main`）。
2. 檢查 develop 分支：若遠端已有 origin/develop 則切換追蹤，否則從 main 切出 develop 分支（`git checkout -b develop`）。

### 步驟 4：總結回報

告知使用者專案已成功初始化為 Git Flow 架構，並已切換至 develop 分支準備開始開發。

## 嚴格禁止事項（Anti-patterns）

1. **嚴格禁止執行原生 `git commit` 指令**：所有提交必須統一由 `commit` 技能的 `scripts/commit.js` 執行，以確保共同作者簽名與慣例式提交格式正確無誤。
2. **嚴格禁止跨技能越界代理提交**：若非空白儲存庫且工作區存在未提交的變更，必須直接中斷並向使用者明確說明，嚴格禁止自行詢問代為提交或私自執行 git 提交指令。
