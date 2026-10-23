import "@testing-library/jest-dom/vitest";

/* jsdom lacks these browser APIs — minimal stubs so components mount. */

/* jsdom 29+ does not expose localStorage without a url option; provide a
   real Storage implementation so locale persistence works in tests. */
if (typeof window.localStorage === "undefined") {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => [...store.keys()][index] ?? null,
    removeItem: (key: string) => void store.delete(key),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
  };
  Object.defineProperty(window, "localStorage", { value: storage, configurable: true });
}

if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

if (typeof window.IntersectionObserver !== "function") {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (typeof window.ResizeObserver !== "function") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
