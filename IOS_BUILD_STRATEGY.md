# iOS Build Strategy - Velvet OS

## Summary

**Core Rust**: Compile from Linux via rustup target add aarch64-apple-ios x86_64-apple-ios + cargo-lipo  
**Swift/iOS SDK**: Not available on Linux — requires macOS for Xcode, Swift compiler, code signing, .ipa packaging  
**Strategy**: Split toolchain — Linux builds Rust core + generates UniFFI bindings; macOS (GitHub Actions) compiles SwiftUI, links iOS SDK, code-signs, exports .ipa

## Recommended Architecture

┌─────────────────────┐      ┌─────────────────────────┐
│   Linux (BYO server) │─────►│   macOS (GitHub Actions) │
│  • Rust core build   │      │  • SwiftUI compilation   │
│  • UniFFI bindings   │      │  • iOS SDK linking         │
│  • .dylib output     │      │  • Code signing            │
│  • .udl definitions  │      │  • .ipa packaging          │
└─────────────────────┘      └─────────────────────────────┘

## Build Steps

### Phase 1: Linux (BYO droplet)

rustup target add aarch64-apple-ios x86_64-apple-ios
cargo install cargo-lipo
cargo build --release --target aarch64-apple-ios
cargo build --release --target x86_64-apple-ios
cargo uniffi-bindgen generate src/velvet.udl --language swift --out-dir swift-bindings
cargo lipo --release --output libvelvet_ios.a

### Phase 2: macOS (GitHub Actions macos-latest)

jobs:
  ios-build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-swift@v2
      - run: swift build -c release --target x86_64-apple-ios
      - run: xcodebuild -scheme VelvetOS -configuration Release -sdk iphoneos
      - run: xcodebuild -exportArchive -archivePath VelvetOS.xcarchive -exportOptionsPlist export.plist -exportPath ./build

## iOS-Specific Features (macOS-only)

| Feature | Requirement | Linux Support |
|---------|-------------|---------------|
| Code signing | Apple Developer account | No |
| Entitlements (App Groups, Keychain, Push) | Xcode + provisioning profile | No |
| .app/.ipa packaging | Xcodebuild | No |
| APNs certificates | Apple Developer Portal | No |
| App Store submission | Xcode + Transporter | No |

## Fallback: PWA on iOS

The PWA at /root/velvet-os/dist/ works on iOS via Safari Add to Home Screen with no macOS required.

## Related Documents

- IOS_BUILD_REQUIREMENTS.md - Toolchain and dependency requirements
- IOS_CROSS_COMPILE_GUIDE.md - Step-by-step cross-compilation guide
