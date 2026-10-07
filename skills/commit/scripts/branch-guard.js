#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const [, , kind, name] = process.argv;
if (!kind || !name || !['feature', 'hotfix'].includes(kind)) {
  console.error('usage: branch-guard.js <feature|hotfix> <branch-name>');
  process.exit(1);
}

const safeGit = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};
const gitLoud = (args) => execFileSync('git', args, { stdio: 'inherit' });
const branchExists = (b) => {
  try {
    execFileSync('git', ['show-ref', '--verify', '--quiet', `refs/heads/${b}`]);
    return true;
  } catch {
    return false;
  }
};

const cur = safeGit(['symbolic-ref', '--short', 'HEAD']) || 'HEAD';
const curLower = cur.toLowerCase();

const targetBranch = (prefix, n) => (n.includes('/') ? n : `${prefix}/${n}`);

const create = (b) => {
  if (branchExists(b)) {
    console.log(`分支 ${b} 已存在，切換至該分支...`);
    gitLoud(['checkout', b]);
  } else {
    console.log(`建立分支 ${b}...`);
    gitLoud(['checkout', '-b', b]);
  }
};

if (curLower === 'main' || curLower === 'master') {
  if (kind === 'hotfix') {
    console.log(`在 ${cur} 上偵測到 hotfix 意圖...`);
    if (!branchExists('develop')) {
      console.log(`尚未存在 develop 分支，為符合 Git Flow 結構，先從 ${cur} 建立 develop`);
      create('develop');
      gitLoud(['checkout', cur]); // 切回 main / master
    }
    const hotfixBranch = targetBranch('hotfix', name);
    console.log(`從 ${cur} 建立或切換至 ${hotfixBranch}`);
    create(hotfixBranch);
  } else {
    const featBranch = targetBranch('feature', name);
    if (branchExists('develop')) {
      console.log(`目前在 ${cur}，為符合 Git Flow 規範，嘗試切換至 develop 後建立或切換至 ${featBranch}...`);
      try {
        gitLoud(['checkout', 'develop']);
        create(featBranch);
      } catch {
        console.warn('WARN: 因工作區變更無法切換至 develop，改由目前節點建立分支...');
        create(featBranch);
      }
    } else {
      console.log(`尚未存在 develop 分支，先建立 develop 後切出 ${featBranch}...`);
      create('develop');
      create(featBranch);
    }
  }
} else if (curLower === 'develop') {
  if (kind === 'hotfix') {
    console.warn(
      'WARN: 偵測到 hotfix 意圖，但目前在 develop。若需上線緊急修正，建議手動切到 main 後重試。此次以 feature 分支處理。'
    );
  }
  create(targetBranch('feature', name));
} else if (cur.startsWith('release/') || cur.startsWith('hotfix/')) {
  console.log(`已在 ${cur}，Git Flow 允許直接提交。`);
} else if (cur === 'HEAD') {
  console.warn('WARN: 目前處於分離標頭（Detached HEAD）狀態。');
  const branchName = targetBranch(kind, name);
  console.log(`從目前節點建立分支 ${branchName}...`);
  create(branchName);
} else {
  console.log(`已在分支 ${cur}，直接使用該分支提交。`);
}
