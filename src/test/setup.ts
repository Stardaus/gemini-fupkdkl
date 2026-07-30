import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Fallbacks for build constants in test runner environment
(globalThis as unknown as Record<string, string>).__APP_BUILD_ID__ = 'v2.0.#20260730.2014';
(globalThis as unknown as Record<string, string>).__APP_BUILD_TIME__ = '30 Jul 2026, 20:14:00';

// Mock matchMedia for dark mode and responsive tests in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill native <dialog> methods if missing in jsdom
if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.open = true;
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.open = false;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
}
