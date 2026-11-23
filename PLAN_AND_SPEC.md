# Velvet OS - Feature Research & Spec Sheet

## Overview
Velvet OS is a native agentic operating system combining ARTEX, Dolphy, Nethunter, Needle, Jarvis, and other tools under a unified AI agentic framework. Built on Brain DigitalOcean droplet (137.184.23.228) using Astryx design system, a2ui, infinity, exact, elephant-goldfish, scrapling, browser-use, and agent-desktop repos.

**Context7 API**: Permanently configured with API key `ctx7sk-8c42cbea-d7c5-48cd-bf90-d585a0ac83ab` (env var `CONTEXT7_API_KEY` in `/etc/environment` and `/root/.bashrc`)

All research below is from official documentation fetched directly from source URLs via Context7.

---

## Repository Research

### 1. Astryx Design System (meta/astryx)
**Context7 Library ID**: `/meta/astryx`
**Location**: `/root/astryx/` (cloned)
**Description**: Open source design system of accessible, themeable React components styled with StyleX, shipped as the `@astryxdesign/core` component library, the astryx CLI, and the `@astryxdesign/theme-*` themes.
**Version**: v0.7.17
**Code Snippets**: 15,646
**Key APIs** (from official API report):
- **HStack**: Horizontal stack. Props: align, as, children, gap, hAlign, height, isScrollable, justify, maxWidth, minHeight, padding, paddingBlock, paddingBlockEnd, paddingBlockStart, paddingInline, paddingInlineEnd, paddingInlineStart, vAlign, width, wrap, xstyle
- **VStack**: Vertical stack. Same props as HStack plus vAlign default 'stretch'
- **Heading**: Props: accessibilityLevel, children, color, display, level, etc.
- **Text**: Props: align, as, children, color, display, weight, etc. (textAlign NOT supported as separate prop - use align; paddingBlockBottom/paddingBlockStart NOT supported - use padding)
- **Button**: Props: as, children, disabled, icon, label, onClick, variant, etc.
- **Card**: Props: variant, children, etc. (flex NOT supported)
- **Badge**: Props: label, variant, etc.
- **ProgressBar**: Props: label, value, max, variant, etc.
- **Tooltip**: Props: children, trigger, content, etc.
- **Icon**: Icon names: check, chevronDown, chevronLeft, chevronRight, chevronUp, close, copy, eyeSlash, externalLink, funnel, menu, moreHorizontal, search, upload, arrowUp, arrowDown, arrowsUpDown, viewColumns, copy, checkDouble, wrench, stop, microphone
- **IconButton**: Props: icon, label, onClick, size, variant
- **Divider**: Props: orientation, variant
- **Switch**: Props: checked, onChange, label, disabled
- **Dialog**: Props: open, onOpenChange, children
- **DialogHeader**: Props: title, description
- **TabList**: Props: value, onValueChange, children
- **Tab**: Props: value, children
- **Selector**: Props: label, value, onChange (string | null), options, width, hasClear
- **Slider**: Props: value, onValueChange, min, max, step
- **Avatar**: Props: src, name, size, variant
- **SectionTitle**: Section heading component
- **SimpleCard**: Card with variant prop ("default" | "muted")
- **Theme**: Themes via `@astryxdesign/theme-neutral` CSS import
- **Themes**: neutral, butter, chocolate, matcha, stone, gothic, y2k

**Constraints**:
- No AppShell/TopNav/SideNav/Panel - build layout with HStack/VStack/Layout
- No Theme component - theming via `@astryxdesign/theme-neutral` CSS import
- Text props: textAlign and paddingBlockBottom/paddingBlockStart NOT supported
- Card props: flex NOT supported
- Icon names limited to valid Astryx icon set

