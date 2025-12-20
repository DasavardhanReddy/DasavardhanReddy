# Start frontend (runs `npm start` in frontend folder)
$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root 'frontend'
Write-Output "Starting frontend in: $frontend"
Start-Process -FilePath 'cmd.exe' -ArgumentList "/c","cd /d `"$frontend`" && npm start" -WindowStyle Minimized
