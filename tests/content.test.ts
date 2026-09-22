import { existsSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { carol } from "@/content/carol";
import { convidadas } from "@/content/convidadas";
import { edicoes } from "@/content/edicoes";
import { evento } from "@/content/evento";
import { marca } from "@/content/marca";

const publicPath = (p: string) => `public${p}`;

describe("conteúdo", () => {
  it("whatsapp só tem dígitos com DDI 55", () => {
    expect(marca.whatsapp).toMatch(/^55\d{10,11}$/);
  });

  it("lotes usam status válido", () => {
    for (const lote of evento.lotes) {
      expect(["disponivel", "esgotado", "em-breve"]).toContain(lote.status);
    }
  });

  it("monograma tem canal alpha e cantos transparentes", async () => {
    const { data, info } = await sharp("public/img/brand/monograma.png").raw().toBuffer({ resolveWithObject: true });
    expect(info.channels).toBe(4);
    expect(data[3]).toBe(0);
    const haste = (Math.round(info.height / 2) * info.width + Math.round(info.width * 0.32)) * 4 + 3;
    expect(data[haste]).toBeGreaterThan(200);
  });

  it("fotos referenciadas existem em public/", () => {
    const fotos = [carol.foto, ...convidadas.map((c) => c.foto), ...edicoes.flatMap((e) => e.fotos)];
    for (const foto of fotos) {
      expect(existsSync(publicPath(foto)), foto).toBe(true);
    }
  });
});