### 2. A2UI (a2ui-project/a2ui)
**Context7 Library ID**: `/a2ui-project/a2ui`
**Location**: `/root/a2ui/` (cloned)
**Description**: Open protocol and renderers for agent-generated UI: agents stream layout data, apps render it with native React, Angular, Lit, Flutter, SwiftUI and Jetpack Compose components.
**Protocol Version**: v0.9.1 (v1.0 is release candidate, v0.8 is legacy)
**Key Concepts**:
- **createSurface**: Signals renderer to create a surface. Schema: { version, createSurface: { surfaceId, catalogId?, sendDataModel?, components?, dataModel?, metadata? } }
- **updateComponents**: Updates components on a surface
- **updateDataModel**: Updates the data model for a surface
- **SurfaceGroupModel, SurfaceModel, DataModel, DataContext, MessageProcessor, Catalog**
- **spec(), specDef()**: Schema-driven code generation from JSON schemas
- **Layers**: Inference → Transport → Rendering
- **Agents send layout data that references components from the client's catalog; never generate executable UI code**
- **Web renderers**: @a2ui/web_core plus one of @a2ui/react, @a2ui/angular, @a2ui/lit
- **Versioned imports**: @a2ui/react/v0_9, @a2ui/web_core/v0_9

**Packages**:
- TypeScript: @a2ui/web_core, @a2ui/lit, @a2ui/angular, @a2ui/react, @a2ui/markdown-it, @a2ui/agent, @a2ui/catalog-mcp, @a2ui/catalog-vegachart
- Python: a2ui-core, a2ui-agent-sdk, a2ui-a2a, a2ui-adk
- Dart/Flutter: a2ui_core, a2ui_agent, a2ui_flutter, a2ui_cli
- Swift: A2UISwiftCore, A2UISwiftUI

### 3. Infinity (hydro-project/infinity)
**Context7 Library ID**: `/hydro-project/infinity`
**Location**: `/root/infinity/` (cloned)
**Description**: Rust framework for building concurrent agentic systems, with the Infinity Runtime, the Reactive Agent Protocol (RAP), and the Infinity Code coding agent.
**Key Concepts**:
- **AgentSystemBuilder**: Build agent systems with conversation_store, state_store, model
- **InMemoryConversationStore, InMemoryStateStore**: Storage for agent state
- **StaticModel**: Static model wrapper
- **thread_builder, send_user_text, recv events**: Thread management
- **Agent is pure data between turns (hibernates for free)**
- **Same code runs on laptop and serverless (AWS Lambda)**
- **75k agents in memory of a Raspberry Pi**

**RAP (Reactive Agent Protocol)**:
- Async, event-driven contract between agents and tools (replaces synchronous MCP)
- Tool calls are fire-and-forget via HTTP POST /invoke
- Agent shuts down when idle (zero cost hibernation)
- Subscriptions: tools register ongoing subscriptions, events wake the agent
- Long-running tool calls don't block the agent
- RAP compatible with MCP (backwards compatibility layer)
- **Discovery**: GET /.well-known/rap-toolset → Toolset definition (JSON)
- **Invocation**: POST /invoke (tool invocation) → HTTP 200 ack → async tool_result POST to callback_url

**Crates**:
- infinity-agent-core, infinity-agent-lambda, infinity-mcp-bridge, infinity-rap-bridge, infinity-agent-cli, infinity-protocol, infinity-provider-protocol, infinity-daemon, infinity-provider-bedrock, infinity-provider-rig, rap-protocol, rap-client, rap-steering-server

### 4. Exact (expo/exact)
**Location**: `/root/exact/` (cloned)
**Description**: All-platform app framework (web, iOS, macOS, Android, Linux, Windows). Pre-1.0, builds from checkout. Agent native.
**Key Concepts**:
- **Not cross-platform - all-platform**: Native excellence on each host (real DOM on web, UIKit on iOS, AppKit on macOS, Material 3 on Android, painter on Linux, DirectX 11 on Windows)
- **Agent Native**: Built for coding agents - build, run, see, operate, verify real apps through deterministic loop
- **Speed**: 100ms cold starts, 100ms reloads, ~20KB web runtime
- **Contract UI language**: Compact, strictly typed
- **10 agent operations**: tree, screenshot, tap, type, state, layout, logs, clock, prefer, perf
- **Deterministic, seekable time**
- **No webviews, no UI bridge**
- **Over 60 first-party packages**: camera, passkeys, HealthKit, notifications, geolocation, maps, payments, speech
- **Capability grants**: Gate network, files, SQLite, camera, secrets
- **TypeScript (Hermes bytecode natively) or Rust (native or Wasm)**
- **Package manager**: bun@1.4.2
- **Build**: `bun scripts/exact.mjs setup`

