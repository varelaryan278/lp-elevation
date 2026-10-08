import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("lista só a home, que é a página de conversão", () => {
    expect(sitemap().map((e) => e.url)).toEqual(["https://elevation.com.br/"]);
  });
});

describe("robots", () => {
  it("libera tudo e aponta o sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe("https://elevation.com.br/sitemap.xml");
  });
});
