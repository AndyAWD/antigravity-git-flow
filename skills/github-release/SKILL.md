---
name: github-release
description: 建立 GitHub Release。自動擷取 commit 紀錄產生中英文雙語 Changelog。當使用者輸入 /antigravity-git-flow:github-release 時觸發。
---
# Release

## 何時使用此 Skill
- 當使用者輸入 `/antigravity-git-flow:github-release`
- 提及「幫我建立 release」、「發布版本」等字眼時。

## 執行流程與限制
1. **確認版本號**：
   - 呼叫 `ask_question` 工具詢問使用者要發布的版本號（例如 `v1.8.0`）。可提供選項或讓使用者自行輸入。

2. **擷取 Commit 紀錄**：
   - 找出上一個 tag：執行 `git describe --tags --abbrev=0`（若尚無 tag，則獲取所有 commit）。
   - 獲取期間內的 commit 紀錄：執行 `git log <上一個 tag>..HEAD --oneline` 或其他適合的格式。

3. **Changelog 產生與翻譯**：
   - 分析並整理這些 commit，將其分類（如 Feat, Fix, Refactor, Style, Test, Docs 等）。
   - 產生以下格式的中英文雙語 Changelog：
     ```markdown
     ### What's Changed

     #### 🇺🇸 English
     - **Feat:** [英文描述] by @[GitHub 帳號]
     - **Fix:** [英文描述] by @[GitHub 帳號]

     #### 🇹🇼 繁體中文
     - **新功能:** [繁體中文描述] by @[GitHub 帳號]
     - **修正:** [繁體中文描述] by @[GitHub 帳號]
     ```
   - *提示*：GitHub 帳號可從 commit 作者中解析；若無法取得，可預設為該專案作者，或是保留原本的 Author 名稱。

4. **環境檢查與建立 Release**：
   - 執行 `gh auth status` 檢查是否已安裝 GitHub CLI 且已完成登入。
   - **若已安裝且已登入**：
     - 使用產生的 Changelog，執行指令建立 Release：
       `gh release create <版本號> --title "<版本號>" --notes "<Changelog 內容>"`
   - **若未安裝或未登入**：
     - 停止後續所有動作。
     - 以明顯的提示訊息告知使用者：「請先安裝 GitHub CLI (gh) 並執行 \`gh auth login\` 完成登入後，再重新執行指令。」