**Platforms**:
| Platform | Status | Render |
|---|---|---|
| Web | Works | Browser DOM (~20KB runtime) |
| iOS | Works | UIKit views |
| macOS | Works | AppKit views |
| Linux | Works | Exact painter (Wayland/DRM-KMS/headless) |
| Android | Works | Hardware-accelerated Canvas + Material 3 |
| Windows | Early | DirectX 11 or CPU painter |

### 5. Elephant Goldfish Model (google/elephant-goldfish-model)
**Context7 Library ID**: `/google/elephant-goldfish-model`
**Location**: `/opt/elephant-goldfish-model/` (Python-based)
**Description**: Plugin for AI coding assistants that develops software ideas with full project context and reviews design documents with independent fresh reviewers.
**Skills**:
- **egm-brainstorm**: Begin brainstorming session for a software idea
- **egm-draft**: Generate design draft
- **egm-review**: Review draft with fresh reviewers
- **egm-resolve**: Address review findings
- **egm-bootstrap**: Bootstrap implementation
- **egm-review-loop**: Run configured group of reviewers
- **egm-drift-report**: Detect document/code divergence
- **egm-lite**: Lightweight variant
**Workflow**: Brainstorm → Draft → Review → Resolve → Bootstrap/Drift report
**License**: Apache 2.0

### 6. REA / DeepSeek Harness (deepseek-ai/deepseek-harness)
**Context7 Library ID**: `/deepseek-ai/deepseek-harness`
**Description**: Open-source, plugin-based agent harness for building, testing, and deploying LLM-based agents. Built on Cordis framework.
**Key Tools**:
- open_binary, analyze_function, inspect_artifact, extract_artifact, export_evidence_bundle, import_evidence_bundle
- compare_artifacts, compare_functions, compare_bundles, compare_javascript_export_shapes
- compare_managed_members, compare_process_captures, compare_source_to_bundle, compare_wasm_interfaces, compare_web_captures
- correlate_static_and_runtime, find_changed_behavior, project_*_application_graph
- inspect_native_api, inspect_native_data_type, inspect_native_dispatch_metadata, inspect_native_instruction
- inspect_native_load_image, inspect_recorded_crash, trace_native_ui_action, trace_native_values
- open_jeb_project, list_jeb_units, decompile_jeb_item
- observe_native_calls, observe_native_ui, instrument_with_frida, start_frida_session
- start_gdb_session, start_rizin_debug_session, list_cutter_sessions, cutter_command
- list_adb_devices, inspect_adb_device, install_adb_package, pull_adb_file, push_adb_file
- read_adb_logcat, read_adb_setting, start_adb_app, stop_adb_app, start_adb_activity
- capture_browser_scenario, inspect_web_page, inspect_electron_page, observe_web_execution
- inspect_packet_capture, inspect_signal_decoders, decode_signal_recording

### 7. Scrapling (D4Vinci/Scrapling)
**Context7 Library ID**: `/d4vinci/scrapling`
**Description**: High-performance Python web scraping library that automatically adapts to website changes.
**Key Features**:
- **Fetch & interact**: Fast HTTP requests, stealth browsers, JavaScript rendering, Cloudflare Turnstile/Interstitial handling, persistent sessions, background API capture
- **Parse & extract**: CSS, XPath, text and regex search, adaptive element tracking, similar-element matching, clean Markdown output
- **Crawl & export**: Concurrent spiders, proxy rotation, retries, AutoThrottle, pause/resume, streaming, ready-made templates, JSON/JSONL/CSV/XML exports
- **MCP Server**: AI chatbots scrape through Scrapling with HTTP requests, browser actions, screenshots, saved login state, background API responses
- **Agent Skill**: Teaches coding agents the whole library
- **RAG-ready Markdown**: Turn any page into clean LLM-ready Markdown
- **CLI & Interactive Shell**: Interactive Web Scraping shell, extract pages to file without programming
- **Installation**: pip install scrapling, pip install "scrapling[fetchers]", scrapling install

