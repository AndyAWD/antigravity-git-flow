#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

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

const isCompliantBranch = (b) => {
  const lower = b.toLowerCase();
  return lower.startsWith('feature/') || lower.startsWith('release/') || lower.startsWith('hotfix/');
};

const validKinds = ['feature', 'hotfix', 'release', 'direct'];

const [, , kind, name] = process.argv;

if (!kind) {
  if (isCompliantBranch(cur)) {
    console.log(`已在合規工作分支 ${cur}，允許直接提交。`);
    process.exit(0);
  }
  console.error('usage: branch-guard.js <feature|hotfix|release|direct> [branch-name]');
  process.exit(1);
}

if (!validKinds.includes(kind)) {
  console.error('usage: branch-guard.js <feature|hotfix|release|direct> [branch-name]');
  process.exit(1);
}

if (kind !== 'direct' && !name) {
  console.error('usage: branch-guard.js <feature|hotfix|release|direct> <branch-name>');
  process.exit(1);
}

if (kind === 'direct') {
  if (curLower === 'main' || curLower === 'master') {
    console.log(`已確認直接在 ${cur} 主分支上進行提交。`);
  } else {
    console.log(`已確認直接在 ${cur} 分支上進行提交。`);
  }
  process.exit(0);
}

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
  } else if (kind === 'release') {
    const relBranch = targetBranch('release', name);
    if (branchExists('develop')) {
      console.log(`目前在 ${cur}，為符合 Git Flow 規範，嘗試切換至 develop 後建立或切換至 ${relBranch}...`);
      try {
        gitLoud(['checkout', 'develop']);
        create(relBranch);
      } catch {
        console.warn('WARN: 因工作區變更無法切換至 develop，改由目前節點建立分支...');
        create(relBranch);
      }
    } else {
      console.log(`尚未存在 develop 分支，先建立 develop 後切出 ${relBranch}...`);
      create('develop');
      create(relBranch);
    }
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
    create(targetBranch('feature', name));
  } else if (kind === 'release') {
    create(targetBranch('release', name));
  } else {
    create(targetBranch('feature', name));
  }
} else if (isCompliantBranch(cur)) {
  const desiredBranch = targetBranch(kind, name);
  if (cur === desiredBranch) {
    console.log(`已在合規工作分支 ${cur}，Git Flow 允許直接提交。`);
  } else if (branchExists(desiredBranch)) {
    console.log(`分支 ${desiredBranch} 已存在，切換至該分支...`);
    gitLoud(['checkout', desiredBranch]);
  } else {
    if (kind === 'hotfix') {
      const mainBranch = branchExists('main') ? 'main' : (branchExists('master') ? 'master' : cur);
      console.log(`目前在 ${cur}，依據 Git Flow 規範，hotfix 分支必須從 ${mainBranch} 切出。嘗試切換至 ${mainBranch}...`);
      try {
        gitLoud(['checkout', mainBranch]);
        create(desiredBranch);
      } catch {
        console.warn(`WARN: 因工作區變更無法切換至 ${mainBranch}，改由目前節點建立分支...`);
        create(desiredBranch);
      }
    } else {
      if (branchExists('develop')) {
        console.log(`目前在 ${cur}，依據 Git Flow 規範，${kind} 分支必須從 develop 切出。嘗試切換至 develop...`);
        try {
          gitLoud(['checkout', 'develop']);
          create(desiredBranch);
        } catch {
          console.warn('WARN: 因工作區變更無法切換至 develop，改由目前節點建立分支...');
          create(desiredBranch);
        }
      } else {
        create(desiredBranch);
      }
    }
  }
} else if (cur === 'HEAD') {
  console.warn('WARN: 目前處於分離標頭（Detached HEAD）狀態。');
  const branchName = targetBranch(kind, name);
  console.log(`從目前節點建立分支 ${branchName}...`);
  create(branchName);
} else {
  console.log(`已在分支 ${cur}，直接使用該分支提交。`);
}
