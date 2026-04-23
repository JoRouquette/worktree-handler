import * as vscode from 'vscode';
import { StatusBarManager } from './StatusBarManager';
import { WorktreeManager } from '../managers/WorktreeManager';
import { StateManager } from '../state/StateManager';
import { TerminalScriptHandler } from '../managers/TerminalScriptHandler';
import { logger } from '../utils/logger';

export class UIController {
  private statusBarManager: StatusBarManager;
  private worktreeManager: WorktreeManager;
  private stateManager: StateManager;
  private terminalScriptHandler: TerminalScriptHandler;

  constructor(
    worktreeManager: WorktreeManager,
    stateManager: StateManager,
    terminalScriptHandler: TerminalScriptHandler
  ) {
    this.worktreeManager = worktreeManager;
    this.stateManager = stateManager;
    this.terminalScriptHandler = terminalScriptHandler;
    this.statusBarManager = new StatusBarManager();
  }

  registerCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand('worktreeHandler.checkout', () => this.handleCheckout()),
      vscode.commands.registerCommand('worktreeHandler.refreshList', () => this.handleRefresh()),
      vscode.commands.registerCommand('worktreeHandler.showConfiguration', () =>
        this.handleShowConfig()
      ),
      { dispose: () => this.dispose() }
    );
  }

  async refresh(): Promise<void> {
    const worktrees = await this.worktreeManager.detectWorktrees();
    const current = this.worktreeManager.getCurrentWorktree();
    this.statusBarManager.update(current?.name ?? null);
    logger.info(`UI refreshed, ${worktrees.length} worktrees available`);
  }

  private async handleCheckout(): Promise<void> {
    const worktrees = this.worktreeManager.getWorktrees();

    if (worktrees.length === 0) {
      vscode.window.showWarningMessage('No worktrees detected. Try refreshing.');
      return;
    }

    const items = worktrees.map((w) => ({
      label: w.isCurrent ? `$(check) ${w.name}` : w.name,
      description: w.path,
      worktreeName: w.name,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a worktree to switch to',
    });

    if (!selected) {
      return;
    }

    await this.worktreeManager.switchWorktree(selected.worktreeName);
    await this.stateManager.saveCurrentWorktree(selected.worktreeName);
    this.terminalScriptHandler.generateScripts(selected.worktreeName);
    this.statusBarManager.update(selected.worktreeName);

    vscode.window.showInformationMessage(
      `Switched to worktree: ${selected.worktreeName}. Run: source .worktree-setup.sh`
    );
  }

  private async handleRefresh(): Promise<void> {
    await this.refresh();
    vscode.window.showInformationMessage('Worktree list refreshed.');
  }

  private handleShowConfig(): void {
    vscode.commands.executeCommand('workbench.action.openSettings', 'worktreeHandler');
  }

  dispose(): void {
    this.statusBarManager.dispose();
  }
}