### 8. Browser-Use (browser-use/browser-use)
**Context7 Library ID**: `/browser-use/browser-use`
**Description**: Open-source Python library for AI agents that control web browsers with any LLM.
**Key Features**:
- **Agent(task, output_model_schema=MyModel)**: Typed results with structured_output
- **Uploads/Downloads**: Files in Agent(task, workspace=...) and downloads land in agent.workspace/downloads
- **Secrets**: Agent(task, sensitive_data={'password': '...'}), type_secret('password')
- **Domain restrictions**: Browser(allowed_domains=[...]), prohibited_domains, block_ip_addresses
- **Follow-ups**: agent.add_new_task('...') then await agent.run()
- **Custom tools**: Plain functions with @tools.action('description')
- **Ultrafast mode**: Agent(task, mode='ultrafast') acts on accessibility-tree ids
- **Judge**: After each run, model judges against task (success, failure_reason, prompt_injection_detected, etc.)
- **Web search**: Agent(task, web_search=True) gets search(query, num_results, category)
- **MCP server**: Serves every command as MCP tool over stdio
- **Python 3.11+**: pip install 'browser-use==1.0.8'

### 9. Agent-Desktop (vercel-labs/agent-desktop)
**Context7 Library ID**: `/vercel-labs/agent-desktop`
**Description**: Rust CLI and C library that lets AI agents observe and operate desktop apps on macOS, Windows, and Linux through the OS accessibility tree.
**Key Features**:
- **No screenshots or pixel matching**: Reads accessibility tree as JSON with ref for every element
- **Agent clicks/types on ref, reads UI again to check result, repeats**
- **Loop lives in agent; agent-desktop has no model inside**
- **Commands**: snapshot, find, get, is, screenshot, list-surfaces (observe); click, double-click, triple-click, right-click, type, set-value, clear, focus, select, toggle, check, uncheck, expand, collapse, scroll, scroll-to (act on ref); press, hover, drag, mouse-move, mouse-click, mouse-wheel, key-down, key-up, mouse-down, mouse-up (keyboard/mouse); launch, close-app, list-apps, list-windows, list-displays, focus-window, resize-window, move-window, minimize, maximize, restore, open-system-surface (apps/windows); list-notifications, dismiss-notification, dismiss-all-notifications, notification-action (notifications); clipboard-get, clipboard-set, clipboard-clear (clipboard); wait (wait); session, trace, cursor-overlay (sessions); sandbox (sandboxes); status, permissions, version, batch, skills (system)
- **MCP server**: agent-desktop mcp serves every command as MCP tool over stdio
- **C library**: libagent_desktop_ffi for in-process calls
- **Platforms**: macOS 13+ (AX API), Windows 10 1809+ (UI Automation), Linux Ubuntu 24.04+ (AT-SPI)
- **Headless by default**: Ref actions use accessibility API without moving pointer or taking focus

### 10. Kali Nethunter (Offensive Security)
**Platform**: Android
**Key Features**:
- Full Kali Linux toolset on Android
- Touch-friendly interface (Nethunter Store)
- HID keyboard attacks, BadUSB attacks
- Wireless attacks (802.11, Bluetooth)
- USB OTG support
- Chroot environment
- Metasploit, Nmap, Wireshark, Aircrack-ng
- NetHunter Store for additional tools
- Root and non-root versions
- Mobile penetration testing

---

## Integrated Tool Features

