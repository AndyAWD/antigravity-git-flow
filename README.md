# conventional-commits-agy

一個為 Antigravity (agy) 設計的外掛，讓 Agy 依據 [慣例式提交（Conventional Commits）v1.0.0 繁體中文規範](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 自動產生 git commit，並整合 Git Flow 分支策略。

## 特色
- 📝 **符合慣例式提交規範**：`<type>[scope]: <描述>` 全部按規範。
- 🔀 **多任務自動拆分**：偵測到不相關的變更會自動分成多個 commit。
- 🌿 **整合 Git Flow**：`main`/`develop` 禁止直接提交，自動建立 `feature/*` 或 `hotfix/*`。
- 🤖 **Agy 專屬身份**：自動將 Author 與 Committer 設定為 `Google Antigravity`，保留 AI 協作痕跡。

## 安裝

透過 Agy CLI 安裝本外掛：

```bash
agy plugin install https://github.com/AndyAWD/conventional-commits-agy
```

## 使用方式

在 Agy 終端機中，執行以下指令：

```bash
/conventional-commits-agy:commit
```

Agy 將會自動：
1. 分析工作區的變更。
2. 進行自動任務分組。
3. 若需要，進行分支檢查並向您確認（透過 `ask_question` 對話方塊）。
4. 產生符合規範的 commit 並提交。
