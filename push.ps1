param(
  [string]$msg,
  [string]$branch
)

# Check if we are in a detached HEAD state
$currentBranch = & git symbolic-ref --short HEAD 2>$null
$isDetached = $LASTEXITCODE -ne 0

if ($isDetached) {
  Write-Host "Detected detached HEAD state." -ForegroundColor Yellow
  
  # If no branch name provided, generate one based on timestamp
  if (-not $branch -or $branch -eq "") {
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $branch = "feature/changes-$timestamp"
    Write-Host "No branch name provided. Using: $branch" -ForegroundColor Cyan
  }
  
  # Create and switch to the new branch
  Write-Host "Creating branch: $branch" -ForegroundColor Green
  & git switch -c $branch
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create branch. Exiting." -ForegroundColor Red
    exit 1
  }
}

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

if ($LASTEXITCODE -eq 0) {
  Write-Host "Successfully pushed to origin." -ForegroundColor Green
} else {
  Write-Host "Push failed. Please check your network connection and credentials." -ForegroundColor Red
}
