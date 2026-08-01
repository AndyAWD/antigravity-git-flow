#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const msg = process.argv[2];
if (!msg) {
  console.error('usage: commit.js "<full commit message>"');
  process.exit(1);
}

// 根據使用者全域規則，強制指定 Author 與 Committer 為 Google Antigravity
execFileSync('git', ['commit', '-m', msg], {
  stdio: 'inherit',
  env: {
    ...process.env,
    GIT_AUTHOR_NAME: 'Google Antigravity',
    GIT_AUTHOR_EMAIL: '242056456+google-antigravity@users.noreply.github.com',
    GIT_COMMITTER_NAME: 'Google Antigravity',
    GIT_COMMITTER_EMAIL: '242056456+google-antigravity@users.noreply.github.com',
  },
});
