# Windows Build Strategy - Velvet OS

## Summary

Windows native builds ARE possible from Linux via cross-compilation. The droplet already has:
- Rust toolchain 1.100.0 with x86_64-pc-windows-msvc target installed
- MinGW-w64 (x86_64-w64-mingw32-gcc.exe)

Strategy: Three build tracks:
1. Track A: cargo-xwin cross-compilation -> raw .exe
2. Track B: Tauri 2.0 + NSIS installer -> installable .exe
3. Track C: GitHub Actions windows-latest -> signed MSIX + .exe

## Track A: cargo-xwin (Raw .exe from Linux)

cargo install cargo-xwin
cargo xwin build --release --target x86_64-pc-windows-msvc

Output: target/x86_64-pc-windows-msvc/release/velvet-os.exe

## Track B: Tauri 2.0 + NSIS (Installer from Linux)

cargo add tauri-build
cargo xwin build --release --target x86_64-pc-windows-msvc
makensis velvet-os.nsi

Output: velvet-os-setup.exe

## Track C: GitHub Actions Windows (Signed MSIX)

jobs:
  windows-release:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo build --release --target x86_64-pc-windows-msvc
      - run: cargo tauri build
      - uses: actions/upload-artifact@v4
        with:
          name: velvet-windows-msix
          path: ./src-tauri/target/release/bundle/msix/*.msix

## Windows-Only Features (Requires Windows CI)

| Feature | Linux Cross-Compile | Windows CI |
|---------|--------------------|------------|
| Raw .exe | Yes | Yes |
| NSIS installer | Yes | Yes |
| MSIX package | No | Yes |
| Code signing | No | Yes |
| WinUI 3 UI | No | Yes |
| Windows Service | No | Yes |

## Output Artifacts

| Artifact | Format | Generated On |
|----------|--------|--------------|
| velvet-os.exe | Windows executable | Linux (cargo-xwin) |
| velvet-os-setup.exe | NSIS installer | Linux (cargo-xwin + NSIS) |
| velvet-os.msix | Windows package | Windows CI |
| velvet-os.exe (signed) | Signed executable | Windows CI |

## Related Documents

- WINDOWS_BUILD_REQUIREMENTS.md - Toolchain requirements
- WINDOWS_CROSS_COMPILE_GUIDE.md - Step-by-step guide
