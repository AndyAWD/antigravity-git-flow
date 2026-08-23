---
name: antigravity-git-flow:release
description: 依照 Git Flow 規範從 develop 建立 release 分支，並具備 AI 跨平台智能版號更新能力（支援 package.json, build.gradle 等多種格式）。當使用者輸入 /antigravity-git-flow:release 時觸發。
---

# Git Flow 建立發布分支 (Start Release)

本技能旨在為 Git Flow 的發布階段開啟全新的 `release` 分支，並會透過 AI 尋找專案中的版號檔案，自動將其更新。

## 觸發時機
- 當使用者輸入 `/antigravity-git-flow:release [vX.Y.Z]` 或要求「開啟發布分支」、「準備 release」時。

## 執行流程（嚴格依序執行）

### Step 1: 防呆機制與狀態同步
- 若專案設定有遠端儲存庫（`git remote`），先執行 `git fetch --all --tags --prune` 確保本機擁有遠端所有的標籤 (Tags) 與分支資訊。
- 執行 `git branch --show-current` 確保使用者位於 `develop` 分支。若不是，請提示使用者並中斷執行。
- 若遠端存在 `origin/develop`，執行 `git pull origin develop` 確保分支處於最新狀態。

### Step 2: 判斷與確認版號
- 若使用者在指令中指定了版號（如 `/antigravity-git-flow:release v1.2.0`），則使用該版號。
- 若無指定，請使用 `git log` 分析自上一個 Tag 以來的新功能與修復，推算下一個合理的 SemVer (vX.Y.Z) 版號。

### Step 3: 建立 Release 分支
- 執行 `git checkout -b release/<版號>`。

### Step 4: 跨平台版號智能更新 (AI Agentic Bumping)
由於這是一個跨平台工具，請**不要寫死只更新某一種檔案**，而是發揮您的 AI 分析與檔案修改能力：
- 檢查專案目錄（可使用檔案清單工具）尋找常見的版號定義檔。
- **Node.js**: 若發現 `package.json`，請執行 `npm version <新版號> --no-git-tag-version`。
- **Android**: 若發現 `build.gradle` 或 `build.gradle.kts`，請找出 `versionName` 屬性並使用修改檔案工具進行替換。
- **Python**: 若發現 `pyproject.toml` 或 `setup.py`，請尋找 `version` 並進行替換。
- **iOS/macOS**: 若發現 `Info.plist` 或 `project.pbxproj` 且確定版號位置，請替換版號。
- **若無法確定或找不到版號檔**：使用 `ask_question` 工具詢問使用者是否需要手動幫忙更新特定檔案內的版號。

### Step 5: 提交版號變更
- 若有任何版號檔案被更新，請執行 `git add -A`，並以 `chore(release): bump version to <版號>` 提交，**請務必在訊息最下方加上 `Co-authored-by: Google Antigravity <242056456+google-antigravity@users.noreply.github.com>` 簽名**。
- 若無檔案更新，請告知使用者「發布分支建立完畢，未偵測到需要自動更新的版號檔案」。
