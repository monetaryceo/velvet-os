# Velvet OS - Implementation Plan

## Phase 1: Research & Documentation (COMPLETE)
- [x] Cloned all repos: astryx, a2ui, infinity, exact
- [x] Installed elephant-goldfish-model at /opt/elephant-goldfish-model/
- [x] Read official READMEs for each repo
- [x] Created PLAN_AND_SPEC.md

## Phase 2: Development Environment Setup

### 2.1 Install Dependencies on Server
- [ ] Install Node 22+ on 137.184.23.228
- [ ] Install pnpm 11
- [ ] Install astryx npm packages (@astryxdesign/core, @astryxdesign/theme-neutral, @stylexjs/stylex, @astryxdesign/cli)
- [ ] Install a2ui web_core from local checkout
- [ ] Install Bun 1.4.2 for exact repo
- [ ] Install Rust toolchain for infinity repo

### 2.2 Configure Project
- [ ] Verify /root/velvet-os/package.json has correct dependencies
- [ ] Verify vite.config.ts has PWA plugin
- [ ] Verify public/manifest.json exists
- [ ] Verify src/main.tsx imports correct CSS files

## Phase 3: Build Web PWA (Astryx-only)

### 3.1 Fix All TypeScript Errors
Remove unused A2uiAgentStream, ExactNativePanel, ElephantGoldfishPanel components (not installed as npm packages). Fix all Astryx API usage errors:
- Remove textAlign/padding/paddingBlock from Text
- Remove flex from Card
- Remove wrap="wrap" from HStack
- Remove width from ProgressBar
- Fix Icon names (only valid Astryx icons)
- Fix Selector onChange types (string | null)
- Fix Button variants (no duplicate attributes)
- Fix theme comparison

### 3.2 Run Clean Build
- [ ] `npm run build` passes with zero errors
- [ ] PWA precache works (11+ entries)

### 3.3 Verify Dev Server
- [ ] `npm run dev` starts on port 5174
- [ ] All 7 tabs render: Dashboard, Terminal, Agents, Models, Tools, Memory, Settings
- [ ] Login flow works
- [ ] Theme toggle (light/dark) works

## Phase 4: Integrate Installed Repos

### 4.1 A2UI Integration
- [ ] Import @a2ui/web_core properly (built from local checkout)
- [ ] Add A2UI Agent Stream component using MessageProcessor
- [ ] Connect surface model to agent messages

### 4.2 Infinity Integration
- [ ] Research Infinity Rust crate bindings for Node/TypeScript
- [ ] Add concurrent agent management UI

### 4.3 Exact Integration
- [ ] Research Exact Contract language for native UI
- [ ] Add native platform capability UI

### 4.4 Elephant Goldfish Integration
- [ ] Add skill execution UI (brainstorm, draft, resolve, review)
- [ ] Connect to /opt/elephant-goldfish-model/ skills

## Phase 5: Native Builds

### 5.1 PWA Deployment
- [ ] Deploy PWA to Brain droplet
- [ ] Configure nginx/apache for PWA serving
- [ ] SSL/HTTPS setup

### 5.2 Native Wrappers
- [ ] Capacitor/Tauri for Linux
- [ ] Capacitor/Tauri for Android
- [ ] Capacitor/Tauri for iOS
- [ ] Tauri for Windows

## Acceptance Criteria

### Web PWA
- [ ] Build passes with zero TypeScript errors
- [ ] All 7 tabs functional
- [ ] Login/logout works
- [ ] Dark/light/system theme toggle works
- [ ] PWA installable (manifest + service worker)
- [ ] Tri-color palette (blue/black/white)

### Native
- [ ] PWA deploys to Brain droplet
- [ ] Native builds for all 4 platforms

## Notes
- Do NOT invent APIs - use official documentation from each repo
- Astryx is the entire UI/UX framework
- Context7 API must be used for every task
- User preference: plain language, complete products, no placeholders
