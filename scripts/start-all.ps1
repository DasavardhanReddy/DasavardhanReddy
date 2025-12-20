# Invoke both start scripts (backend then frontend)
$root = Split-Path -Parent $PSScriptRoot
Write-Output "Invoking backend and frontend start scripts from $root"
& "$PSScriptRoot\start-backend.ps1"
Start-Sleep -Seconds 3
& "$PSScriptRoot\start-frontend.ps1"
Write-Output "Start commands issued. Check Task Manager / terminals for running node processes."