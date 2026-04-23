import * as path from 'path';
import * as fs from 'fs';

export function isValidWorktreeRoot(dirPath: string): boolean {
  const gitFilePath = path.join(dirPath, '.git');
  const bareRepoPath = path.join(dirPath, '.bare');

  if (!fs.existsSync(gitFilePath) || !fs.existsSync(bareRepoPath)) {
    return false;
  }

  try {
    const content = fs.readFileSync(gitFilePath, 'utf-8').trim();
    return content === 'gitdir: ./.bare';
  } catch {
    return false;
  }
}

export function isValidWorktreeName(name: string): boolean {
  return /^[a-zA-Z0-9_\-./]+$/.test(name) && !name.startsWith('.');
}
