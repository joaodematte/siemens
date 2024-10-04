class BufferCache<T> {
  private cache: Map<string, T>;

  constructor() {
    this.cache = new Map();
  }

  public getOrSet(key: string, generateFn: () => T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    } else {
      const result = generateFn();
      this.cache.set(key, result);
      return result;
    }
  }

  public clear(): void {
    this.cache.clear();
  }
}
