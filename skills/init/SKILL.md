---
name: init
description: 一鍵為全新專案搭建 Git Flow 標準的 main 與 develop 雙軌分支架構。當使用者輸入 /antigravity-git-flow:init 時觸發。
---

# Git Flow 專案初始化 (Init)

本技能旨在為新的 Git 儲存庫建立 Git Flow 的基礎雙軌分支。

## 觸發時機
- 當使用者輸入 `/antigravity-git-flow:init` 或是要求「初始化 Git Flow」、「建立 main 和 develop」時。

## 執行流程

### Step 1: 檢查儲存庫狀態
- 執行 `git status` 檢查是否為一個 Git 儲存庫。若不是，執行 `git init`。
- 若專案已設定有遠端儲存庫（`git remote`），先執行 `git fetch --all --prune` 確保取得遠端分支資訊。

### Step 2: 建立初始提交 (若為空)
- 檢查是否有任何 Commit（例如 `git log -1`）。
- 若完全空白，建立一個空的提交或建立一個基礎的 `README.md`，並執行 `git add -A` 與 `git commit -m "chore: 初始化專案"`。記得附上 `Co-authored-by: Google Antigravity <242056456+google-antigravity@users.noreply.github.com>` 簽名。

### Step 3: 設定 main 與 develop 分支
1. 將當前分支更名為 `main` (`git branch -m main` 或 `git checkout -b main`)。若遠端已有 `origin/main`，可建立關聯。
2. 檢查 `develop` 分支：若遠端已有 `origin/develop` 則直接切換並追蹤（`git checkout develop`），否則從 `main` 切出 `develop` 分支 (`git checkout -b develop`)。

### Step 4: 總結
- 告知使用者專案已成功初始化為 Git Flow 架構，並已切換至 `develop` 分支準備開始開發。
