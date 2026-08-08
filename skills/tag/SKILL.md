---
name: tag
description: 依據 SemVer 2.0.0 規範，分析 main 或 master 分支上未標籤的合併節點，自動判斷版號並打上 vX.Y.Z 格式的 Tag。支援手動指定版號。若不在主分支則拒絕執行。當發現多個未標籤合併節點時，會詢問使用者範圍。當使用者輸入 /git-flow-agy:tag 時觸發。
---

# Git Flow Tag 自動版號標記 (SemVer 2.0.0)

本技能旨在為 `main` (或 `master`) 分支的合併節點打上版本號 Tag。

## 觸發時機
- 當使用者輸入 `/git-flow-agy:tag` 或要求「打 tag」、「自動判斷版號」時。

## 執行流程（嚴格依序執行）

### Step 1: 防呆機制 (Branch Guard)
- 首先執行 `git branch --show-current` 檢查當前分支。
- 如果當前分支**不是** `main` 或 `master`，請**立即中斷流程**，並告訴使用者：「標記版本號必須在 `main` 或 `master` 分支上執行，請先切換分支。」

### Step 2: 檢查手動指定版號 (Manual Override)
- 如果使用者在呼叫技能時有明確提供版號（例如：`/git-flow-agy:tag v1.2.3` 或「幫我打 tag v1.2.3」）。
- 請直接跳過後續的 SemVer 分析，使用指令 `git tag <手動版號>` 在當前最新的節點打上標籤，並提示使用者可推播 (`git push --tags`)，然後結束流程。

### Step 3: 找出未標籤的合併節點 (僅限自動推算模式)
- 使用 `git log --merges main` 找出所有的合併節點。
- 比對現有 Tag，過濾出**尚未**被打上 Tag 的合併節點。

### Step 4: 處理多個未標籤節點 (ask_question)
- 若只有一個未標籤的合併節點，直接進入 Step 5。
- 若有「多個」未標籤的合併節點，**必須**使用 `ask_question` 工具向使用者確認：
  ```json
  {
    "questions": [
      {
        "question": "發現多個未標籤的合併節點，請問要標籤哪種範圍？",
        "options": ["僅把最近的一次合併節點打上版本號", "全部的合併節點都要打上標籤"],
        "is_multi_select": false
      }
    ],
    "toolSummary": "確認標籤範圍",
    "toolAction": "詢問要標籤幾個合併節點"
  }
  ```

### Step 5: 版號判斷 (SemVer 2.0.0)
針對每一個確定要打 Tag 的合併節點：
- 使用 `git log <前一個Tag>..<合併節點>` 或分析該合併節點的歷史，確認該版本包含了哪些變更。
- 依據 **SemVer 2.0.0** 進行判斷：
  1. **MAJOR (X.y.z)**: 當有不相容的 API 變更、破壞性變更 (BREAKING CHANGE) 時遞增。
  2. **MINOR (x.Y.z)**: 當加入向下相容的新功能 (feat) 時遞增。
  3. **PATCH (x.y.Z)**: 當加入向下相容的錯誤修正 (fix)、優化或重構等微小變動時遞增。
- 取得系統中前一個最新的 Tag，將判斷結果與其進行加算。
- **重要：最終產出的版號必須加上 `v` 前綴**（例如 `v1.3.0`），絕不可僅產出數字。

### Step 6: 執行標記與說明
- 對於每個確定好的新版號，執行 `git tag <版號> <合併節點的 hash>`。
- 執行完成後，向使用者總結打上了哪些 Tag，並請從您的 `<skills>` 列表中找出 `push` 技能，讀取並執行其邏輯，以將標籤同步至遠端。
