export type BinaryFormat = 'pe' | 'elf' | 'mach-o' | 'raw';
export interface PatchResult { originalBytes: number[]; patchedBytes: number[]; offset: number; size: number; sha256Before: string; sha256After: string; }
export class BinaryPatcher {
  static detectFormat(data: Uint8Array): BinaryFormat { if (data.length >= 2 && data[0] === 0x4d && data[1] === 0x5a) return 'pe'; if (data.length >= 4 && data[0] === 0x7f && data[1] === 0x45 && data[2] === 0x4c && data[3] === 0x46) return 'elf'; if (data.length >= 4 && data[0] === 0xca && data[1] === 0xfe && data[2] === 0xba && data[3] === 0xbe) return 'mach-o'; return 'raw'; }
  static patchBytes(data: Uint8Array, offset: number, newBytes: number[]): PatchResult { const original = data.slice(offset, offset + newBytes.length); const patched = new Uint8Array(data); patched.set(newBytes, offset); return { originalBytes: Array.from(original), patchedBytes: Array.from(newBytes), offset, size: newBytes.length, sha256Before: '', sha256After: '' }; }
  static patchNop(data: Uint8Array, offset: number, count: number): PatchResult { const nopBytes = Array(count).fill(0x90); return this.patchBytes(data, offset, nopBytes); }
  static patchNopRegion(data: Uint8Array, offset: number, size: number): PatchResult { return this.patchNop(data, offset, size); }
  static patchCall(data: Uint8Array, offset: number, targetOffset: number): PatchResult { const relOffset = targetOffset - (offset + 5); const bytes = [0xe8, (relOffset & 0xff), ((relOffset >> 8) & 0xff), ((relOffset >> 16) & 0xff), ((relOffset >> 24) & 0xff)]; return this.patchBytes(data, offset, bytes); }
  static patchJmp(data: Uint8Array, offset: number, targetOffset: number): PatchResult { const relOffset = targetOffset - (offset + 5); const bytes = [0xe9, (relOffset & 0xff), ((relOffset >> 8) & 0xff), ((relOffset >> 16) & 0xff), ((relOffset >> 24) & 0xff)]; return this.patchBytes(data, offset, bytes); }
  static inlineHook(data: Uint8Array, offset: number, detourOffset: number): PatchResult { return this.patchCall(data, offset, detourOffset); }
}
export interface PatchBatch { patches: { offset: number; bytes: number[] }[]; results: PatchResult[]; }
export class BatchPatcher {
  static apply(data: Uint8Array, patches: { offset: number; bytes: number[] }[]): PatchResult[] { return patches.map(p => BinaryPatcher.patchBytes(data, p.offset, p.bytes)); }
}
export { BinaryPatcher, BatchPatcher };
export const binaryPatcher = BinaryPatcher;
