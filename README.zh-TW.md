# antigravity-git-flow

[English](README.md) | 繁體中文

一個專為 Google Antigravity（AGY）設計的外掛程式（Plugin），提供完整的 Git 分支流程（Git Flow）自動化工作管線。

全面支援 Google Antigravity 的三大核心平台：Antigravity 命令列介面（Command-Line Interface）（`agy`）、Antigravity 整合開發環境（Integrated Development Environment）以及 Antigravity 2.0 桌面應用程式。

本外掛程式依據慣例式提交（Conventional Commits）v1.0.0 規範自動產生精確的 Git 提交（Commit），並結合分支合併、拉取請求（Pull Request）發布、中英雙語發布說明（Release Notes）與雙語說明文件生成等完整生命週期。

## 如何安裝

透過 Antigravity 命令列介面進行全域安裝：

```bash
agy plugin install https://github.com/AndyAWD/antigravity-git-flow
```

## 特色亮點

1. **全平台無縫相容**：完美相容於命令列介面終端機、整合開發環境側邊欄對話框以及 2.0 桌面版的對話畫布（Chat Canvas）。
2. **自動導航與流程推進**：專為不熟悉 Git 的開發者設計，AI 自動分析目前專案狀態，主動引導並推進到下一個合理的 Git Flow 步驟。
3. **符合慣例式提交規範**：內建繁體中文提示詞，確保 `<type>[scope]: <描述>` 格式統一，避免模型產生幻覺。
4. **多任務自動拆分**：偵測到工作區包含多個不同修改時，自動拆分為多個獨立的提交。
5. **標準化雙語文件與發布**：整合多語系拉取請求範本、中英文雙語 GitHub Release 變更日誌，以及雙語說明文件自動化生成機制。
6. **專屬共同作者簽名**：所有自動建立的提交末端皆會加上 Google Antigravity 共同作者標籤，清楚保留協作足跡。

## 如何管理與切換外掛程式

• 列出已安裝外掛：

  ```bash
  agy plugin list
  ```

• 啟用外掛：

  ```bash
  agy plugin enable antigravity-git-flow
  ```

• 停用外掛：

  ```bash
  agy plugin disable antigravity-git-flow
  ```

• 移除外掛：

  ```bash
  agy plugin uninstall antigravity-git-flow
  ```

## 專案資料夾目錄

```text
antigravity-git-flow/
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── plugin.json
├── package.json
├── LICENSE
├── README.md
├── README.zh-TW.md
├── templates/
│   ├── README.template.md
│   ├── README.zh-TW.template.md
│   ├── RELEASE.template.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── PULL_REQUEST_TEMPLATE.en.md
│   └── PULL_REQUEST_TEMPLATE.bilingual.md
└── skills/
    ├── auto-next/
    ├── commit/
    ├── fetch/
    ├── github-pr/
    ├── github-release/
    ├── init/
    ├── merge/
    ├── pull/
    ├── push/
    ├── release/
    ├── sync-readme/
    └── tag/
```

## 指令功能說明

安裝完成後，可在任何 AGY 介面透過語意對話或輸入對應的斜線指令（Slash Command）觸發：

### 1. 智慧導航（Auto Next）

```text
/antigravity-git-flow:agy-git-flow:auto-next
```

- **使用情境**：不知下一步該做什麼，或想讓 AI 自動推進 Git Flow 流程時。
- **運作流程**：
  1. 背景執行遠端狀態擷取（Fetch）並安全快轉非當前本地分支。
  2. 檢查專案是否已建立版本控制，若未建立則執行專案初始化。
  3. 檢查工作區變更並自動進行提交（Commit）與遠端推送（Push）。
  4. 依分支類型自動推進合併（Merge）、標籤（Tag）或發布（Release）。

### 2. 慣例式提交（Commit）

```text
/antigravity-git-flow:agy-git-flow:commit
```

- **使用情境**：開發告一段落，準備將工作區變更寫入版本歷史時。
- **運作流程**：
  1. 將所有變更加入暫存區並分析差異。
  2. 若包含多個獨立任務，自動拆分為多個邏輯群組分次提交。
  3. 依據慣例式提交規則以繁體中文撰寫訊息，並加上 Google Antigravity 共同作者簽名。

### 3. 分支合併（Merge）

```text
/antigravity-git-flow:agy-git-flow:merge
```

- **使用情境**：功能或修復開發完成，準備整併回對應主分支時。
- **運作流程**：
  1. 自動依據當前分支類型決定合併目標（feature、release 與 hotfix 分支合併至 develop，加上 `--no-ff` 保留節點）。
  2. 若合併過程發生衝突，自動分析雙方分支歷史並嘗試排解衝突。
  3. 合併完成後詢問是否刪除原始分支。

