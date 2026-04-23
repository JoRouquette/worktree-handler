# Worktree Handler

VS Code extension to manage multi-worktree Git repositories using a `.bare/` structure.

## Requirements

Your repository root must follow this structure:

```
MyRepo/
├─ .bare/          # Bare repository
├─ .git            # File containing: gitdir: ./.bare
├─ main/           # Worktree (branch: main)
├─ feature-xyz/    # Worktree (branch: feature-xyz)
└─ release/        # Worktree (branch: release)
```

## Quick Start

1. Open the workspace root folder (the one containing `.bare/`) in VS Code.
2. The extension activates automatically and detects your worktrees.
3. Click the `$(git-branch) <worktree>` badge in the status bar to switch worktrees.

## Commands

| Command | Description |
|---|---|
| `Worktree: Checkout` | Switch to a different worktree |
| `Worktree: Refresh List` | Re-scan worktrees |
| `Worktree: Show Configuration` | Open extension settings |

## Terminal Setup

After switching worktrees, source the generated script to align your shell:

```bash
source .worktree-setup.sh   # Bash/Zsh
. .worktree-setup.ps1       # PowerShell
```

## Settings

| Setting | Default | Description |
|---|---|---|
| `worktreeHandler.enable` | `true` | Enable/disable the extension |
| `worktreeHandler.otherWorktreesVisibility` | `"hidden"` | `hidden` or `dimmed` |
| `worktreeHandler.autoDetectWorktrees` | `true` | Detect worktrees on startup |
| `worktreeHandler.pollInterval` | `5000` | Poll interval in ms |
| `worktreeHandler.rememberLastWorktree` | `true` | Restore last worktree on startup |
| `worktreeHandler.generateTerminalScripts` | `true` | Auto-generate shell scripts |

## Specification

See [SPECS.md](./SPECS.md) for the full design specification.
