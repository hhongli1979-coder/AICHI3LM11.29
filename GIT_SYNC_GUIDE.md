# Git 代码同步指南 / Git Sync Guide

本指南帮助您解决本地与远程仓库代码同步的常见问题。

This guide helps you resolve common issues with syncing code between local and remote repositories.

## 快速同步 / Quick Sync

### 拉取远程代码 / Pull Remote Code

**Windows:**
```batch
pull.bat
```

或使用 PowerShell:
```powershell
.\pull.ps1
```

**Mac/Linux:**
```bash
git fetch origin
git pull origin main
```

### 推送本地代码 / Push Local Code

**Windows:**
```batch
push.bat
```

或使用 PowerShell:
```powershell
.\push.ps1 "Your commit message"
```

---

## 常见问题 / Common Issues

### 问题1：代码拉不下来 / Cannot Pull Code

**症状 / Symptoms:**
- 运行 `git pull` 后没有更新
- 提示 "Already up to date" 但远程有新代码

**解决方案 / Solutions:**

1. **首先获取远程更新 / First fetch remote updates:**
   ```bash
   git fetch origin
   git status
   ```

2. **查看远程分支状态 / Check remote branch status:**
   ```bash
   git log HEAD..origin/main --oneline
   ```

3. **强制拉取（慎用）/ Force pull (use with caution):**
   ```bash
   git fetch origin
   git reset --hard origin/main
   ```
   ⚠️ 警告：这会丢失所有本地未提交的更改！

### 问题2：推送被拒绝 / Push Rejected

**症状 / Symptoms:**
- 提示 "Updates were rejected because the remote contains work..."

**解决方案 / Solutions:**

1. **先拉取再推送 / Pull then push:**
   ```bash
   git pull --rebase origin main
   git push origin main
   ```

2. **如果有冲突 / If there are conflicts:**
   ```bash
   # 解决冲突后
   git add .
   git rebase --continue
   git push origin main
   ```

### 问题3：本地有未提交的更改 / Local Uncommitted Changes

**暂存更改后再拉取 / Stash changes before pulling:**
```bash
git stash
git pull origin main
git stash pop
```

---

## 分支操作 / Branch Operations

### 切换分支 / Switch Branch
```bash
git checkout branch-name
# 或者
git switch branch-name
```

### 创建并切换新分支 / Create and Switch to New Branch
```bash
git checkout -b new-branch-name
# 或者
git switch -c new-branch-name
```

### 查看所有分支 / View All Branches
```bash
git branch -a
```

---

## 最佳实践 / Best Practices

1. **经常同步 / Sync frequently:**
   - 每天开始工作前先拉取最新代码
   - Pull the latest code before starting work each day

2. **小步提交 / Commit in small steps:**
   - 每完成一个功能就提交一次
   - Commit after completing each feature

3. **写清楚提交信息 / Write clear commit messages:**
   ```bash
   git commit -m "feat: add user login feature"
   git commit -m "fix: resolve null pointer exception"
   git commit -m "docs: update README"
   ```

4. **使用分支开发 / Use branches for development:**
   - 不要直接在 main 分支上开发
   - Don't develop directly on the main branch

---

## 配置检查 / Configuration Check

检查 Git 配置是否正确 / Check if Git is configured correctly:

```bash
# 查看当前配置
git config --list

# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看远程仓库
git remote -v
```

---

## 紧急恢复 / Emergency Recovery

如果操作失误，可以使用以下命令恢复：

### 查看操作历史 / View Operation History
```bash
git reflog
```

### 恢复到之前的状态 / Restore to Previous State
```bash
git reset --hard HEAD@{n}  # n 是 reflog 中的编号
```

---

## 联系支持 / Contact Support

如果以上方法都无法解决问题，请：

1. 在 GitHub 上提交 Issue
2. 提供完整的错误信息
3. 说明您使用的操作系统和 Git 版本

---

*最后更新 / Last Updated: 2024-12-03*
