export const META_PIXEL_ID = "2593484331065033";

type Pixel = (
  command: "track" | "trackCustom",
  event: string,
  parameters?: Record<string, string>,
) => void;

declare global {
  interface Window {
    fbq?: Pixel;
  }
}

export const trackSponsorInterest = () => {
  window.fbq?.("trackCustom", "InteressePatrocinio");
};

export const trackSponsorLead = () => {
  window.fbq?.("track", "Lead", { content_name: "Patrocinio" });
};
