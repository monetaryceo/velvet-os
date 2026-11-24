# iOS Cross-Compilation Guide - Velvet OS

## Overview

This guide describes how to build Velvet OS for iOS from a Linux build server using a split toolchain approach.

## Prerequisites

### Linux Build Server

`ash
rustup target add aarch64-apple-ios x86_64-apple-ios
cargo install cargo-lipo
cargo install cargo-uniffi
`

### macOS CI Runner

GitHub Actions macos-latest runner with Xcode 15+

## Step 1: Build Rust Core (Linux)

cd /root/velvet-os-exact
cargo build --release --target aarch64-apple-ios
cargo build --release --target x86_64-apple-ios
cargo lipo --release --output libvelvet_ios.a

## Step 2: Generate Swift Bindings (Linux)

cargo uniffi-bindgen generate src/velvet.udl --language swift --out-dir swift-bindings

Output:
- swift-bindings/VelvetOS.swift
- swift-bindings/VelvetOS.h

## Step 3: Build iOS App (macOS)

git clone https://github.com/monetaryceo/velvet-os.git
cd velvet-os
swift build -c release --target x86_64-apple-ios
xcodebuild -scheme VelvetOS -configuration Release -sdk iphoneos
xcodebuild -exportArchive -archivePath VelvetOS.xcarchive -exportOptionsPlist export.plist -exportPath ./build

## Step 4: Code Signing

security import Certificates.p12 -k ~/Library/Keychains/login.keychain-db
mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles
cp YourApp.mobileprovision ~/Library/MobileDevice/Provisioning\\ Profiles/
codesign --sign  iPhone Distribution --entitlements Entitlements.plist VelvetOS.app

## Troubleshooting

| Issue | Solution |
|-------|----------|
| cargo-lipo not found | Run cargo install cargo-lipo |
| cargo-uniffi not found | Run cargo install cargo-uniffi |
| iOS SDK not found | Use macOS runner for iOS-specific steps |
| Code signing fails | Ensure Apple Developer account and provisioning profile are configured |
| xcodebuild not found | Only available on macOS |

## Alternative: PWA on iOS

The PWA at /root/velvet-os/dist/ works on iOS Safari via Add to Home Screen without any native compilation or macOS required.

## Related Documents

- IOS_BUILD_STRATEGY.md - Overall build strategy
- IOS_BUILD_REQUIREMENTS.md - Toolchain and dependency requirements
