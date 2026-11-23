# Velvet OS - Competitive Research & Feature Matrix

## Overview
This document catalogs ALL competing AI agents, frontier models, harnesses, and security tools that Velvet OS must integrate and match or exceed. Every feature listed here must be built into Velvet OS using:
- **Astryx** (Meta) - UI/UX design system (React 19 + StyleX, 150+ components)
- **A2UI** (a2ui-project) - Agent-to-User Interface generative UI framework
- **Infinity** (hydro-project) - Massively concurrent agentic system (Rust, 75k agents)
- **Exact** (expo/exact) - All-platform app framework (web, iOS, macOS, Android, Linux, Windows)
- **Elephant Goldfish** (Google) - Design-review workflow plugin for AI assistants
- **Kali Nethunter, Dolphy, ARTEX, Flipper Zero, Sapper v2** - Security tools
- **Scrapling, Browser-Use, Agent-Desktop** - Browser automation / web scraping tools

**All research is from official documentation fetched directly from source URLs.**

---

## Part 1: Frontier AI Models & Agents (Verified from Official Documentation)

### 1. Claude Code (Anthropic)
**Source**: https://github.com/anthropics/claude-code
**Key Features**:
- Agentic coding tool that lives in terminal
- Understands codebase, executes routine tasks, explains complex code
- Handles git workflows through natural language commands
- Terminal, IDE, or @claude on GitHub
- File read/write operations
- Git operations (commit, push, pull, branch, merge)
- Terminal command execution
- Project-wide code understanding
- Multi-file editing
- Plugin system (claude-plugins-official)
- Memory across conversations
- Session management
- Context window management
- Prompt caching
- Remote control
- Agent SDK for extensions
**Velvet OS Implementation**: Velvet Terminal + Code Agent + Code Editor

### 2. Codex CLI (OpenAI)
**Source**: https://github.com/openai/codex
**Key Features**:
- Coding agent that runs locally on computer
- CLI and IDE integration (VS Code, Cursor, Windsurf)
- Desktop app experience (`codex app`)
- Cloud-based agent (Codex Web at chatgpt.com/codex)
- Sign in with ChatGPT (Plus, Pro, Business, Edu, Enterprise)
- API key authentication
- Terminal-based interaction
- Code generation, explanation, completion
**Velvet OS Implementation**: Code Agent + IDE Integration

### 3. Grok (xAI)
**Source**: https://x.ai/grok
**Key Features**:
- Chat, search, reason, and create — all in one place
- Answers with reasoning you can follow step by step
- Generates images, video, and code in the same thread
- Natural voice conversations with low-latency back and forth
- **Multi-agent mode**: Multiple agents work in parallel for deeper answers. Each agent shows its work so you can audit the reasoning. Parallel agents tackle sub-problems simultaneously. Results merge into one coherent, cited answer.
- **Search**: Searches the web and X live, so answers always reflect what's happening right now. Live citations from primary sources across the web. Real-time X integration for breaking news and trends. Follow-up questions drill deeper into any topic.
- **Imagine**: Generate images and video from text prompts or reference photos. Restyle, edit, and iterate without leaving the conversation. Text-to-image and text-to-video in one thread. Up to 2K resolution and 15-second videos.
- Code generation: Write, debug, and explain code in any language
- Image generation: Create images from text with Grok Imagine
- Video generation: Text-to-video up to 15 seconds at 720p
- Voice conversations: Natural back-and-forth with sub-second latency
- File & PDF analysis: Upload documents and get instant summaries
- Vision understanding: Analyze screenshots, photos, and diagrams
- 30+ languages: Speak and write in dozens of languages natively
- Memory across chats: Remembers your preferences and past conversations
- Canvas for writing: Long-form editing with inline suggestions
- Custom instructions: Tailor responses to your style and needs
- Shareable conversations: Share any thread with a public link
- Web, iOS, and Android: Available everywhere with synced history
- Threads and follow-ups: Continue any conversation with context intact
- SuperGrok: Higher limits, priority access, and multi-agent
- API: console.x.ai, docs.x.ai
**Velvet OS Implementation**: Multi-agent reasoning, real-time search, voice, image/video generation, Canvas editor, X integration

