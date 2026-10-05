import { isPublicPath, metaEvents, type BrowserMetaEventName, type MetaEventName } from "./meta-events";
export { META_PIXEL_ID } from "./meta-events";

type Pixel = (
  command: "track" | "trackCustom",
  event: string,
  parameters?: Record<string, string>,
  options?: { eventID: string },
) => void;

declare global {
  interface Window {
    fbq?: Pixel;
  }
}

const pendingPixelEvents: { event: MetaEventName; eventId: string }[] = [];

const trackPixel = (event: MetaEventName, eventId: string) => {
  if (!window.fbq) {
    if (pendingPixelEvents.length < 100) pendingPixelEvents.push({ event, eventId });
    return;
  }
  try {
    window.fbq(event === "InteressePatrocinio" ? "trackCustom" : "track", event, metaEvents[event], { eventID: eventId });
  } catch {
    // Analytics must not interrupt navigation or form interactions.
  }
};

export const flushPixelEvents = () => {
  if (!window.fbq) return;
  for (const { event, eventId } of pendingPixelEvents.splice(0)) trackPixel(event, eventId);
};

export const trackMetaEvent = (eventName: BrowserMetaEventName) => {
  if (!isPublicPath(window.location.pathname)) return;
  const eventId = crypto.randomUUID();
  trackPixel(eventName, eventId);
  const body = JSON.stringify({
    eventName, eventId, eventSourceUrl: `${window.location.origin}${window.location.pathname}`,
  });
  try {
    if (navigator.sendBeacon?.("/api/meta/events/", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/meta/events/", {
      method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must not interrupt navigation or form interactions.
  }
};

export const trackSponsorInterest = () => trackMetaEvent("InteressePatrocinio");
export const trackSponsorLead = (eventId: string) => trackPixel("Lead", eventId);
