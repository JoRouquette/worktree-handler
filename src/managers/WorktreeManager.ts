import * as path from 'path';
import * as fs from 'fs';
import { GitContext } from './GitContext';
import { Worktree } from '../types';
import { logger } from '../utils/logger';

export class WorktreeManager {
  private workspaceRoot: string;
  private gitContext: GitContext;
  private worktrees: Worktree[] = [];
  private currentWorktreeName: string | null = null;

  constructor(workspaceRoot: string, gitContext: GitContext) {
    this.workspaceRoot = workspaceRoot;
    this.gitContext = gitContext;
  }

  async detectWorktrees(): Promise<Worktree[]> {
    const branches = await this.gitContext.listBranches();
    const entries = fs.readdirSync(this.workspaceRoot, { withFileTypes: true });

    this.worktrees = entries
      .filter(
        (e) =>
          e.isDirectory() &&
          !e.name.startsWith('.') &&
          branches.includes(e.name)
      )
      .map((e) => ({
        name: e.name,
        path: path.join(this.workspaceRoot, e.name),
        isCurrent: e.name === this.currentWorktreeName,
      }));

    logger.info(`Detected ${this.worktrees.length} worktrees`);
    return this.worktrees;
  }

  getCurrentWorktree(): Worktree | null {
    return this.worktrees.find((w) => w.isCurrent) ?? null;
  }

  getWorktrees(): Worktree[] {
    return this.worktrees;
  }

  async switchWorktree(name: string): Promise<void> {
    const target = this.worktrees.find((w) => w.name === name);
    if (!target) {
      throw new Error(`Worktree '${name}' not found`);
    }
    this.currentWorktreeName = name;
    this.worktrees = this.worktrees.map((w) => ({ ...w, isCurrent: w.name === name }));
    logger.info(`Switched to worktree: ${name}`);
  }

  setCurrentWorktreeName(name: string): void {
    this.currentWorktreeName = name;
  }
}