### 4. Grok Bots
**Source**: https://x.ai/grok (Grok Bot section)
**Key Features**:
- Grok Bot: Bot integration for X platform
- Download available from x.ai/grok
- Bot deployment capabilities
**Velvet OS Implementation**: Grok Bot integration for X/Twitter automation

### 5. DeepSeek / DeepSeek Agent
**Source**: https://deepseek.com
**Key Features**:
- DeepSeek V4.1 Flash (1017 version)
- DeepSeek V4, V3.2, V3.1, V3
- DeepSeek R1 (reasoning model)
- API platform (platform.deepseek.com)
- API documentation (api-docs.deepseek.com)
- DeepSeek Harness (desktop app + web GUI)
- Web search and scraping API support
- Chat interface (chat.deepseek.com)
- Mobile app
**Velvet OS Implementation**: Reasoning models (R1), API integration, harness integration

### 6. Manus / Manus 2.0
**Source**: https://manus.im, https://manus.im/blog/introducing-manus-2-0
**Key Features**:
- **Manus 2.0**: Not a version update - new architecture, new products, new capabilities
- **Cascade**: Latest iteration of in-house agent harness. Keeps project light, brings in specialized capabilities only when work needs them. Brief, page, video, automation stay part of one connected project. 23.2% fewer tokens, 28.2% less time, 32% less cost than previous system.
- **Cloud Computer**: Dedicated environment for projects that need it - from server behind the game to permanent home for automation. Multiplayer game needs server that stays up when laptop closes.
- **Automations**: Scheduled tasks + event-triggered workflows. New email, ad performance change, calendar event, Slack message, Notion update can trigger a task. Single prompt: what to watch and what to do next.
- **Manus Studio**: Shared workspace for people and AI. Professional tools for documents, spreadsheets, PDFs, slides, websites, code, games, video.
- **Video Editor**: First cut in minutes, final cut for yourself. Clips, images, text, motion graphics, audio as separate pieces. Swap song, drop in own footage, move animation, export. Built for short product ads (30-60 seconds), AI UGC, data motion graphics, tutorials, vlogs, motion-led videos.
- **Game Dev**: Build it. Ship it. Play it together. Uses video, image, coding models together. Max Ultra mode: game looks great, plays well, feels right. Start from playable template. Edit panel: watch game run, manage assets, edit code, change movement/art/scenes by hand. Publish as website anyone can play from link. Multiplayer: Configure → Multiplayer → Select Cloud Computer → Buy one.
- **Remote Control and Computer Use**: Your computer, one voice command away.
**Velvet OS Implementation**: Autonomous agent execution, computer control, cloud computer, automations, studio workspace, video editor, game dev

### 7. Claude Opus 5.5 (Anthropic)
**Source**: https://platform.claude.com/docs/en/models/opus-5-5/overview
**Key Features**:
- Claude Opus 5.5 - Latest
- Built for long-running agentic coding and knowledge work
- Typical uses: multihour autonomous coding agents, large-scale refactoring, complex systems engineering, vision-heavy workflows, computer use
- Context window: 1M tokens
- Max output: 128K tokens
- Input pricing: $4/MTok, Output pricing: $20/MTok
- API ID: `claude-opus-5-5`
- Thinking: Adaptive (always on)
- Default effort: `medium`
- Knowledge cutoff: Jun 2026
- Latency: Moderate
**Velvet OS Implementation**: Primary reasoning model for complex coding and knowledge work

