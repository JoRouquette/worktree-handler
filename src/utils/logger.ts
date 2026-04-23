import * as vscode from 'vscode';

class Logger {
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Worktree Handler');
  }

  info(message: string): void {
    this.log('INFO', message);
  }

  warn(message: string): void {
    this.log('WARN', message);
  }

  error(message: string, err?: unknown): void {
    const detail = err instanceof Error ? `: ${err.message}` : '';
    this.log('ERROR', `${message}${detail}`);
  }

  dispose(): void {
    this.outputChannel.dispose();
  }

  private log(level: string, message: string): void {
    this.outputChannel.appendLine(`[${new Date().toISOString()}] [${level}] ${message}`);
  }
}

export const logger = new Logger();
