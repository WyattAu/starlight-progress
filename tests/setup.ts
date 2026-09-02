import { vi } from 'vitest';

class LocalStorageMock {
  private store = new Map<string, string>();
  getItem(key: string) { return this.store.get(key) ?? null; }
  setItem(key: string, value: string) { this.store.set(key, value); }
  removeItem(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
  get length() { return this.store.size; }
  key(_index: number): string | null { return null; }
}

if (typeof localStorage === 'undefined') {
  vi.stubGlobal('localStorage', new LocalStorageMock());
}
