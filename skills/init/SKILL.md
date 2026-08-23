---
name: antigravity-git-flow:init
description: 一鍵為全新專案搭建 Git Flow 標準的 main 與 develop 雙軌分支架構。當使用者輸入 /antigravity-git-flow:init 時觸發。
---

# Git Flow 專案初始化（Init）

本技能旨在為新的 Git 儲存庫建立 Git Flow 的基礎雙軌分支。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/antigravity-git-flow:init`。
2. 當使用者要求「初始化 Git Flow」、「建立 main 和 develop」時。

## 執行的實作步驟

1. 第一步：檢查儲存庫狀態
   - 執行 `git status` 檢查是否為 Git 儲存庫。若不是，執行 `git init`。
   - 若已設定遠端儲存庫，先執行 `git fetch --all --prune` 確保取得遠端分支資訊。

2. 第二步：建立初始提交（若為空）
   - 檢查是否有任何 Commit。
   - 若完全空白，建立基礎的 `README.md`，並執行 `git add -A` 與 `git commit -m "chore: 初始化專案"`，附上共同作者簽名。

3. 第三步：設定 main 與 develop 分支
   - 將當前分支更名為 main（`git branch -m main`）。
   - 檢查 develop 分支：若遠端已有 origin/develop 則切換追蹤，否則從 main 切出 develop 分支（`git checkout -b develop`）。

4. 第四步：總結
   - 告知使用者專案已成功初始化為 Git Flow 架構，並已切換至 develop 分支準備開始開發。
