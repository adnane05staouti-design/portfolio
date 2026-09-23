// Turbopack's Vite-compatible glob import (see Next.js Turbopack docs).
interface ImportMeta {
  glob(pattern: string, options: { eager: true }): Record<string, unknown>;
}