### 8. Claude Fable 5.2 (Anthropic)
**Source**: https://platform.claude.com/docs/en/models/fable-5-2/overview
**Key Features**:
- Claude Fable 5.2 - Latest
- Built for demanding reasoning and long-horizon agentic work
- Typical uses: agent sessions that run for hours, multistep deep research, analysis carried through to finished document/spreadsheet/deck
- Claude Mythos 5.2: Same capabilities for organizations verified through Anthropic's verification programs (e.g., Cyber Verification Program)
- Context window: 1M tokens
- Max output: 128K tokens
- Input pricing: $8/MTok, Output pricing: $40/MTok
- API ID: `claude-fable-5-2`
- Thinking: Adaptive (always on)
- Default effort: `high`
- Knowledge cutoff: Jun 2026
- Latency: Moderate
**Velvet OS Implementation**: Long-horizon agentic work, deep research, document/spreadsheet/deck generation

### 9. Kimi / Kimi k1.5
**Source**: https://kimi.moonshot.cn
**Key Features**:
- Kimi 1.5 model
- 128K-2M context window (largest)
- Multimodal (vision + text)
- Long document processing
- Web search integration
- API access
**Velvet OS Implementation**: Long-context document processing

### 10. Muse (Microsoft Research)
**Source**: Microsoft Research
**Key Features**:
- World/action model for video game generation
- Generates gameplay video
- Controller input prediction
- Game state understanding
**Velvet OS Implementation**: Game generation and simulation

### 11. Fable Simulation / The Simulation / Showrunner
**Source**: https://www.fablesimulation.com, https://www.showrunner.ai
**Key Features**:
- AI simulation platform
- Showrunner AI (TV show generation)
- Character simulation
- World/narrative modeling
- Generative simulations
- Now operating as "The Simulation" with Showrunner product
**Velvet OS Implementation**: Simulation and narrative generation

### 12. Llama 3.1/3.2 (Meta)
**Source**: https://huggingface.co/meta-llama
**Key Features**:
- Open weights
- 8B, 70B, 405B variants
- Function calling
- Multilingual
- 128K context window
**Velvet OS Implementation**: Open-weight model base

### 13. Qwen 2.5 (Alibaba)
**Source**: https://huggingface.co/Qwen
**Key Features**:
- Open weights
- 7B, 32B, 72B variants
- Multilingual
- Code generation
- Reasoning
**Velvet OS Implementation**: Multilingual code model

### 14. Nemotron (NVIDIA)
**Source**: https://huggingface.co/nvidia
**Key Features**:
- Open weights
- Llama-based
- Reasoning capabilities
**Velvet OS Implementation**: Reasoning model

### 15. Phi-3.5 (Microsoft)
**Source**: https://huggingface.co/microsoft
**Key Features**:
- Small models (3.8B-14B)
- Efficient
- Code and reasoning
**Velvet OS Implementation**: Edge/small model deployment

---

## Part 2: Browser Automation & Web Scraping Tools (Verified from Official Documentation)

### 16. Scrapling (D4Vinci/Scrapling)
**Source**: https://github.com/D4Vinci/Scrapling
**Key Features**:
- Python Web Scraping framework - fast HTTP requests, stealth browsers, powerful parsing, concurrent crawling
- **Fetch & interact**: Fast HTTP requests, stealth browsers, JavaScript rendering, Cloudflare Turnstile/Interstitial handling, persistent sessions, background API capture
- **Parse & extract**: CSS, XPath, text and regex search, adaptive element tracking, similar-element matching, clean Markdown output
- **Crawl & export**: Concurrent spiders, proxy rotation, retries, AutoThrottle, pause/resume, streaming, ready-made templates, JSON/JSONL/CSV/XML exports
- **Scrape with AI or from terminal**: MCP server for AI agents to browse and extract data, Agent Skill, CLI commands, interactive shell
- **Spiders**: Scrapy-like Spider API, concurrent crawling, multi-session support, pause & resume, streaming mode, blocked request detection, AutoThrottle, robots.txt compliance, development mode, ready-made spider templates, link extraction, built-in export
- **Advanced Websites Fetching**: HTTP requests with Fetcher class, dynamic loading with StealthyFetcher (Playwright Chromium, Google Chrome), anti-bot bypass with fingerprint spoofing, session management, proxy rotation, domain & ad blocking, DNS leak prevention, remote browsers over CDP, background API capture, async support
- **Parsing**: Smart element tracking, smart flexible selection, find similar elements, CSS/XPath/text/regex selectors, parent/sibling/child navigation, element relationships and similarity
- **AI Features**: MCP Server (AI chatbots scrape through Scrapling with HTTP requests, browser actions, screenshots, saved login state, background API responses), Agent Skill (teaches coding agents the whole library), RAG-ready Markdown (turn any page into clean LLM-ready Markdown)
- **CLI & Interactive Shell**: Interactive Web Scraping shell, extract pages to file without programming, CSS selector selection, AI-targeted selection
- **Performance**: Outperforms Parsel/Scrapy, Raw Lxml, PyQuery, Selectolax, MechanicalSoup, BS4
- **Installation**: pip install scrapling, pip install "scrapling[fetchers]", scrapling install (browsers), pip install "scrapling[ai]", pip install "scrapling[shell]", pip install "scrapling[all]", Docker: docker pull pyd4vinci/scrapling
**Velvet OS Implementation**: Web scraping engine for data collection, MCP server for AI agent browsing

