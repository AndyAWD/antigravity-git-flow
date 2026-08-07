# git-flow-agy

一個為 Antigravity (agy) 設計的外掛，提供完整的 Git Flow 自動化工作管線。
本外掛不僅能讓 Agy 依據 [慣例式提交（Conventional Commits）v1.0.0 繁體中文規範](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 自動產生精確的 Git Commit，更補齊了分支合併、Pull Request 發布，以及推播等 Git Flow 的關鍵環節。

## 特色
- 🧠 **自動模式與智慧導航**：專為不熟悉 Git 的使用者設計，AI 會自動分析專案狀態，並主動幫您推進到下一個合理的 Git Flow 步驟。
- 📝 **符合慣例式提交規範**：確保 `<type>[scope]: <描述>` 格式統一，且描述一律採用繁體中文。
- 🔀 **多任務自動拆分**：偵測到不相關的變更時，會聰明地將其拆分為多個獨立 Commit。
- 🌿 **自動化的 Git Flow**：`main` / `develop` 禁止直接提交，強制或自動幫您建立 `feature/*` 或 `hotfix/*` 分支。
- 🤖 **Agy 專屬身分**：所有自動建立的 Commit，其 Author 皆為 `Google Antigravity`，清楚區分人工與 AI 協作痕跡。

## 安裝

透過 Agy CLI 安裝本外掛：

```bash
agy plugin install https://github.com/AndyAWD/git-flow-agy
```

## 核心技能 (Skills)

安裝完成後，您可以在對話中直接透過語意呼叫，或是輸入以下對應的斜線指令（Slash Commands）來觸發功能：

### 1. 智慧導航 (Auto Next)

````text
/git-flow-agy:auto-next
````
**情境**：不知下一步該做什麼，或完全不懂 Git，想要 AI 自動幫您判斷與推進。
**運作邏輯**：
專為不熟悉 Git 的使用者設計的「自動模式」。AI 會自動分析專案當前狀態（如未提交變更、未推送進度、目前所在分支），並決定下一步最適合的 Git Flow 操作（如初始化、提交、推播或發布），並在執行前以白話文向您報備，主動引導您完成整個開發與發布週期。

### 2. 慣例式提交

````text
/git-flow-agy:commit
````
**情境**：開發告一段落，準備將變更寫入版本歷史時。
**運作邏輯**：
1. **全面暫存**：執行 `git add -A` 將所有變更加入暫存區。
2. **分析與拆分**：分析當前差異（diff），若包含多個獨立任務，會自動將其拆分為多個邏輯群組。
3. **分支守門員**：檢查目前所在分支。若在 `main` 開發新功能，會自動建立 `develop` 並切換至 `feature/<功能>`；若為緊急修復，則切換至 `hotfix/<問題>`。若有風險則會中斷並詢問您的意圖。
4. **精確提交**：針對各組任務，分次 `git reset` 後精準 `git add`，並撰寫具備繁體中文描述的規範化訊息進行提交。

### 3. 分支合併

````text
/git-flow-agy:merge
````
**情境**：功能或修復開發完成，準備整併回主要分支時。
**運作邏輯**：
自動依據當前分支所屬類型，決定合併的目標：
- **`feature/*`、`release/*` 與 `hotfix/*` 分支**：自動切換至 `develop` 並合併，加上 `--no-ff` 保留節點。（註：因 release 與 hotfix 合併至 main 係由 PR 網頁端處理，此處僅專注於本地合併至 develop 的同步作業）
*(若合併過程發生衝突，Agy 會自動查看雙方分支的歷史紀錄，並嘗試為您自動解決衝突後完成合併。)*

### 4. 發布 Pull Request

````text
/git-flow-agy:github-pr
````
**情境**：合併到主分支前，需要透過 GitHub 進行 Code Review 時。
**運作邏輯**：
1. **分支與環境檢查**：限制只能從 `release/*` 或 `hotfix/*` 分支發起（目標皆為 `main`）。同時檢查本機是否已安裝 GitHub CLI (`gh`) 且處於已登入狀態。
2. **內容自動總結**：比較當前分支與目標分支的差異與近期的 commit 紀錄，自動提煉出本次 PR 的精華。
3. **建立 PR**：透過 `gh pr create` 以繁體中文撰寫標題與描述，將變更發布至 GitHub，供團隊審閱。

### 5. 遠端推播

````text
/git-flow-agy:push
````
**情境**：需要將本地端的變更同步上傳至 GitHub 遠端儲存庫時。
**運作邏輯**：
偵測當前分支並執行 `git push`。若發現遠端尚未建立該分支，會自動帶上 `-u` (即 `--set-upstream`) 參數（如 `git push -u origin <branch>`），幫助您無縫設定本地與遠端的追蹤關聯。

### 6. 建立發布分支 (Start Release)

````text
/git-flow-agy:release [vX.Y.Z]
````
**情境**：開發階段告一段落，準備從 `develop` 開啟發布測試週期時。
**運作邏輯**：
1. **版本推算**：分析 `develop` 上未發布的變更，推算下一個合理的 SemVer 版號（或採用手動指定的版號）。
2. **分支建立**：自動切換並建立 `release/<版號>` 分支。
3. **跨平台智能版號更新**：AI 會發揮跨語言優勢，自動尋找專案中的版號定義檔（如 Node.js 的 `package.json`、Android 的 `build.gradle`、Python 的 `pyproject.toml` 等）並將其更新為新版號。
4. **自動提交**：自動建立 `chore(release): bump version to <版號>` 提交，並附上 `Co-authored-by` 簽名。

### 7. 建立 GitHub Release

````text
/git-flow-agy:github-release
````
**情境**：專案開發到一個里程碑，準備在 GitHub 上發布新版本時。
**運作邏輯**：
1. **版本號確認**：向您確認即將發布的版本號（Tag，例如 `v1.8.0`）。
2. **自動 Changelog**：比對上一個版本到目前的 commit 差異，自動整理、分類並翻譯成標準化的中英文雙語發布說明（Release Notes）。
3. **發布至 GitHub**：檢查 GitHub CLI 登入狀態後，透過 `gh release create` 自動建立 Release，包含排版精美的雙語內容。

### 8. 自動與手動版本標記

````text
/git-flow-agy:tag [vX.Y.Z]
````
**情境**：在主要分支完成發布，需要依照規範打上版號標記時。
**運作邏輯**：
- **防呆機制**：嚴格限制僅能在 `main` 或 `master` 分支執行，否則將拒絕操作。
- **手動模式**：若指令後方帶有版號（如 `v1.2.3`），AI 將跳過分析，直接在最新節點打上該標籤。
- **自動模式**：若未指定版號，AI 會自動分析未打上標籤的合併節點。回溯合併分支的歷史，並嚴格遵循 [語意化版本 2.0.0](https://semver.org/lang/zh-TW/) 規範判斷應該增加 MAJOR、MINOR 還是 PATCH。
- **多節點補齊**：當發現多筆遺漏標記的合併節點時，會主動使用對話框詢問您要標記最新節點還是全部補齊。
- **格式保證**：所有的版本號產出皆會統一以小寫 `v` 開頭（例如 `v2.0.0`）。

### 9. 專案初始化 (Init)

````text
/git-flow-agy:init
````
**情境**：建立了一個全新專案，需要一鍵架設 Git Flow 基礎架構時。
**運作邏輯**：
- 自動檢查或執行 `git init`。
- 建立初始的空 Commit (或 `README.md`)。
- 自動建立標準的 `main` 與 `develop` 雙軌分支，並為您停留在 `develop` 準備開始開發。
