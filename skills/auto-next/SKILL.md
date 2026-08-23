---
name: antigravity-git-flow:git-flow:auto-next
description: 專為不熟悉 Git 的使用者設計的自動模式，AI 會自動分析專案當前狀態，並決定下一步最適合的 Git Flow 操作（如初始化、提交、推播或發布），並主動引導。
---

# auto-next 技能指令

## 什麼是此技能的目標？

當使用者輸入 `/antigravity-git-flow:git-flow:auto-next`，或是表達「我接下來要做什麼」、「自動幫我推進」時，請扮演貼心的版本控制管家，自動分析當前工作區狀態並執行最合適的 Git Flow 操作。

## 執行的階段與判斷邏輯

請依序由高至低檢查以下狀態，只要符合條件，就直接執行對應的行動。請在背景安靜檢查，不要將生硬的指令輸出給使用者，只需用親切白話文說明即將執行的動作。

1. 階段零：遠端狀態更新（Remote Fetch）
   - 條件：若當前專案為 Git 儲存庫且設定有遠端儲存庫（`git remote` 有輸出）。
   - 行動：在背景執行 `git fetch --all --prune --tags`，確保本地取得遠端最新進度與標籤資訊。

2. 階段一：基礎建設（Infrastructure）
   - 條件：執行 `git status` 失敗（代表沒有 `.git` 目錄），或是缺少 main 或 develop 分支。
   - 行動：向使用者說明「目前專案還沒設定好版本控制」，接著從技能列表中讀取並執行 `antigravity-git-flow:git-flow:init`（或 `init`）技能。

3. 階段二：保護工作進度（Save Progress）
   - 條件：工作區有修改、新增或刪除的檔案。
   - 行動：向使用者說明「發現您有寫好的新程式碼，我先幫您把進度存起來！」，接著從技能列表中讀取並執行 `antigravity-git-flow:git-flow:commit`（或 `commit`）技能。

4. 階段三：同步與協作（Sync）
   - 條件：工作區乾淨，但本地分支落後遠端（behind remote）。
   - 行動：向使用者說明「發現雲端有新進度，先幫您同步更新下來！」，並執行 `git pull`（或 `git pull --rebase`）同步。
   - 條件：工作區乾淨，但本地分支超前遠端（ahead of remote），或是遠端尚未建立該分支。
   - 行動：向使用者說明「您的程式碼已經存好了，現在幫您備份到雲端！」，接著從技能列表中讀取並執行 `antigravity-git-flow:git-flow:push`（或 `push`）技能。

5. 階段四：流程推進（Flow Progression）
   - 條件：目前在 feature/* 分支上，工作區乾淨且已同步。
   - 行動：代表新功能開發完成，向使用者說明即將進行合併，並讀取執行 `antigravity-git-flow:git-flow:merge`（或 `merge`）技能。
   - 條件：目前在 release/* 或 hotfix/* 分支上，且工作區乾淨已同步。
   - 行動：代表發布前的測試或修復已完成，向使用者說明即將進行合併與發布確認，並讀取執行 `antigravity-git-flow:git-flow:merge`（或 `merge`）技能。
   - 條件：目前在 main 或 master 分支上，且有最新合併紀錄尚未打標籤（Tag）。
   - 行動：代表剛發布了新版本，讀取並執行 `antigravity-git-flow:git-flow:tag`（或 `tag`）技能，接著建議執行 `antigravity-git-flow:git-flow:github-release`。

6. 階段五：迷航求助（Fallback）
   - 條件：目前狀態非常健康（在 develop 且一切同步），沒有明顯的下一步。
   - 行動：使用 `ask_question` 工具顯示互動選單，詢問使用者想做什麼：
     - 標題：「目前的專案狀態很健康，都已經妥善儲存囉！接下來您想做什麼呢？」
     - 選項：
       1. (Recommended) 開發新功能（建立 feature 分支）
       2. 準備發布新版本（執行 release 技能）
       3. 修復緊急 Bug（建立 hotfix 分支）
       4. 從雲端更新程式碼（執行 git pull）

## 溝通準則

1. 保持安心感：在執行任何動作前，先用一句話報備，讓使用者清楚知道下一步動作。
2. 保持白話：避免拋出冗長的終端機錯誤，轉化為易懂的建議。