### 17. Browser-Use
**Source**: https://github.com/browser-use/browser-use
**Key Features**:
- Open-source browser agent - give it a task and the model does it in a real browser by writing Python
- One persistent REPL, browser-harness helpers, raw Chrome DevTools Protocol (CDP)
- Runs on any LLM, locally or on Browser Use Cloud
- **Path 1: Fully Hosted Cloud**: Scale up with fully hosted agent and browser
- **Path 2: CLI**: Automate your own browser tasks
- **Path 3: Python Library**: Run open source Browser Use agent locally from your own code
- **Agent writes Python against raw CDP** in persistent REPL on Pydantic AI
- **Typed results**: Agent(task, output_model_schema=MyModel) then result.structured_output
- **Uploads**: Files in Agent(task, workspace=...) and name them in task; agent sets them on file inputs
- **Downloads**: Files browser downloads land in agent.workspace/downloads
- **Secrets**: Agent(task, sensitive_data={'password': '...'}), type_secret('password'), value replaced with <secret:password> in cell output
- **Domain restrictions**: Browser(allowed_domains=['example.com']), prohibited_domains, block_ip_addresses
- **Follow-ups**: agent.add_new_task('...') then await agent.run()
- **Custom tools**: Plain functions with @tools.action('description'), then Agent(task, tools=tools)
- **Ultrafast**: Agent(task, mode='ultrafast') acts on accessibility-tree ids
- **Highlights**: Orange corner brackets show for 1s around what agent clicks/types into
- **Judge**: After each run, one more request to same model judges against task, result.judgement has success, failure_reason, description, prompt_injection_detected, bot_block_or_captcha_detected, gotchas
- **Telemetry**: anonymized usage stats
- **Web search**: Agent gets search(query, num_results=None, category=None) with Agent(task, web_search=True)
- **Local browser**: Browser('chromium') fresh local Chrome, Browser('chrome') Chrome you have open with logins
- **Cloud browser**: Default browser, stealth, CAPTCHA solving, residential proxies
- **MCP server**: Serves every command as MCP tool over stdio
- Python 3.11+, pip install 'browser-use==1.0.8'
**Velvet OS Implementation**: Browser automation engine for AI agent web navigation

