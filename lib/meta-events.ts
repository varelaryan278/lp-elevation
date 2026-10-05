export const META_PIXEL_ID = "2593484331065033";

export const metaEvents = {
  PageView: {},
  Contact: { content_name: "Grupo WhatsApp" },
  InteressePatrocinio: {},
  Lead: { content_name: "Patrocinio" },
} satisfies Record<string, Record<string, string>>;

export type MetaEventName = keyof typeof metaEvents;
export type BrowserMetaEventName = Exclude<MetaEventName, "Lead">;

export const isPublicPath = (pathname: string) =>
  ["", "/evento", "/sobre", "/edicoes"].includes(pathname.replace(/\/$/, ""));