### 4. 發布拉取請求（GitHub PR）

```text
/antigravity-git-flow:agy-git-flow:github-pr
```

- **使用情境**：從 release/* 或 hotfix/* 分支向 main 主分支發起程式碼審查時。
- **運作流程**：
  1. 檢查目前分支是否為 release/* 或 hotfix/*，並同步遠端狀態。
  2. 透過 `ask_question` 互動詢問拉取請求使用語言（繁體中文、英文、中英雙語對照）。
  3. 分析提交差異，自動萃取修改目的、變更摘要、變更類型與受影響元件，產出純文字無表情符號的結構化說明。
  4. 審查確認後透過 GitHub CLI（`gh pr create`）發布至 GitHub。

### 5. 遠端推播（Push）

```text
/antigravity-git-flow:agy-git-flow:push
```

- **使用情境**：將本地端變更與標籤同步上傳至遠端儲存庫時。
- **運作流程**：
  1. 推送前先執行 fetch 檢查遠端狀態。
  2. 確認本地未落後遠端後，執行 `git push -u origin HEAD --follow-tags`。

### 6. 遠端狀態擷取（Fetch）

```text
/antigravity-git-flow:agy-git-flow:fetch
```

- **使用情境**：擷取遠端最新變更與標籤，並在本地多軌快轉更新所有非當前分支時。
- **運作流程**：
  1. 執行 `git fetch --all --prune --tags` 下載全域最新物件。
  2. 掃描所有本地分支，針對非當前分支在背景進行本地安全快轉更新。
  3. 若遇分叉或衝突則安全略過，維持當前工作區完整性。

### 7. 遠端拉取（Pull）

```text
/antigravity-git-flow:agy-git-flow:pull
```

- **使用情境**：整合遠端最新進度至當前工作分支時。
- **運作流程**：
  1. 強制自動先執行 fetch，確保全域資料與非當前分支為最新狀態。
  2. 針對當前分支進行安全快轉拉取（`git pull --ff-only`）。
  3. 若因工作區髒污、分叉或衝突無法直接拉取，啟動 `ask_question` 選單提供排解建議。

### 8. 建立發布分支（Release）

```text
/antigravity-git-flow:agy-git-flow:release [vX.Y.Z]
```

- **使用情境**：開發階段告一段落，準備從 develop 切出發布測試週期時。
- **運作流程**：
  1. 分析未發布變更並推算語意化版本（Semantic Versioning）。
  2. 自動建立並切換至 `release/<版號>` 分支。
  3. 自動更新 `package.json`、`build.gradle` 等檔案中的版本號並建立提交。

### 9. 建立 GitHub Release

```text
/antigravity-git-flow:agy-git-flow:github-release
```

- **使用情境**：專案開發到達里程碑，準備在 GitHub 上建立正式發布說明時。
- **運作流程**：
  1. 確認版本號與上一個標籤之間的提交歷史。
  2. 依據慣例式提交分類（Feat, Fix, Refactor, Perf, Style, Test, Docs, Chore），產生中英文雙語變更日誌（無表情符號）與比對連結。
  3. 審查確認後透過 GitHub CLI（`gh release create`）正式發布。

### 10. 自動與手動版本標記（Tag）

```text
/antigravity-git-flow:agy-git-flow:tag [vX.Y.Z]
```

- **使用情境**：在 main 主分支完成合併後，為節點打上正式版本標籤時。
- **運作流程**：
  1. 檢查目前分支必須為 main 或 master。
  2. 依據語意化版本規範分析合併節點並計算版號。
  3. 建立 `vX.Y.Z` 標籤並引導推播至遠端。

### 11. 專案初始化（Init）

```text
/antigravity-git-flow:agy-git-flow:init
```

- **使用情境**：全新專案一鍵架設 Git Flow 基礎架構時。
- **運作流程**：
  1. 檢查或執行 `git init`。
  2. 建立初始提交。
  3. 建立標準的 main 與 develop 雙軌分支架構。

### 12. 說明文件智慧同步（Sync Readme）

```text
/antigravity-git-flow:agy-git-flow:sync-readme
```

- **使用情境**：全新建立、增量更新或結構重構專案的雙語說明文件時。
- **運作流程**：
  1. 解析專案配置檔、遠端儲存庫與 `skills/` 目錄。
  2. 自動判定執行模式（全新建立、增量更新或結構重構）。
  3. 依標準規格同步產生對稱的 `README.md`（英文）與 `README.zh-TW.md`（繁體中文）。

## 授權條款

本專案採用 MIT 授權條款釋出，詳情請參閱 [LICENSE](LICENSE) 檔案。
