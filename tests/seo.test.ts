import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("lista as quatro rotas com o domínio da marca", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toEqual([
      "https://elevation.com.br/",
      "https://elevation.com.br/evento",
      "https://elevation.com.br/sobre",
      "https://elevation.com.br/edicoes",
    ]);
  });
});

describe("robots", () => {
  it("libera tudo e aponta o sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe("https://elevation.com.br/sitemap.xml");
  });
});
