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

const monograma = await sharp("assets/brand/monograma.jpg").resize(420, 420).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#0e0a0c" } })
  .composite([{ input: monograma, gravity: "centre" }])
  .png()
  .toFile("public/og.png");
