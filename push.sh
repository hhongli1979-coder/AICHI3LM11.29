#!/bin/bash
# 简化的 Git 推送脚本 / Simplified Git Push Script
# 用法 / Usage: ./push.sh [commit message] [options]
# 选项 / Options: -f 强制推送 / force push, -l 大文件模式 / large file mode

set -e

# 颜色定义 / Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 参数解析 / Parse arguments
MSG=""
FORCE=false
LARGE_FILE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--force)
            FORCE=true
            shift
            ;;
        -l|--large)
            LARGE_FILE=true
            shift
            ;;
        *)
            if [ -z "$MSG" ]; then
                MSG="$1"
            fi
            shift
            ;;
    esac
done

# 检查是否在 git 仓库中 / Check if in git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}错误: 当前目录不是 git 仓库${NC}"
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# 获取当前分支 / Get current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
    echo -e "${RED}错误: 无法获取当前分支${NC}"
    echo -e "${RED}Error: Cannot get current branch${NC}"
    exit 1
fi
echo -e "${CYAN}当前分支 / Current branch: $CURRENT_BRANCH${NC}"

# 默认提交消息 / Default commit message
if [ -z "$MSG" ]; then
    MSG="chore: update $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 大文件处理 / Large file handling
if [ "$LARGE_FILE" = true ]; then
    echo -e "${YELLOW}提示: 大文件模式已启用${NC}"
    echo -e "${YELLOW}Tip: Large file mode enabled${NC}"
    git config http.postBuffer 524288000
fi

# 暂存更改 / Stage changes
echo -e "\n${GREEN}正在暂存更改... / Staging changes...${NC}"
git add -A

# 检查是否有更改 / Check for changes
PENDING=$(git status --porcelain)
if [ -z "$PENDING" ]; then
    echo -e "${YELLOW}没有更改需要提交 / No changes to commit${NC}"
    
    # 检查是否有未推送的提交 / Check for unpushed commits
    UNPUSHED=$(git log origin/$CURRENT_BRANCH..$CURRENT_BRANCH --oneline 2>/dev/null || true)
    if [ -n "$UNPUSHED" ]; then
        echo -e "${CYAN}检测到未推送的提交 / Detected unpushed commits${NC}"
    else
        echo -e "${GREEN}所有内容都是最新的 / Everything is up to date${NC}"
        exit 0
    fi
else
    # 提交更改 / Commit changes
    echo -e "${GREEN}正在提交... / Committing...${NC}"
    git commit -m "$MSG"
fi

# 推送更改 / Push changes
echo -e "\n${GREEN}正在推送到 $CURRENT_BRANCH... / Pushing to $CURRENT_BRANCH...${NC}"
PUSH_ARGS="-u origin $CURRENT_BRANCH"
if [ "$FORCE" = true ]; then
    PUSH_ARGS="$PUSH_ARGS --force"
    echo -e "${YELLOW}警告: 强制推送已启用 / Warning: Force push enabled${NC}"
fi

if git push $PUSH_ARGS; then
    echo -e "\n${GREEN}✓ 推送成功! / Push successful!${NC}"
else
    echo -e "\n${RED}✗ 推送失败。请检查网络连接和权限。${NC}"
    echo -e "${RED}✗ Push failed. Check network and permissions.${NC}"
    echo -e "\n${YELLOW}可能的解决方案 / Possible solutions:${NC}"
    echo -e "${YELLOW}  1. git pull --rebase origin $CURRENT_BRANCH${NC}"
    echo -e "${YELLOW}  2. 检查 SSH 密钥 / Check SSH keys: ssh -T git@github.com${NC}"
    echo -e "${YELLOW}  3. 对于大型仓库 / For large repos: git config http.postBuffer 524288000${NC}"
    exit 1
fi
