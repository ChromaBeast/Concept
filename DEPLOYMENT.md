# Concept Platform — Deployment Guide

Comprehensive deployment guide using the **Appwrite CLI**, **Next.js Web App** (Bun), and **Flutter Mobile App**.

---

## 1. Appwrite CLI Automated Setup

The repository includes a complete `appwrite.json` configuration defining the database (`concepts_db`), all 6 collections, attribute schemas, indexes, storage buckets (`concept-images`), and Go cloud functions.

### Step 1: Install & Authenticate Appwrite CLI
```bash
# Verify CLI installation
appwrite --version

# Authenticate with your Appwrite Cloud or self-hosted instance
appwrite login
```

### Step 2: Link Project & Push Entire Architecture
```bash
# Link to your Appwrite project (e.g. concept-app)
appwrite init project

# Push database schema, collections, buckets, and cloud functions in one step
appwrite push all
```

### Step 3: Configure Function Environment Variables
In [Appwrite Console](https://cloud.appwrite.io) $\to$ **Functions** $\to$ **Settings** $\to$ **Global Variables**:
- `GEMINI_API_KEY`: Your Google AI Gemini API Key
- `GEMINI_MODEL`: `gemini-3.7-flash` (Primary synthesis & structured generation)
- `GEMINI_VALIDATOR_MODEL`: `gemini-3.5-flash-lite` (Fast validation & roadmap expansion)
- `APPWRITE_API_KEY`: Server API key with `databases.*`, `files.*`, `functions.*` scopes
- `APPWRITE_ENDPOINT`: `https://cloud.appwrite.io/v1`
- `APPWRITE_PROJECT_ID`: `concept-app`
- `APPWRITE_DATABASE_ID`: `concepts_db`

---

## 2. Seed Initial Curriculum (197 Topics)

```bash
cd backend/scripts
$env:APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
$env:APPWRITE_PROJECT_ID="concept-app"
$env:APPWRITE_API_KEY="your_server_api_key"
$env:APPWRITE_DATABASE_ID="concepts_db"
go run seed.go
```

---

## 3. Deploy Next.js Web App (`web_app/`)

### Vercel (Recommended)
1. Import repository `ChromaBeast/Concept` into [Vercel](https://vercel.com).
2. Set **Root Directory** to `web_app`.
3. Set Environment Variables:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`: `https://cloud.appwrite.io/v1`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: `concept-app`
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`: `concepts_db`
4. Deploy.

### Docker / Bun Production Container
```bash
cd web_app
docker build -t concept-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1" \
  -e NEXT_PUBLIC_APPWRITE_PROJECT_ID="concept-app" \
  -e NEXT_PUBLIC_APPWRITE_DATABASE_ID="concepts_db" \
  concept-web
```

---

## 4. Deploy Flutter Mobile App

### Android Production Build
```bash
# Build Google Play App Bundle
flutter build appbundle --release

# Build split APKs
flutter build apk --release --split-per-abi
```
Artifacts created at: `build/app/outputs/bundle/release/app-release.aab`

### iOS Production Build
```bash
flutter build ipa --release
```
Open `ios/Runner.xcworkspace` in Xcode to upload archive to App Store Connect.
