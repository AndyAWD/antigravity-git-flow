# antigravity-git-flow

English | [繁體中文](README.zh-TW.md)

An Antigravity plugin for Google Antigravity (AGY), providing a complete automated Git Flow pipeline.

Comprehensive support across the three core platforms of Google Antigravity: Antigravity Command-Line Interface (CLI) (`agy`), Antigravity Integrated Development Environment (IDE), and Antigravity 2.0 Desktop Application.

This plugin automatically produces precise Git commits following the Conventional Commits v1.0.0 specification, orchestrating branch merging, Pull Request (PR) publication, bilingual GitHub Release notes, and automated bilingual documentation generation.

## Installation

Install the plugin globally using the Antigravity Command-Line Interface (CLI):

```bash
agy plugin install https://github.com/AndyAWD/antigravity-git-flow
```

## Key Features

1. **Seamless Cross-Platform Compatibility**: Fully compatible with Antigravity CLI terminal, IDE sidebar chat, and Antigravity 2.0 Chat Canvas.
2. **Auto Navigation & Flow Progression**: Designed for developers of all skill levels, AI automatically analyzes project state and advances to the next logical Git Flow step.
3. **Strict Conventional Commits Compliance**: Built-in prompt rules ensure consistent `<type>[scope]: <description>` structure and eliminate model hallucinations.
4. **Multi-Task Auto Splitting**: Automatically splits unrelated working tree changes into separate logical commits.
5. **Standardized Bilingual Documentation & Releases**: Integrated multi-language PR templates, bilingual GitHub Release changelogs, and automated README generation.
6. **Dedicated Co-Author Attribution**: Every automated commit includes Google Antigravity co-author attribution.

## Plugin Management

• List installed plugins:

  ```bash
  agy plugin list
  ```

• Enable this plugin:

  ```bash
  agy plugin enable antigravity-git-flow
  ```

• Disable this plugin:

  ```bash
  agy plugin disable antigravity-git-flow
  ```

• Uninstall this plugin:

  ```bash
  agy plugin uninstall antigravity-git-flow
  ```

## Directory Structure

```text
antigravity-git-flow/
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── plugin.json
├── package.json
├── LICENSE
├── README.md
├── README.zh-TW.md
├── templates/
│   ├── README.template.md
│   ├── README.zh-TW.template.md
│   ├── RELEASE.template.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── PULL_REQUEST_TEMPLATE.en.md
│   └── PULL_REQUEST_TEMPLATE.bilingual.md
└── skills/
    ├── auto-next/
    ├── commit/
    ├── fetch/
    ├── github-pr/
    ├── github-release/
    ├── init/
    ├── merge/
    ├── pull/
    ├── push/
    ├── release/
    ├── sync-readme/
    └── tag/
```

## Commands and Skills

Once installed, trigger capabilities using natural language prompts or dedicated slash commands:

### 1. Auto Navigation (Auto Next)

```text
/antigravity-git-flow:agy-git-flow:auto-next
```

- **When to Use**: When unsure of the next step, or wishing to automate the Git Flow progression.
- **How It Works**:
  1. Executes background remote fetch and safely fast-forwards non-current local branches.
  2. Verifies VCS initialization; runs init if not already set up.
  3. Checks working tree changes and automatically commits and pushes.
  4. Automatically advances merge, tag, or release based on current branch context.

### 2. Conventional Commits (Commit)

```text
/antigravity-git-flow:agy-git-flow:commit
```

- **When to Use**: When changes are ready to be committed to version history.
- **How It Works**:
  1. Stages changes and analyzes diffs.
  2. Splits multi-task changes into discrete logical commits.
  3. Generates Conventional Commit messages with Google Antigravity co-author trailer.

### 3. Branch Merge (Merge)

```text
/antigravity-git-flow:agy-git-flow:merge
```

