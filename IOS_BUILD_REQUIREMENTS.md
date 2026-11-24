# iOS Build Requirements - Velvet OS

## Toolchain Requirements

### Linux (Build Server)

| Tool | Version | Purpose | Installed |
|------|---------|---------|-----------|
| Rust | 1.100.0 | Core library compilation | Yes |
| cargo | 1.100.0 | Rust package manager | Yes |
| rustup | Latest | Target management | Yes |
| cargo-lipo | Latest | Universal binary creation | No |
| cargo-uniffi | Latest | UniFFI bindings generation | No |

### macOS (CI Runner)

| Tool | Version | Purpose |
|------|---------|---------|
| Xcode | 15.x+ | iOS SDK, code signing, .ipa packaging |
| Swift | 5.9+ | SwiftUI frontend compilation |
| cocoapods | Latest | Dependency management |
| fastlane | Latest | App Store deployment automation |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| APPLE_ID | Apple Developer account email | dev@example.com |
| APPLE_PASSWORD | Apple Developer account password | ******** |
| TEAM_ID | Apple Developer Team ID | ABCD123456 |
| CODE_SIGN_IDENTITY | Code signing identity | iPhone Distribution |
| PROVISIONING_PROFILE | Provisioning profile UUID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |

## Dependencies to Install

### Linux

rustup target add aarch64-apple-ios x86_64-apple-ios
cargo install cargo-lipo
cargo install cargo-uniffi

### macOS (GitHub Actions)

`yaml
- uses: actions/setup-swift@v2
  with:
    swift-version: '5.9'
- run: brew install cocoapods fastlane
`

## iOS SDK Components Required

- iOS 17.0+ SDK
- Swift 5.9+ compiler
- LLVM/Clang for C interop
- codesign utility
- xcodebuild

## Output Artifacts

| Artifact | Format | Generated On |
|----------|--------|--------------|
| libvelvet_ios.a | Static library | Linux |
| VelvetOS.swift | Swift bindings | Linux (UniFFI) |
| VelvetOS.h | C header | Linux (UniFFI) |
| VelvetOS.app | iOS app bundle | macOS |
| VelvetOS.ipa | iOS package | macOS |
| VelvetOS.dSYM | Debug symbols | macOS |

## Known Limitations

1. No iOS SDK on Linux: Cannot compile Swift or link against iOS frameworks
2. No code signing on Linux: Cannot sign for App Store distribution
3. No .ipa on Linux: Cannot create installable iOS packages
4. PWA fallback: PWA works on iOS Safari without any native compilation

## Recommended CI/CD

Use GitHub Actions with macos-latest runners for iOS builds:

`yaml
jobs:
  ios-release:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - run: swift build -c release
      - run: xcodebuild -scheme VelvetOS -configuration Release
      - run: xcodebuild -exportArchive ...
      - uses: actions/upload-artifact@v4
        with:
          name: velvet-ios-ipa
          path: ./build/*.ipa
`
