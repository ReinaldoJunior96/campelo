/// <reference types="vite/client" />

declare global {
  interface Window {
    lucide?: {
      createIcons?: () => void;
    };
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

export {};