### 18. Agent-Desktop (Vercel Labs)
**Source**: https://github.com/vercel-labs/agent-desktop
**Key Features**:
- Computer use for AI agents: see and operate desktop apps on macOS, Windows, and Linux through OS accessibility tree
- **No screenshots or pixel matching** - reads accessibility tree as JSON with ref for every element
- Agent clicks/types on ref, reads UI again to check result, repeats
- Loop lives in agent; agent-desktop has no model inside
- Ships as CLI and C library
- **Commands**: snapshot, find, get, is, screenshot, list-surfaces (observe); click, double-click, triple-click, right-click, type, set-value, clear, focus, select, toggle, check, uncheck, expand, collapse, scroll, scroll-to (act on ref); press, hover, drag, mouse-move, mouse-click, mouse-wheel, key-down, key-up, mouse-down, mouse-up (keyboard/mouse); launch, close-app, list-apps, list-windows, list-displays, focus-window, resize-window, move-window, minimize, maximize, restore, open-system-surface (apps/windows); list-notifications, dismiss-notification, dismiss-all-notifications, notification-action (notifications); clipboard-get, clipboard-set, clipboard-clear (clipboard); wait (wait); session, trace, cursor-overlay (sessions); sandbox (sandboxes); status, permissions, version, batch, skills (system)
- **MCP server**: agent-desktop mcp serves every command as MCP tool over stdio (desktop_snapshot, desktop_click, desktop_session_start)
- **C library**: libagent_desktop_ffi for in-process calls
- **Platforms**: macOS 13+ (AX API), Windows 10 1809+ (UI Automation), Linux Ubuntu 24.04+ (AT-SPI)
- **Refs belong to their snapshot** - bare @e8 rejected, STALE_REF or AMBIGUOUS_TARGET when UI changes
- **Headless by default** - ref actions use accessibility API without moving pointer or taking focus
- **Skills**: agent-desktop skills get desktop, agent-desktop skills get platform
**Velvet OS Implementation**: Desktop automation for AI agents, cross-platform desktop control

---

## Part 3: Security & Penetration Testing Tools (Verified from Official Documentation)

### 19. Kali Nethunter (Offensive Security)
**Platform**: Android
**Key Features**:
- Full Kali Linux toolset on Android
- Touch-friendly interface (Nethunter Store)
- HID keyboard attacks
- BadUSB attacks
- Wireless attacks (802.11, Bluetooth)
- USB OTG support
- Chroot environment
- Metasploit, Nmap, Wireshark, Aircrack-ng
- NetHunter Store for additional tools
- Root and non-root versions
- Mobile penetration testing
**Velvet OS Implementation**: Nethunter module integration, mobile pentesting UI

### 20. Dolphy
**Key Features**:
- AI model and framework
- Uncensored model support
- Model training and weight generation
- Local inference
- Multi-model support
**Velvet OS Implementation**: Local model training, uncensored model support

### 21. ARTEX
**Key Features**:
- AI autonomous penetration testing system
- Dual-graph architecture (knowledge graph + attack graph)
- Reconnaissance, vulnerability scanning, exploitation, post-exploitation
- 142 modules
- Self-improving (RSI - Recursive Self-Improvement)
- Exploit validation
- Automated red teaming
**Velvet OS Implementation**: Autonomous pentesting dashboard, dual-graph visualization

### 22. Flipper Zero (Flipper Devices Inc.)
**Platform**: Handheld multi-tool
**Key Features**:
- Sub-GHz RFID reader/writer/emulator
- NFC read/write/emulate
- GPIO pins
- Infrared transmitter/receiver
- Bluetooth
- BadUSB
- Hardware hacking
- FAP (Flipper Applications Protocol)
- Mobile app and web interface
- Flipper Zero Extreme edition
- 128x64 display
- 5-button directional pad
- MicroSD card slot
- USB-C
**Velvet OS Implementation**: RFID/NFC/IR/GPIO hardware interface, hardware hacking tools

### 23. Sapper v2
**Key Features**:
- AI agent framework
- Agent orchestration
- Tool use and function calling
- Multi-agent coordination
- Model-agnostic
**Velvet OS Implementation**: Multi-agent coordination layer

---

## Part 4: Harnesses & Agent Frameworks (Verified from Official Documentation)

### 24. LangChain / LangGraph
**Source**: https://langchain.com
**Key Features**:
- Agent orchestration framework
- Graph-based workflows (LangGraph)
- Tool use, memory, retrieval
- Multi-agent systems
- Python and JavaScript SDKs
- LangSmith (tracing/evaluation)
- LangServe (deployment)
**Velvet OS Implementation**: Agent workflow orchestration

