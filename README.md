# Taxido v2.0

## Quick Push Scripts

This repository includes helper scripts to simplify pushing changes to GitHub.

### Usage

#### Windows (PowerShell or Command Prompt)

```powershell
# Basic push (stages all changes, commits, and pushes)
.\push.bat

# With a custom commit message
.\push.bat -msg "your commit message"

# With a custom branch name (useful when in detached HEAD state)
.\push.bat -msg "your commit message" -branch "feature/my-branch"
```

#### Direct PowerShell

```powershell
.\push.ps1 -msg "your commit message" -branch "feature/my-branch"
```

### Handling Detached HEAD State

If you are in a detached HEAD state (e.g., after checking out a specific commit), the script will automatically:
1. Detect the detached HEAD state
2. Create a new branch (auto-generated name if not provided)
3. Commit your changes
4. Push to the remote

To manually fix a detached HEAD state:
```bash
git switch -c <branch-name>
git add .
git commit -m "your commit message"
git push -u origin <branch-name>
```