import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger';

const WORKTREE_STATE_FILE = '.vscode/.worktree-state';
const LAST_WORKTREE_KEY = 'lastWorktree';

export class StateManager {
  private context: vscode.ExtensionContext;
  private workspaceRoot: string;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.context = context;
    this.workspaceRoot = workspaceRoot;
  }

  async saveCurrentWorktree(name: string): Promise<void> {
    await this.context.globalState.update(LAST_WORKTREE_KEY, name);
    this.writeWorktreeStateFile(name);
    logger.info(`State saved: current worktree = ${name}`);
  }

  getLastWorktree(): string | undefined {
    return this.context.globalState.get<string>(LAST_WORKTREE_KEY);
  }

  readWorktreeStateFile(): string | null {
    const stateFilePath = path.join(this.workspaceRoot, WORKTREE_STATE_FILE);
    try {
      return fs.readFileSync(stateFilePath, 'utf-8').trim();
    } catch {
      return null;
    }
  }

  private writeWorktreeStateFile(name: string): void {
    const vscodeDir = path.join(this.workspaceRoot, '.vscode');
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(this.workspaceRoot, WORKTREE_STATE_FILE),
      name,
      'utf-8'
    );
  }
}
