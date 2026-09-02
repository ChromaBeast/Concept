# Concept — Software Engineering Microlearning Platform

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![Bun](https://img.shields.io/badge/Bun-1.3.9-fbf0df?logo=bun)](https://bun.sh)
[![Go](https://img.shields.io/badge/Go-1.26.5-00ADD8?logo=go)](https://golang.org)
[![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FD366E?logo=appwrite)](https://appwrite.io)
[![Gemini](https://img.shields.io/badge/AI-Gemini%203.7%20Flash-4285F4?logo=google)](https://ai.google.dev)

A dense, high-signal engineering reference and daily learning loop built for software engineers, systems architects, and interview candidates.

---

## ⚡ Core Pillars

- **<2 Minute Cards**: Word-count capped ($\le 230$ words target, $\le 260$ hard cap) with syntax-highlighted code, pitfalls, and interview angles.
- **Progressive Disclosure**: Interactive Quick Checks, Domain Clusters (Core CS, Systems & Cloud, Software & Web, Practices & Career), and structured course playlists.
- **Cross-Platform**:
  - 📱 **Mobile**: Flutter with Riverpod, offline Hive caching, haptics, and thumb-friendly navigation.
  - 🌐 **Web**: Next.js 14 (App Router) + Bun, Tailwind CSS, `Cmd+K` Command Palette, Breadcrumbs, and keyboard navigation (`←`/`→`).
  - ⚙️ **Backend**: Appwrite Cloud Functions written in **Go 1.26.5** with automated multi-stage Gemini 3.8 Flash content pipelines.

---

## 📁 Repository Structure

```text
Concept/
├── lib/                     # Flutter mobile application (Riverpod, GoRouter, Hive)
│   ├── app/                 # Root app and route declarations
│   ├── core/                # Theme, typography, constants, and utilities
│   ├── data/                # Models, repositories, services, seed data
│   ├── features/            # Feature screens (Home, Browse, Courses, Detail, Search, Profile, Admin)
│   └── shared/              # Reusable UI widgets & toast snackbars
├── web_app/                 # Next.js 14 web app powered by Bun
│   ├── src/app/             # Next.js App Router routes
│   ├── src/components/      # UI components (CommandPalette, Breadcrumbs, Toast)
│   └── src/lib/             # Types, seed catalog, storage, domain groupings
├── backend/                 # Appwrite Go 1.26.5 Cloud Functions
│   ├── functions/           # runContentPipeline, expandRoadmap, curateCourses, onConceptPublish
│   └── scripts/             # Seed roadmap topics generator
├── appwrite.json            # Appwrite CLI function runtimes, crons, & collections
└── DEPLOYMENT.md            # Turnkey deployment manual
```

---

## 🚀 Quick Start

### 1. Flutter Mobile App
```bash
flutter pub get
flutter run
```

### 2. Next.js Web App (Bun)
```bash
cd web_app
bun install
bun run dev
```

### 3. Backend Cloud Functions (Go 1.26.5)
```bash
cd backend/functions/runContentPipeline
go run .
```

---

## 🤖 Content Generation Architecture

1. **Roadmap Expansion**: `expandRoadmap` invokes `gemini-3.8-flash` to discover high-priority curriculum gaps.
2. **Draft Generation**: `runContentPipeline` prompts `gemini-3.8-flash` with strict JSON schema constraints.
3. **Automated Validation**: `validator.go` checks schema integrity, word limits, and runs an accuracy verification pass before auto-publishing.

---

## 📄 License

MIT © [Sheersh Jaiswal](https://github.com/ChromaBeast)
