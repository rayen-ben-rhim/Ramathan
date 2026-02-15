/**
 * Microsoft Clarity – lightweight loader.
 *
 * Reads the Project ID from VITE_CLARITY_PROJECT_ID.
 * If the variable is missing or empty, nothing is loaded (safe for dev).
 */

export function initClarity() {
  const id = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;
  if (!id) return;

  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${id}`;
  document.head.appendChild(script);
}

// Extend Window so TypeScript knows about clarity
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clarity: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}
