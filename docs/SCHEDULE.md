# Schedule the DVR Project to start at 02:00 daily (Windows)

This document shows how to schedule the repo's dev servers to run automatically at 02:00 using Windows Task Scheduler.

Prerequisites
- Node and npm must be on PATH for the account that will run the task.
- MongoDB should be configured as a Windows Service (or make sure `mongod` is started before the scheduled task).
- The scripts are in `scripts/` and there are:
  - `scripts/start-backend.ps1` — runs `npm run dev` in `/backend`
  - `scripts/start-frontend.ps1` — runs `npm start` in `/frontend`
  - `scripts/start-all.ps1` — runs both scripts

Quick manual test (run now):

```powershell
# run from repo root (or provide full path)
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-all.ps1
```

Create a scheduled task (command line example)

```powershell
# Run as the current user (it may prompt for credentials depending on policy)
# Replace the path below with the absolute path to your repo
schtasks /Create /SC DAILY /TN "DVR Project Start" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\sample_project\mavenproject\DVR_PROJECT\scripts\start-all.ps1\"" /ST 02:00 /F

# To run under a specific user with highest privileges (you will be prompted for password):
# schtasks /Create /SC DAILY /TN "DVR Project Start" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\sample_project\mavenproject\DVR_PROJECT\scripts\start-all.ps1\"" /ST 02:00 /RU "YourUser" /RL HIGHEST /F
```

Notes & Troubleshooting
- The scripts launch the commands in minimized `cmd` windows. If a port is in use, `npm start` or `npm run dev` may prompt or fail; consider using production serving (`npm run build` + `npx serve -s build`) if you need a more robust background start.
- If you rely on environment variables from `.env`, ensure the working directory is the repo root (scripts use `$PSScriptRoot` so they should load `.env` via `dotenv` in the Node app).
- To ensure MongoDB starts automatically, configure the MongoDB service to Automatic:

```powershell
Set-Service -Name MongoDB -StartupType Automatic
Start-Service -Name MongoDB
```

Security note: do not store credentials in plain text. Prefer to create the scheduled task with the account that will run the app and provide credentials at task creation time.
