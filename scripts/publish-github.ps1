# Creates the GitHub repo (if needed), enables GitHub Pages (Actions build), commits and pushes.
# Run from the project folder after `gh auth login`:  & .\scripts\publish-github.ps1
param([string]$Repo = 'willowvalleyrv-react', [ValidateSet('private', 'public')][string]$Visibility = 'private')
$ErrorActionPreference = 'Stop'
$env:Path = "$env:USERPROFILE\tools\mingit\cmd;$env:USERPROFILE\tools\gh\bin;$env:USERPROFILE\tools\nodejs;$env:Path"
Set-Location (Split-Path $PSScriptRoot -Parent)

gh auth status *> $null
if ($LASTEXITCODE -ne 0) { throw 'Not signed in. Run: gh auth login --web --scopes workflow' }
$me = gh api user | ConvertFrom-Json
$owner = $me.login
Write-Host "Signed in as $owner"

# Commit identity: GitHub's private no-reply address, so no personal email goes into the history.
if (-not (Test-Path .git)) { git init -b main | Out-Null }
git config core.autocrlf false
git config user.name ($(if ($me.name) { $me.name } else { $owner }))
git config user.email "$($me.id)+$owner@users.noreply.github.com"

git add -A
if (git status --porcelain) { git commit -q -m 'Willow Valley RV Resort: React rebuild of willowvalleyrv.com' -m 'Vite + React redesign with all original pages, URLs, copy and images; prerendered static output; GitHub Pages workflow.' }

# Native commands don't throw in Windows PowerShell, so check exit codes explicitly.
$ErrorActionPreference = 'Continue'
gh repo view "$owner/$Repo" --json name 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  gh repo create "$owner/$Repo" "--$Visibility" --description 'Willow Valley RV Resort website (React rebuild)'
  if ($LASTEXITCODE -ne 0) { throw 'Could not create the repository.' }
  Write-Host "Created $Visibility repo $owner/$Repo"
}
if (-not (git remote)) { git remote add origin "https://github.com/$owner/$Repo.git" }

# Enable Pages with the GitHub Actions build type (requires a paid plan for private repos).
$pagesOk = $true
gh api "repos/$owner/$Repo/pages" --silent 2>$null
if ($LASTEXITCODE -ne 0) {
  gh api -X POST "repos/$owner/$Repo/pages" -f build_type=workflow --silent
  if ($LASTEXITCODE -eq 0) { Write-Host 'GitHub Pages enabled (GitHub Actions)' }
  else { $pagesOk = $false; Write-Warning 'Could not enable GitHub Pages. Private repos need GitHub Pro/Team for Pages.' }
}

git -c http.postBuffer=524288000 push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'git push failed.' }
Write-Host "`nRepo:  https://github.com/$owner/$Repo"
if ($pagesOk) { Write-Host "Site:  https://$($owner.ToLower()).github.io/$Repo/   (live after the 'Deploy to GitHub Pages' action finishes)" }
Write-Host 'PUBLISH-DONE'
