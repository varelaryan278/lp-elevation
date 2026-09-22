import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets";
const OUT = "public/img";

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
};

const files = (await walk(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const rel = path.relative(SRC, file).replace(/\.(jpe?g|png)$/i, ".webp");
  const dest = path.join(OUT, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(file).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest);
}

const { data, info } = await sharp("assets/brand/monograma.jpg")
  .resize(640, 640)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
const PISO = 24;
const TETO = 100;
for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const lum = Math.max(data[i], data[i + 1], data[i + 2]);
  const a = lum < PISO ? 0 : lum >= TETO ? 255 : Math.round(((lum - PISO) * 255) / (TETO - PISO));
  const k = a === 0 ? 0 : 255 / a;
  rgba[o] = Math.min(255, Math.round(data[i] * k));
  rgba[o + 1] = Math.min(255, Math.round(data[i + 1] * k));
  rgba[o + 2] = Math.min(255, Math.round(data[i + 2] * k));
  rgba[o + 3] = a;
}
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile("public/img/brand/monograma.png");

const monograma = await sharp("assets/brand/monograma.jpg").resize(420, 420).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#0e0a0c" } })
  .composite([{ input: monograma, gravity: "centre" }])
  .png()
  .toFile("public/og.png");
