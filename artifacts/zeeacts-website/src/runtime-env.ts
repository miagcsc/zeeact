export type RuntimeEnv = {
  /**
   * Full API origin (including optional base path) to call the backend from.
   * Example: `https://api.example.com` or `http://localhost:3001`
   */
  API_URL?: string;
};

declare global {
  interface Window {
    __ENV?: RuntimeEnv;
  }
}

export function getRuntimeApiBaseUrl(fallbackBaseUrl: string): string {
  const apiUrl = window.__ENV?.API_URL;
  const trimmedFallback = fallbackBaseUrl.replace(/\/$/, "");

  if (typeof apiUrl !== "string") return trimmedFallback;
  const trimmed = apiUrl.trim();
  if (!trimmed) return trimmedFallback;

  return trimmed.replace(/\/$/, "");
}

export {};