| Tool | Capabilities | Modules |
|------|-------------|---------|
| ARTEX | AI autonomous penetration testing, dual-graph architecture, reconnaissance, vulnerability scanning, exploitation, post-exploitation, self-improving (RSI) | 142 modules |
| Dolphy | AI model framework, uncensored model support, model training and weight generation, local inference | 89 modules |
| Nethunter | Mobile Kali Linux toolset, HID, BadUSB, wireless attacks, USB OTG, chroot | 67 modules |
| Needle | Small efficient models, tool calling, custom weights, efficient inference | 45 modules |
| Jarvis | Main application shell, orchestration, agent management | 23 modules |
| Flipper Zero | RFID/NFC reader/writer/emulator, GPIO, IR, Bluetooth, BadUSB, hardware hacking | N/A |
| Sapper v2 | AI agent framework, agent orchestration, tool use, multi-agent coordination | N/A |

---

## Build Stack
- **Node 24.22.2**, npm 11.19.1, pnpm (on server)
- **Astryx Design System** (entire UI/UX) - React 19 + StyleX
- **PWA** via Vite PWA plugin
- **Multi-platform** via Exact (web, iOS, macOS, Android, Linux, Windows)
- **Agent concurrency** via Infinity (Rust)
- **Agent-streamed UI** via A2UI protocol
- **Design-review workflow** via Elephant Goldfish
- **Reverse engineering** via REA / DeepSeek Harness
- **Web scraping** via Scrapling
- **Browser automation** via Browser-Use
- **Desktop automation** via Agent-Desktop

---

## Palette
- **Tri-color**: blue (#0066FF), black (#000000), white (#FFFFFF)
- **Modes**: night/day/system
- **Zero gradients** - flat colors only

---

## Tab Structure
1. Dashboard - System health, quick actions, recent activity, integrated tools, model status
2. Terminal - Interactive command interface
3. Agents - Agent CRUD, real-time status, logs, module management
4. Models - Load/unload/train models, VRAM monitoring, training progress
5. Tools - ARTEX, Dolphy, Nethunter, Needle, Jarvis, Ghostman, Scrapling, Browser-Use, Agent-Desktop integration
6. Memory - Vector memory, embeddings, agent memories, tool interactions, training samples, conversations, scans
7. Settings - General, Appearance, Terminal, Agents, Models, Memory, Security, Advanced
8. Security Tools - ARTEX, Nethunter, Dolphy, Flipper Zero, Sapper v2
9. A2UI - Agent Stream - A2UI generative UI streaming protocol
10. Exact Native - Exact native capabilities (camera, geolocation, voice, etc.)
11. Elephant Goldfish - Design-review workflow skills
12. Competitor Models - Frontier model integration
13. Native Build - Cross-platform native build status
14. REA/Craft Anything - Reverse engineering pipeline
15. Context7 API - Documentation lookup

---

## Acceptance Criteria

Every feature from every competitor must have a corresponding implementation in Velvet OS. The implementation must:
1. Use Astryx for all UI/UX
2. Use Exact for all-platform native apps
3. Use Infinity for agent concurrency
4. Use A2UI for agent-streamed generative UI
5. Use Elephant Goldfish for design-review workflow
6. Integrate security tools (ARTEX, Nethunter, Dolphy, Flipper Zero, Sapper v2)
7. Integrate browser automation (Scrapling, Browser-Use, Agent-Desktop)
8. Match or exceed each competitor's key features
9. Zero placeholders, zero stubs, complete wireframing
10. Fully functional login flow
11. Tri-color palette (blue/black/white), night/day/system modes
12. PWA installable (manifest + service worker)
13. Native builds for Linux, Android, iOS, Windows

---

## Next Steps

1. **Immediate**: Equip all repos for use by Velvet on the server
2. **Phase 3**: Complete Agentic AI Core (Infinity Runtime integration)
3. **Phase 4**: Complete Security & Privacy
4. **Phase 5**: Complete Cross-Platform Native Builds (Exact)
5. **Phase 6**: Complete Advanced Features (Elephant Goldfish, REA, Nethunter/Jarvis/ARTEX)
6. **Phase 7**: Complete Frontier Model Integration
7. **Phase 8**: Complete Documentation & Release
