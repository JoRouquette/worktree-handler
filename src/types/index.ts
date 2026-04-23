export interface Worktree {
  name: string;
  path: string;
  isCurrent: boolean;
}

export interface ExtensionConfig {
  enable: boolean;
  otherWorktreesVisibility: 'hidden' | 'dimmed';
  autoDetectWorktrees: boolean;
  pollInterval: number;
  rememberLastWorktree: boolean;
  generateTerminalScripts: boolean;
}

export interface WorktreeState {
  currentWorktree: string;
  lastUpdated: number;
}
