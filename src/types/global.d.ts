export {};

declare global {
  interface Window {
    addDebugLog?: (message: string) => void;
  }
}
