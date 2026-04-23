import * as vscode from 'vscode';
import { GitContext } from './managers/GitContext';
import { WorktreeManager } from './managers/WorktreeManager';
import { TerminalScriptHandler } from './managers/TerminalScriptHandler';
import { UIController } from './ui/UIController';
import { StateManager } from './state/StateManager';
import { logger } from './utils/logger';
import { isValidWorktreeRoot } from './utils/validators';

let uiController: UIController | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  logger.info('Worktree Handler activating...');

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    logger.warn('No workspace folder found, extension will not activate');
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const config = vscode.workspace.getConfiguration('worktreeHandler');

  if (!config.get<boolean>('enable', true)) {
    logger.info('Extension disabled via configuration');
    return;
  }

  if (!isValidWorktreeRoot(workspaceRoot)) {
    logger.info('Not a bare-worktree repository (.git → .bare not found), extension inactive');
    return;
  }

  const gitContext = new GitContext(workspaceRoot);
  const worktreeManager = new WorktreeManager(workspaceRoot, gitContext);
  const stateManager = new StateManager(context, workspaceRoot);
  const terminalScriptHandler = new TerminalScriptHandler(workspaceRoot);

  uiController = new UIController(worktreeManager, stateManager, terminalScriptHandler);
  uiController.registerCommands(context);

  const lastWorktree =
    stateManager.getLastWorktree() ?? stateManager.readWorktreeStateFile() ?? undefined;
  if (lastWorktree) {
    worktreeManager.setCurrentWorktreeName(lastWorktree);
  }

  await uiController.refresh();

  vscode.commands.executeCommand('setContext', 'worktreeHandler.active', true);
  logger.info('Worktree Handler activated successfully');
}

export function deactivate(): void {
  logger.info('Worktree Handler deactivated');
  uiController?.dispose();
}
