# Start backend (runs `npm run dev` in backend folder using PowerShell - avoids relying on cmd.exe)
# Usage: run this from a user account with Node and npm on PATH
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
Write-Output "Starting backend in: $backend"
# Use PowerShell directly so systems without cmd.exe work (or when running in constrained environments)
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit -Command cd '$backend'; npm run dev" -WindowStyle Minimized
