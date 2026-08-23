---
name: antigravity-git-flow:git-flow:release
description: 依照 Git Flow 規範從 develop 建立 release 分支，並具備 AI 跨平台智能版號更新能力（支援 package.json, build.gradle 等多種格式）。當使用者輸入 /antigravity-git-flow:git-flow:release 時觸發。
---

# 建立發布分支（Start Release）

本技能旨在為 Git Flow 的發布階段開啟全新的 release 分支，並自動更新專案版號。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/antigravity-git-flow:git-flow:release [vX.Y.Z]`。
2. 當使用者要求「開啟發布分支」、「準備 release」時。

## 執行的實作步驟

1. 第一步：防呆機制與狀態同步
   - 若專案設定有遠端儲存庫，先執行 `git fetch --all --tags --prune` 確保取得所有標籤與分支資訊。
   - 執行 `git branch --show-current` 確保位於 develop 分支。若不是，提示使用者並中斷。
   - 若遠端存在 origin/develop，執行 `git pull origin develop` 確保分支為最新狀態。

2. 第二步：判斷與確認版號
   - 若使用者在指令中指定版號，則使用該版號。
   - 若無指定，使用 `git log` 分析未發布變更，推算合理的語意化版本號（SemVer: vX.Y.Z）。

3. 第三步：建立 Release 分支
   執行 `git checkout -b release/<版號>`。

4. 第四步：跨平台版號智慧更新
   檢查專案目錄尋找常見的版號定義檔：
   - Node.js：若發現 package.json，執行 `npm version <新版號> --no-git-tag-version`。
   - Android：若發現 build.gradle 或 build.gradle.kts，找出 versionName 並替換。
   - Python：若發現 pyproject.toml 或 setup.py，找出 version 並替換。
   - iOS / macOS：若發現 Info.plist 或 project.pbxproj 且確定版號位置，替換版號。
   - 若無法確定或找不到版號檔：使用 `ask_question` 工具詢問是否需要手動更新。

5. 第五步：提交版號變更
   - 若有任何檔案更新，執行 `git add -A`，並以 `chore(release): bump version to <版號>` 提交，附上共同作者簽名。
   - 若無檔案更新，告知使用者發布分支建立完畢。
