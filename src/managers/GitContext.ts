import * as path from 'path';
import * as fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';

export class GitContext {
  private workspaceRoot: string;
  private git: SimpleGit | null = null;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  getBareRepoPath(): string {
    return path.join(this.workspaceRoot, '.bare');
  }

  isBareRepoValid(): boolean {
    const bareRepoPath = this.getBareRepoPath();
    const gitFilePath = path.join(this.workspaceRoot, '.git');

    if (!fs.existsSync(bareRepoPath) || !fs.existsSync(gitFilePath)) {
      return false;
    }

    try {
      const gitFileContent = fs.readFileSync(gitFilePath, 'utf-8').trim();
      return gitFileContent === 'gitdir: ./.bare';
    } catch {
      return false;
    }
  }

  async listBranches(): Promise<string[]> {
    const git = this.getGitInstance();
    if (!git) {
      return [];
    }
    try {
      const result = await git.branch(['--list']);
      return result.all.map(b => b.replace(/^\*?\s+/, '').trim());
    } catch {
      return [];
    }
  }

  private getGitInstance(): SimpleGit | null {
    if (!this.git) {
      const bareRepoPath = this.getBareRepoPath();
      if (fs.existsSync(bareRepoPath)) {
        this.git = simpleGit(bareRepoPath);
      }
    }
    return this.git;
  }
}
