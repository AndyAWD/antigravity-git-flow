# antigravity-git-flow

一個專為 Google Antigravity（AGY）設計的外掛程式（Plugin），提供完整的 Git Flow 自動化工作管線。
本外掛程式全面支援 Antigravity 的三大核心平台：Antigravity 命令列介面（CLI）（agy）、Antigravity 整合開發環境（IDE）以及 Antigravity 2.0 桌面應用程式。

本外掛程式不僅能讓代理依據慣例式提交（Conventional Commits）v1.0.0 繁體中文規範自動產生精確的 Git Commit，更補齊了分支合併、拉取請求（Pull Request / PR）發布，以及推播等 Git Flow 的關鍵環節。

## 什麼是 antigravity-git-flow 的特色？

1. 全平台支援：無縫整合於 CLI 終端介面、IDE 側邊欄聊天以及 2.0 桌面版的對話畫布（Chat Canvas）中。
2. 自動模式與智慧導航：專為不熟悉 Git 的使用者設計，AI 會自動分析專案狀態，並主動推進到下一個合理的 Git Flow 步驟。
3. 符合慣例式提交規範：內部建置完整的規範提示詞，確保 `<type>[scope]: <描述>` 格式統一，且描述一律採用繁體中文，避免 AI 產生幻覺。
4. 多任務自動拆分：偵測到不相關的變更時，會聰明地將其拆分為多個獨立 Commit。
5. 自動化的 Git Flow：main 與 develop 禁止直接提交，強制或自動建立 feature/* 或 hotfix/* 分支。
6. 專屬共同作者簽名：所有自動建立的 Commit 末端皆會加上 Google Antigravity 共同作者簽名，清楚區分人工與 AI 協作痕跡。

## 如何安裝與啟用？

本外掛程式支援全域安裝（所有專案與介面共用）與專案工作區安裝（僅限該專案或團隊共用）：

### 方式一：全域安裝（推薦，全平台通用）

全域安裝後，Antigravity CLI、Antigravity 2.0 桌面應用程式與 Antigravity IDE 均能自動辨識並使用本外掛程式的所有技能（Skills）。

1. 透過命令列介面（CLI）安裝：
   ```bash
   agy plugin install https://github.com/AndyAWD/antigravity-git-flow
   ```

2. 透過 Git 手動安裝至全域目錄：
   - Linux / macOS：
     ```bash
     git clone https://github.com/AndyAWD/antigravity-git-flow.git ~/.gemini/config/plugins/antigravity-git-flow
     ```
   - Windows（PowerShell）：
     ```powershell
     git clone https://github.com/AndyAWD/antigravity-git-flow.git "$HOME\.gemini\config\plugins\antigravity-git-flow"
     ```

### 方式二：專案工作區安裝（Workspace / 團隊共用）

若希望將本外掛程式限定於單一專案，或是透過版本控制系統（VCS）與團隊成員共用：

1. 目錄結構放置：
   將本外掛程式資料夾放置於專案根目錄的 `.agents/plugins/antigravity-git-flow/`（必須包含 plugin.json 與 skills/ 目錄）：
   ```text
   <專案根目錄>/
   └── .agents/
       └── plugins/
           └── antigravity-git-flow/
               ├── plugin.json
               └── skills/
   ```

2. 透過 plugins.json 註冊（選用）：
   若外掛存放於自訂路徑或共用目錄，可在專案的 `.agents/plugins.json`（或全域 `~/.gemini/config/plugins.json`）中宣告：
   ```json
   {
     "entries": [
       { "path": "path/to/antigravity-git-flow" }
     ]
   }
   ```

### 如何管理與切換外掛程式？

您可透過 Antigravity CLI 指令或設定介面管理外掛狀態：

1. 列出已安裝外掛：`agy plugin list`
2. 啟用外掛：`agy plugin enable antigravity-git-flow`
3. 停用外掛：`agy plugin disable antigravity-git-flow`
4. 移除外掛：`agy plugin uninstall antigravity-git-flow`
5. 在 Antigravity 2.0 左側欄的 Skills & Customizations 面板中，可即時檢視已載入的外掛與技能。

## 核心技能與指令

安裝完成後，可以在任何 AGY 介面透過語意對話或輸入以下對應的斜線指令（Slash Commands）觸發功能：

### 1. 智慧導航（Auto Next）
```text
/antigravity-git-flow:git-flow:auto-next
```
- 情境：不知下一步該做什麼，或想讓 AI 自動推進 Git Flow 流程。
- 運作邏輯：專為不熟悉 Git 的使用者設計的自動模式。AI 會自動分析專案當前狀態，並決定下一步最適合的 Git Flow 操作（如初始化、提交、推播或發布），並在執行前向您報備。

### 2. 慣例式提交（Commit）
```text
/antigravity-git-flow:git-flow:commit
```
- 情境：開發告一段落，準備將變更寫入版本歷史。
- 運作邏輯：
  1. 全面暫存：執行 `git add -A` 將所有變更加入暫存區。
  2. 分析與拆分：分析當前差異，若包含多個獨立任務，自動拆分為多個邏輯群組。
  3. 分支守門員：檢查目前所在分支，自動建立 develop 並切換至 feature/* 或 hotfix/* 分支。
  4. 精確提交：針對各組任務，分次 `git reset` 後精準 `git add`，並遵守慣例式提交規則撰寫繁體中文訊息。

### 3. 分支合併（Merge）
```text
/antigravity-git-flow:git-flow:merge
```
- 情境：功能或修復開發完成，準備整併回主要分支。
- 運作邏輯：
  1. 自動依據當前分支類型決定合併目標（feature、release 與 hotfix 分支合併至 develop，加上 `--no-ff` 保留節點）。
  2. 若合併過程發生衝突，代理會自動查看雙方分支歷史並嘗試自動解決衝突。
  3. 合併完成後詢問是否刪除原始分支。

### 4. 發布拉取請求（GitHub PR）
```text
/antigravity-git-flow:git-flow:github-pr
```
- 情境：合併到主分支前，需要透過 GitHub 進行程式碼審查（Code Review）。
- 運作邏輯：
  1. 分支與環境檢查：限制只能從 release/* 或 hotfix/* 分支發起（目標皆為 main）。檢查 GitHub CLI（gh）登入狀態。
  2. 內容自動總結：比較分支差異與 commit 紀錄，提煉出本次 PR 的摘要。
  3. 建立 PR：透過 `gh pr create` 以繁體中文撰寫標題與描述並發布至 GitHub。

### 5. 遠端推播（Push）
```text
/antigravity-git-flow:git-flow:push
```
- 情境：將本地端的變更同步上傳至 GitHub 遠端儲存庫。
- 運作邏輯：推送前先 fetch 檢查遠端狀態。若本地落後遠端會先提醒同步；確認無落後後執行 `git push -u origin HEAD --follow-tags`。

### 6. 建立發布分支（Start Release）
```text
/antigravity-git-flow:git-flow:release [vX.Y.Z]
```
- 情境：開發階段告一段落，準備從 develop 開啟發布測試週期。
- 運作邏輯：
  1. 版本推算：分析未發布變更，推算下一個合理的語意化版本號（SemVer）。
  2. 分支建立：自動切換並建立 release/<版號> 分支。
  3. 跨平台智慧版號更新：自動搜尋並更新 `package.json`、`build.gradle` 等檔案。
  4. 自動提交：自動建立 `chore(release): bump version to <版號>` 提交並附上共同作者簽名。

### 7. 建立 GitHub Release
```text
/antigravity-git-flow:git-flow:github-release
```
- 情境：專案開發到里程碑，準備在 GitHub 上發布新版本。
- 運作邏輯：
  1. 確認版本號。
  2. 自動 Changelog：比對差異，自動整理中英文雙語發布說明。
  3. 發布至 GitHub：透過 `gh release create` 自動建立 GitHub Release。

### 8. 自動與手動版本標記（Tag）
```text
/antigravity-git-flow:git-flow:tag [vX.Y.Z]
```
- 情境：在主要分支完成發布，需要依照規範打上版號標記。
- 運作邏輯：嚴格限制僅能在 main 或 master 分支執行，依據 SemVer 規範判斷升級層級並打上 `vX.Y.Z` 標籤。

### 9. 專案初始化（Init）
```text
/antigravity-git-flow:git-flow:init
```
- 情境：全新專案一鍵架設 Git Flow 基礎架構。
- 運作邏輯：檢查或執行 `git init`，建立初始提交，並建立標準的 main 與 develop 雙軌分支。
