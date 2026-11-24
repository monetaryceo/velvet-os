export class SecureStore {
  private key: CryptoKey | null = null;
  private prefix = 'velvet_secure_';
  async init(password: string): Promise<void> { this.key = await velvetEncryption.generateKey(password); }
  async setItem(key: string, value: string): Promise<void> { if (!this.key) await this.init('default'); const encrypted = await velvetEncryption.encrypt(value, this.key!); localStorage.setItem(this.prefix + key, encrypted); }
  async getItem(key: string): Promise<string | null> { if (!this.key) await this.init('default'); const encrypted = localStorage.getItem(this.prefix + key); if (!encrypted) return null; return await velvetEncryption.decrypt(encrypted, this.key!); }
  async removeItem(key: string): Promise<void> { localStorage.removeItem(this.prefix + key); }
  async clear(): Promise<void> { const keys: string[] = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(this.prefix)) keys.push(k); } for (const k of keys) localStorage.removeItem(k); }
  async setObject<T>(key: string, value: T): Promise<void> { await this.setItem(key, JSON.stringify(value)); }
  async getObject<T>(key: string): Promise<T | null> { const raw = await this.getItem(key); if (!raw) return null; try { return JSON.parse(raw) as T; } catch { return null; } }
}
export const secureStore = new SecureStore();
