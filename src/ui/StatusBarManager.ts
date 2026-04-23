import * as vscode from 'vscode';

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = 'worktreeHandler.checkout';
    this.statusBarItem.tooltip = 'Click to switch worktree';
  }

  update(worktreeName: string | null): void {
    this.statusBarItem.text = `$(git-branch) ${worktreeName ?? 'No worktree'}`;
    this.statusBarItem.show();
  }

  hide(): void {
    this.statusBarItem.hide();
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
