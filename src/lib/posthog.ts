import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || "";
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://eu.posthog.com";

export function initPostHog() {
  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
    });
  }
}

export function identifyUser(userId: string, coproName?: string) {
  if (!POSTHOG_KEY) return;
  posthog.identify(userId);
  if (coproName) {
    posthog.group("copro", coproName);
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (!POSTHOG_KEY) return;
  posthog.capture(name, properties);
}

export { posthog };