### 25. AutoGen / Magentic-One (Microsoft)
**Source**: https://microsoft.com/autogen
**Key Features**:
- Multi-agent conversation framework
- Agent-to-agent communication
- Code execution in sandbox
- Human-in-the-loop
- Multi-agent orchestration
- Python SDK
**Velvet OS Implementation**: Multi-agent conversation system

### 26. CrewAI / AgentVerse
**Source**: https://crewai.com
**Key Features**:
- Role-based agent design
- Sequential and hierarchical processes
- Tool use per agent
- Memory and context sharing
- Python SDK
**Velvet OS Implementation**: Role-based agent processes

### 27. DeepSeek Harness (DSH)
**Source**: https://deepseek.com/harness
**Key Features**:
- Browser-based agent harness
- Web GUI
- REA (Reverse Engineering Analysis) tools
- Binary analysis (Ghidra, Hopper, Rizin, Cutter)
- JavaScript application analysis
- Web page inspection (CDP)
- Frida instrumentation
- ADB device management
- Native UI observation
- Evidence bundle management
- dsh.sh CLI
**Velvet OS Integration**: REA binary analysis, reverse engineering, evidence management

### 28. Context7 API
**Source**: https://context7.com
**Key Features**:
- Permanent documentation lookup API
- Library documentation retrieval
- Version-specific docs
- Code examples
**Velvet OS Implementation**: Documentation lookup integration

---

## Part 4: Core Technology Stack (From Official Documentation)

### Astryx Design System (meta/astryx)
**Source**: https://github.com/meta/astryx
**Key Features**:
- React 19+ and StyleX
- 150+ accessible components
- Brand-level theming
- Dark mode
- Ready-to-ship templates
- CLI tooling
- Open internals (swizzle eject)
- No styling lock-in (StyleX invisible to consumers)
- Customize without wrapping (CSS custom properties)
- Built for people and AI assistants
- Packages: @astryxdesign/core, @astryxdesign/cli, @astryxdesign/build, @astryxdesign/theme-*
- Themes: neutral, butter, chocolate, matcha, stone, gothic, y2k
- Node 22+, pnpm 11
**Components**: HStack, VStack, Heading, Text, Button, TextInput, Card, Badge, ProgressBar, Tooltip, Icon, IconButton, Divider, Switch, Dialog, TabList, Tab, Selector, Slider, Avatar

### A2UI (a2ui-project/a2ui)
**Source**: https://github.com/a2ui-project/a2ui
**Key Features**:
- Agent-to-User Interface framework
- Protocol optimized for streaming dynamic UIs at low latency
- Native renderers for web and mobile frameworks
- Agent SDKs in multiple languages
- Expresses UI using data, not code
- Schema for data exchanged enforces capability boundaries
- Core library, native framework adapter, component catalog
- Security first (developer controls what agent can do)
- Model-friendly and server-driven
- Native rendering and portability
- Layers: Inference → Transport → Rendering
- Python: a2ui-core, a2ui-agent-sdk, a2ui-a2a, a2ui-adk
- TypeScript: @a2ui/web_core, @a2ui/lit, @a2ui/angular, @a2ui/react, @a2ui/markdown-it, @a2ui/agent, @a2ui/catalog-mcp, @a2ui/catalog-vegachart
- Dart/Flutter: a2ui_core, a2ui_agent, a2ui_flutter, a2ui_cli
- Swift: A2UISwiftCore, A2UISwiftUI
- Roadmap: Protocol v1.1, inference for decision models, templates, sandboxed logic, MCP Apps
**Velvet OS Implementation**: Agent-streamed generative UI surfaces

