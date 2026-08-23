---
name: antigravity-git-flow:tag
description: 依據 SemVer 2.0.0 規範，分析 main 或 master 分支上未標籤的合併節點，自動判斷版號並打上 vX.Y.Z 格式的 Tag。支援手動指定版號。若不在主分支則拒絕執行。當發現多個未標籤合併節點時，會詢問使用者範圍。當使用者輸入 /antigravity-git-flow:tag 時觸發。
---

# 自動版號標記（SemVer Tagging）

本技能旨在為 main（或 master）分支的合併節點打上版本號 Tag。

## 什麼時候觸發此技能？

1. 當使用者輸入 `/antigravity-git-flow:tag`。
2. 當使用者要求「打 tag」、「自動判斷版號」時。

## 執行的實作步驟

1. 第一步：防呆機制與標籤同步
   - 若專案設定有遠端儲存庫，先執行 `git fetch --all --tags --prune` 確保取得所有標籤與提交歷史。
   - 執行 `git branch --show-current` 檢查當前分支。
   - 若當前分支不是 main 或 master，立即中斷流程，並告知使用者需先切換分支。
   - 若主分支落後遠端，先執行 `git pull --ff-only` 確保為最新狀態。

2. 第二步：檢查手動指定版號
   - 若使用者明確提供版號（例如 `/antigravity-git-flow:tag v1.2.3`）。
   - 直接跳過後續分析，使用指令 `git tag <手動版號>` 打上標籤，提示推播後結束流程。

3. 第三步：找出未標籤的合併節點
   - 使用 `git log --merges main` 找出所有合併節點。
   - 比對現有 Tag，過濾出尚未被打上 Tag 的節點。

4. 第四步：處理多個未標籤節點（ask_question）
   - 若只有一個節點，直接進入第五步。
   - 若有多個節點，使用 `ask_question` 工具確認範圍：
     ```json
     {
       "questions": [
         {
           "question": "發現多個未標籤的合併節點，請問要標籤哪種範圍？",
           "options": ["(Recommended) 僅把最近的一次合併節點打上版本號", "全部的合併節點都要打上標籤"],
           "is_multi_select": false
         }
       ],
       "toolSummary": "確認標籤範圍",
       "toolAction": "詢問要標籤幾個合併節點"
     }
     ```

5. 第五步：版號判斷（SemVer 2.0.0）
   針對每個確定要打 Tag 的合併節點：
   - 分析該合併節點的變更歷史。
   - 依據 SemVer 2.0.0 進行判斷：
     1. MAJOR（X.y.z）：破壞性變更時遞增。
     2. MINOR（x.Y.z）：向下相容新功能時遞增。
     3. PATCH（x.y.Z）：向下相容錯誤修復時遞增。
   - 與前一個 Tag 加算，最終版號必須加上 `v` 前綴（例如 `v1.3.0`）。

6. 第六步：執行標記與說明
   - 執行 `git tag <版號> <合併節點的 hash>`。
   - 總結標記結果，並從技能列表中讀取執行 `antigravity-git-flow:push`（或 `push`）技能推播標籤至遠端。