- **When to Use**: When a feature, release, or hotfix branch is ready to merge.
- **How It Works**:
  1. Determines target branch by branch type (merging to develop with `--no-ff`).
  2. Resolves merge conflicts automatically when possible.
  3. Prompts whether to delete source branch upon completion.

### 4. Open Pull Request (GitHub PR)

```text
/antigravity-git-flow:agy-git-flow:github-pr
```

- **When to Use**: When opening a code review from release/* or hotfix/* to main.
- **How It Works**:
  1. Validates current branch is release/* or hotfix/* and synchronizes with remote.
  2. Interactively asks for preferred PR language via `ask_question` (Traditional Chinese, English, or Bilingual).
  3. Analyzes commit diffs to extract purpose, summary, change type, and affected components (no emojis).
  4. Reviews PR and publishes via GitHub CLI (`gh pr create`).

### 5. Remote Push (Push)

```text
/antigravity-git-flow:agy-git-flow:push
```

- **When to Use**: When pushing local commits and tags to remote repository.
- **How It Works**:
  1. Runs fetch first to inspect remote state.
  2. Executes `git push -u origin HEAD --follow-tags` after confirming branch is up to date.

### 6. Remote Fetch (Fetch)

```text
/antigravity-git-flow:agy-git-flow:fetch
```

- **When to Use**: When fetching latest remote refs and fast-forwarding non-current local branches.
- **How It Works**:
  1. Runs `git fetch --all --prune --tags` to download remote objects.
  2. Safely fast-forwards all non-current local branches.
  3. Skips diverged branches without affecting current workspace.

### 7. Remote Pull (Pull)

```text
/antigravity-git-flow:agy-git-flow:pull
```

- **When to Use**: When synchronizing remote commits into current working branch.
- **How It Works**:
  1. Mandates preliminary fetch for global state synchronization.
  2. Performs safe fast-forward pull (`git pull --ff-only`).
  3. Provides `ask_question` interactive troubleshooting menu if dirty or diverged.

### 8. Start Release Branch (Release)

```text
/antigravity-git-flow:agy-git-flow:release [vX.Y.Z]
```

- **When to Use**: When development cycle ends and release testing phase begins.
- **How It Works**:
  1. Calculates SemVer version bump from unreleased commits.
  2. Creates and checks out `release/<version>` branch.
  3. Automatically updates version strings in `package.json`, `build.gradle`, etc.

### 9. GitHub Release (Release Notes)

```text
/antigravity-git-flow:agy-git-flow:github-release
```

- **When to Use**: When cutting a new formal GitHub release.
- **How It Works**:
  1. Confirms version tag and retrieves commits since previous tag.
  2. Categorizes changes by commit type and produces bilingual changelog (no emojis) with compare link.
  3. Reviews and publishes via GitHub CLI (`gh release create`).

### 10. Tag Version (Tag)

```text
/antigravity-git-flow:agy-git-flow:tag [vX.Y.Z]
```

- **When to Use**: When tagging a released commit on main branch.
- **How It Works**:
  1. Restricts operation to main or master branch.
  2. Derives version number from SemVer rules.
  3. Creates `vX.Y.Z` annotated tag and guides remote push.

### 11. Repository Init (Init)

```text
/antigravity-git-flow:agy-git-flow:init
```

- **When to Use**: When scaffolding Git Flow branch structure for a new repository.
- **How It Works**:
  1. Initializes git repository if needed.
  2. Creates initial commit.
  3. Sets up dual-branch main and develop structure.

### 12. Bilingual Documentation Sync (Sync Readme)

```text
/antigravity-git-flow:agy-git-flow:sync-readme
```

- **When to Use**: When creating, updating, or refactoring bilingual README files.
- **How It Works**:
  1. Inspects workspace structure, manifests, and `skills/` directory.
  2. Automatically identifies execution mode (Create, Update, or Refactor).
  3. Synchronizes symmetric `README.md` (English) and `README.zh-TW.md` (Traditional Chinese) adhering to standard specifications.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
