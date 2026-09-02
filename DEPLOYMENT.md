# Concept Platform — Deployment Guide

This guide covers deploying the **Appwrite Backend & Cloud Functions**, **Next.js Web App**, and **Flutter Mobile App**.

---

## 1. Appwrite Cloud Backend Setup

1. **Create Project**:
   - Go to [Appwrite Cloud Console](https://cloud.appwrite.io) and create a project (e.g. `concept-app`).
2. **Create Database & Collections**:
   - Create Database ID: `concepts_db`
   - Create Collections: `concepts`, `tags`, `courses`, `roadmapTopics`, `pipelineRuns`, `users`, `courseProgress`, `analyticsEvents`.
   - Set Read permission on `concepts`, `tags`, `courses` to `Any` (public read).
3. **Create Storage Bucket**:
   - Bucket ID: `concept-images` (Max size: 10MB, Public Read: `Any`).
4. **Create Server API Key**:
   - Generate an API Key under **Overview → API Keys** with `databases.read`, `databases.write`, `files.read`, `files.write`, `functions.read`, `functions.write` scopes.

---

## 2. Deploying Appwrite Go Cloud Functions

### Option A: Via Appwrite CLI (Recommended)
```bash
# 1. Login to Appwrite CLI
appwrite login

# 2. Link your project
appwrite init project

# 3. Set Function Environment Variables in Appwrite Console:
#    - GEMINI_API_KEY: Your Google Gemini API Key
#    - GEMINI_MODEL: gemini-3.7-flash (or gemini-3.5-flash / gemini-2.5-flash)
#    - GEMINI_VALIDATOR_MODEL: gemini-3.5-flash-lite (fast & cost-effective)
#    - APPWRITE_API_KEY: Your Appwrite Server API Key
#    - APPWRITE_ENDPOINT: https://cloud.appwrite.io/v1
#    - APPWRITE_PROJECT_ID: concept-app
#    - APPWRITE_DATABASE_ID: concepts_db

# 4. Deploy all functions
appwrite deploy function
```

### Option B: Via Appwrite Git Integration
Connect your Git repository in Appwrite Console $\to$ **Functions** $\to$ **Create Function** $\to$ select the folder (`backend/functions/runContentPipeline`, etc.) with Go 1.23 runtime.

---

## 3. Seeding Roadmap Backlog

Run the CLI seed script to insert initial 197 SWE topics:
```bash
cd backend/scripts
$env:APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
$env:APPWRITE_PROJECT_ID="concept-app"
$env:APPWRITE_API_KEY="your_api_key"
$env:APPWRITE_DATABASE_ID="concepts_db"
go run seed.go
```

---

## 4. Deploying Next.js Web App (`web_app/`)

### Option A: Vercel (One-Click)
1. Push to GitHub and import the repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `web_app`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID=concept-app`
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID=concepts_db`
4. Deploy!

### Option B: Docker / Bun Server (Railway, Render, Fly.io)
```bash
cd web_app
docker build -t concept-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_APPWRITE_PROJECT_ID=concept-app concept-web
```

---

## 5. Building & Deploying Flutter Mobile App

### Android:
```bash
# Generate Android App Bundle (Google Play Store)
flutter build appbundle --release

# Generate standalone APK
flutter build apk --release --split-per-abi
```
Output: `build/app/outputs/bundle/release/app-release.aab`

### iOS:
```bash
flutter build ipa --release
```
Open `ios/Runner.xcworkspace` in Xcode to archive and upload to App Store Connect / TestFlight.

### Web (Flutter Web alternative):
```bash
flutter build web --release
```