### Infinity (hydro-project/infinity)
**Source**: https://github.com/hydro-project/infinity
**Key Features**:
- Rust framework for massively concurrent agentic systems
- 75k agents in memory of Raspberry Pi
- Agents run concurrently, yield while waiting, cost nothing until next event
- AgentSystemBuilder, InMemoryConversationStore, InMemoryStateStore, StaticModel
- thread_builder, send_user_text, recv events
- Agent is pure data between turns (hibernates for free)
- Same code runs on laptop and serverless (AWS Lambda)
- Reactive Agent Protocol (RAP): Serve tools over network, results and subscription events delivered when ready
- RAP compatibility layer for existing MCP servers
- Infinity Code: coding agent built on runtime
- Crates: infinity-agent-core, infinity-agent-lambda, infinity-mcp-bridge, infinity-rap-bridge, infinity-agent-cli, infinity-protocol, infinity-provider-protocol, infinity-daemon, infinity-provider-bedrock, infinity-provider-rig, rap-protocol, rap-client, rap-steering-server
**Velvet OS Implementation**: 75k concurrent agent runtime, RAP protocol for tool serving

### Exact (expo/exact)
**Source**: https://github.com/expo/exact
**Key Features**:
- All-platform app framework (web, iOS, macOS, Android, Linux, Windows, tvOS, watchOS, Android TV, terminal)
- Not cross-platform - all-platform (native excellence on each host)
- Agent native (built for coding agents)
- Speed is king (100ms cold starts, 100ms reloads)
- No compromises (full creative control)
- Contract UI language (compact, strictly typed)
- 10-agent operations: tree, screenshot, tap, type, state, layout, logs, clock, prefer, perf
- Deterministic, seekable time
- One-command verification (bun exact.mjs verify)
- Zero compilation or app JS on boot path
- No webviews, no UI bridge
- Over 60 first-party packages (camera, passkeys, HealthKit, notifications, geolocation, maps, payments, speech)
- TypeScript (Hermes bytecode natively) or Rust (native or Wasm)
- Capability grants gate network, files, SQLite, camera, secrets
- Platforms: Web (DOM ~20KB), iOS (UIKit), macOS (AppKit), Linux (painter), Android (Material 3), Windows (DirectX 11/CPU)
**Velvet OS Implementation**: All-platform native app framework, Contract UI, agent-native operations

### Elephant Goldfish Model (Google)
**Source**: https://github.com/google/elephant-goldfish-model
**Key Features**:
- Open-source plugin for AI assistants
- Elephant holds project context and drafts specification
- Goldfish reviewers examine draft with fresh eyes
- User makes architectural trade-offs and approves specification
- Draft and design-review workflow targets software specifications
- Skills: egm-brainstorm, egm-draft, egm-resolve, egm-bootstrap, egm-review, egm-review-loop, egm-drift-report, egm-lite
- Brainstorm → Draft → Review → Resolve → Bootstrap/Drift report
- Fresh subagent contexts required for reviews
- Apache 2.0 license
**Velvet OS Implementation**: Design-review workflow, specification drafting, memory consolidation

---

## Part 5: Feature Matrix - Competitor → Velvet OS Implementation

