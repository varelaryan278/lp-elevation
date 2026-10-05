export const META_PIXEL_ID = "2593484331065033";

export const metaEvents = {
  PageView: { eventName: "PageView", parameters: {} },
  GroupLead: { eventName: "Lead", parameters: { content_name: "Grupo WhatsApp" } },
  Lead: { eventName: "Lead", parameters: { content_name: "Patrocinio" } },
} satisfies Record<string, { eventName: string; parameters: Record<string, string> }>;

export type MetaEventName = keyof typeof metaEvents;
export type BrowserMetaEventName = Exclude<MetaEventName, "Lead">;

export const isPublicPath = (pathname: string) =>
  ["", "/evento", "/sobre", "/edicoes"].includes(pathname.replace(/\/$/, ""));
