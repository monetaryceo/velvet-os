export class VelvetEncryption {
  static async generateKey(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('velvet-os-salt'), iterations: 250000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  }
  static async encrypt(plaintext: string, key: CryptoKey): Promise<string> {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = enc.encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  }
  static async decrypt(ciphertextB64: string, key: CryptoKey): Promise<string> {
    const dec = new TextDecoder();
    const combined = new Uint8Array(atob(ciphertextB64).split('').map(c => c.charCodeAt(0)));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return dec.decode(decrypted);
  }
}
export class VelvetKeyStore {
  private keys: Map<string, CryptoKey> = new Map();
  async getOrCreateKey(name: string, password?: string): Promise<CryptoKey> {
    if (this.keys.has(name)) return this.keys.get(name)!;
    const key = password ? await VelvetEncryption.generateKey(password) : await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    this.keys.set(name, key);
    return key;
  }
  async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }
  async importKey(exported: string): Promise<CryptoKey> {
    const raw = new Uint8Array(atob(exported).split('').map(c => c.charCodeAt(0)));
    return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
  }
}
export const velvetEncryption = new VelvetEncryption();
export const velvetKeyStore = new VelvetKeyStore();