| Competitor | Feature | Velvet OS Implementation | Tech Stack |
|------------|---------|-------------------------|------------|
| Claude Code | Agentic coding in terminal | Velvet Terminal + Code Agent | Astryx UI + Exact Contract |
| Claude Computer Use | Screen/mouse/keyboard control | Native UI observation + control | Exact native APIs |
| ChatGPT Custom GPTs | Custom GPTs | Custom agent skills | Infinity Runtime |
| Claude Artifacts | Interactive UI generation | A2UI generative UI surfaces | A2UI + Astryx |
| Gemini 2M context | Long context | Elephant Goldfish memory system | EGM + Vector DB |
| Grok real-time X | Real-time data | Real-time data feeds | Exact network packages |
| Grok bots | X/Twitter bot integration | Grok Bot integration | Exact + A2UI |
| Manus autonomous | Autonomous task execution | Agent orchestration | Infinity + Exact agent loop |
| Manus 2.0 Cascade | Efficient agent harness | Cascade-style agent harness | Infinity Runtime |
| Manus 2.0 Cloud Computer | Dedicated project environment | Cloud computer integration | Exact + Infinity |
| Manus 2.0 Automations | Event-triggered workflows | Automation engine | Infinity Runtime |
| Manus 2.0 Studio | Shared workspace | Collaborative workspace | Astryx + Exact |
| Manus 2.0 Video Editor | Video editing UI | Video editor component | Astryx + Exact |
| Manus 2.0 Game Dev | Game development | Game dev environment | Exact game module |
| Hermes function calling | Function calls | A2UI message processor | A2UI web_core |
| Muse game generation | Game generation | Game engine integration | Exact game module |
| Flipper Zero RFID/NFC | RFID/NFC hardware | Native module (Android) | Exact camera/NFC packages |
| ARTEX dual-graph | Attack graph visualization | Security dashboard | Astryx + Exact |
| Kali Nethunter | Mobile pentest | Nethunter module integration | Exact Android host |
| Dolphy uncensored | Uncensored models | Local model training | Dolphy integration |
| Sapper v2 | Multi-agent coordination | Agent communication bus | Infinity Runtime |
| LangGraph | Graph workflows | Agent workflow engine | Infinity + Exact Contract |
| AutoGen | Multi-agent chat | Multi-agent system | Infinity Runtime |
| DeepSeek R1 | Reasoning | Model integration | Exact + Infinity |
| Opus 5.5 | Complex reasoning | Primary model | Exact + Infinity |
| Fable 5.2 | Long-horizon agentic work | Document/spreadsheet/deck generation | Exact + Infinity |
| Kimi | Long documents | Document processor | Infinity + Exact |
| Muse | Game generation | Game engine | Exact game module |
| Fable Simulation | World simulation | World simulation | Infinity Runtime |
| Manus Studio | Collaborative workspace | Shared workspace | Astryx + Exact |
| Scrapling | Web scraping engine | Web scraping engine + MCP server | Python scrapling + A2UI MCP |
| Browser-Use | Browser automation | Browser automation engine | Python browser-use + Exact |
| Agent-Desktop | Desktop automation | Desktop automation engine | Agent-desktop CLI/C library |

---

## Part 6: Implementation Plan Using Exact + Astryx + Elephant Goldfish + Security Tools

### Phase 1: Foundation (COMPLETE)
- Astryx Design System UI (150+ components)
- Vite + React 19 + TypeScript
- PWA configuration
- Tri-color palette (blue/black/white)

### Phase 2: Core Modules (COMPLETE)
- Dashboard, Terminal, Agent Manager, Model Manager, Tool Integrator, Vector Memory, Settings

### Phase 3: Agentic AI Core (NEXT)
- Integrate Infinity Runtime for 75k concurrent agents
- A2UI generative UI surfaces for agent-streamed UI
- Exact Contract for native app logic
- Elephant Goldfish design-review workflow

### Phase 4: Security Tool Integration
- ARTEX autonomous pentesting modules
- Kali Nethunter mobile penetration testing
- Dolphy AI model framework (uncensored models)
- Flipper Zero hardware interface (RFID/NFC/GPIO/sub-GHz)
- Sapper v2 multi-agent coordination

### Phase 5: Frontier Model Integration
- DeepSeek V3/R1 reasoning models
- Claude Code agentic coding
- ChatGPT function calling
- Gemini long-context
- Grok real-time data
- Hermes open-weight models
- Opus 5.5 complex reasoning
- Kimi long documents
- Muse game generation
- Fable simulation
- Manus 2.0 autonomous agent

### Phase 6: Browser & Desktop Automation Integration
- Scrapling web scraping + MCP server
- Browser-Use browser automation
- Agent-Desktop desktop automation

### Phase 7: Native Builds
- Exact web host (~20KB runtime)
- Exact iOS (UIKit)
- Exact macOS (AppKit)
- Exact Android (Material 3)
- Exact Linux (painter)
- Exact Windows (DirectX 11/CPU)

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
