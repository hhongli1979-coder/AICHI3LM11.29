param([string]$msg)

# Default commit message
if (-not $msg -or $msg -eq "") {
  $msg = "chore: quick push $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# Stage, commit if any changes, push current branch
& git add -A
$pending = & git status --porcelain
if ($pending) {
  & git commit -m "$msg"
}
& git push -u origin HEAD
