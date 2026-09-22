# Site institucional Elevation v1 — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site estático do Elevation com 4 rotas (home, evento, sobre, edições) e formulário que abre o WhatsApp com mensagem pronta pra garantir vaga na edição de 12/10.

**Architecture:** Next.js 16 App Router com `output: 'export'`. Conteúdo tipado em `content/`, componentes pequenos em `components/<área>/`, tokens da marca em `@theme` do Tailwind 4. Único estado no cliente: menu mobile e formulário de interesse.

**Tech Stack:** Next.js 16.3.6, React 19.2, Tailwind 4, TypeScript 5, pnpm 11.9.0, Vitest (testes de lógica e markup), sharp (otimização de imagem em build).

**Spec:** `docs/superpowers/specs/2026-09-22-site-institucional-design.md`

## Global Constraints

- Node 24 local, `packageManager` fixado em `pnpm@11.9.0`.
- `next.config.ts`: `output: 'export'`, `images.unoptimized: true`.
- Sem libs de UI, form ou animação. Animações só em CSS.
- Tokens: `ink #0E0A0C`, `wine #3A0E1E`, `plum #2A1030`, `cream #F3EBE1`, `gold #C9A27E`, `gold-light #E2C4A3`.
- Texto sobre escuro: `cream` a 90%. Texto sobre claro: `ink`. Alternância de fundo por seção: `ink → cream → wine → ink`.
- Rótulos uppercase com `tracking-[0.25em]`. Seções com `py-24 md:py-40`, container `max-w-6xl`.
- Todo texto vive em `content/`. Componentes só renderizam.
- `lang="pt-BR"`. Copy no tom do `ideia.md`, sem frase motivacional genérica.
- Código: `const` arrow functions, sem comentários, sem `console.log`.
- Antes de usar qualquer API do Next, conferir `node_modules/next/dist/docs/01-app/`. Pontos já conferidos: `LayoutProps<'/'>` é tipo global (sem import); `sitemap.ts`/`robots.ts` exigem `export const dynamic = 'force-static'` no export estático; `next/font/local` resolve `src` relativo ao arquivo que chama.
- Commits em português, imperativo, arquivos adicionados pelo nome, terminando com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. Nome ou cidade com `&`, `#`, `+` ou acento no formulário: a URL do WhatsApp precisa chegar com a mensagem íntegra. Teste em Task 7.
2. Lote com status `esgotado` ou `em-breve`: o card não pode parecer compra disponível. Teste em Task 8.
3. Lista de convidadas vazia (antes da confirmação dos nomes): a seção some, não renderiza grid vazio com título. Teste em Task 8.
4. Vídeo do hero ausente (`/video/hero.mp4` ainda não gerado): o poster aparece e o layout não quebra. Verificação em Task 13.
5. Título "ELEVATION" com tracking largo em 390px: sem scroll horizontal. Verificação em Task 13.

---

### Task 1: Migrar pra pnpm e instalar ferramentas

**Files:**
- Delete: `package-lock.json`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- Modify: `package.json`, `next.config.ts`
- Create: `vitest.config.ts`, `tests/smoke.test.ts`

**Interfaces:**
- Produces: scripts `pnpm test`, `pnpm images`, alias `@/` funcionando no Vitest.

- [ ] **Step 1: Remover lock do npm e SVGs padrão**

```powershell
Remove-Item package-lock.json, public\file.svg, public\globe.svg, public\next.svg, public\vercel.svg, public\window.svg
```

- [ ] **Step 2: Fixar pnpm e instalar devDependencies**

```powershell
pnpm --version
```
Esperado: `11.9.0`. Se for outro número, usar o número real em `packageManager`.

```powershell
pnpm pkg set packageManager=pnpm@11.9.0
pnpm add -D vitest sharp
pnpm install
```

- [ ] **Step 3: Adicionar scripts ao `package.json`**

Bloco `scripts` final:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "images": "node scripts/optimize-images.mjs"
}
```

- [ ] **Step 4: Configurar export estático em `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 5: Criar `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 6: Criar teste de fumaça `tests/smoke.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("vitest", () => {
  it("roda", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Rodar teste**

Run: `pnpm test`
Esperado: `1 passed`.

- [ ] **Step 8: Commit**

```powershell
git add package.json pnpm-lock.yaml next.config.ts vitest.config.ts tests/smoke.test.ts
git add -u package-lock.json public/
git commit -m @'
Migra pra pnpm, configura export estático e Vitest

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 2: Tokens da marca, fontes e layout raiz

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- Create: `app/fonts.ts`

**Interfaces:**
- Produces: utilitários `bg-ink`, `bg-wine`, `bg-plum`, `bg-cream`, `text-gold`, `bg-gold-light`, `font-serif`, `font-sans`, `animate-fade-up`. Exports `serif` e `sans` de `app/fonts.ts`.

- [ ] **Step 1: Escrever `app/fonts.ts`**

As fontes oficiais ainda não chegaram. Cormorant Garamond é a serif mais próxima do monograma. Quando os `.woff2` oficiais chegarem, só este arquivo muda (trocar por `localFont` de `next/font/local` com `src: './fonts/<arquivo>.woff2'`).

```ts
import { Cormorant_Garamond, Inter } from "next/font/google";

export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-elevation-serif",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-elevation-sans",
  display: "swap",
});
```

- [ ] **Step 2: Reescrever `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: #0e0a0c;
  --color-wine: #3a0e1e;
  --color-plum: #2a1030;
  --color-cream: #f3ebe1;
  --color-gold: #c9a27e;
  --color-gold-light: #e2c4a3;

  --animate-fade-up: fade-up 0.9s ease-out both;

  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

@theme inline {
  --font-serif: var(--font-elevation-serif), Georgia, serif;
  --font-sans: var(--font-elevation-sans), system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-ink);
  color: var(--color-cream);
  font-family: var(--font-sans);
}
```

- [ ] **Step 3: Reescrever `app/layout.tsx`** (Header e Footer entram na Task 6)

```tsx
import type { Metadata } from "next";
import { sans, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elevation.com.br"),
  title: {
    default: "Elevation — Mulheres que vão mais alto",
    template: "%s | Elevation",
  },
  description:
    "Movimento feminino que conecta mulheres que desejam crescer com propósito. Conexão, propósito, crescimento e impacto.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Elevation",
    images: ["/og.png"],
  },
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="pt-BR" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
    <body className="flex min-h-full flex-col">
      <main className="flex-1">{children}</main>
    </body>
  </html>
);

export default RootLayout;
```

- [ ] **Step 4: Reescrever `app/page.tsx` com placeholder temporário de tokens**

```tsx
const Home = () => (
  <div className="flex min-h-svh items-center justify-center bg-ink">
    <h1 className="animate-fade-up font-serif text-6xl uppercase tracking-[0.35em] text-gold">
      Elevation
    </h1>
  </div>
);

export default Home;
```

- [ ] **Step 5: Verificar build**

Run: `pnpm lint; pnpm build`
Esperado: sem erros, pasta `out/` criada com `index.html`.

- [ ] **Step 6: Commit**

```powershell
git add app/fonts.ts app/globals.css app/layout.tsx app/page.tsx
git commit -m @'
Adiciona tokens da marca, fontes e layout raiz

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 3: Conteúdo tipado

**Files:**
- Create: `content/types.ts`, `content/marca.ts`, `content/evento.ts`, `content/convidadas.ts`, `content/carol.ts`, `content/edicoes.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: tipos `Pilar`, `BlocoProgramacao`, `Lote`, `LoteStatus`, `Evento`, `Convidada`, `Edicao`, `NavItem`. Constantes `marca`, `evento`, `convidadas`, `carol`, `edicoes`.

Dados do evento, número do WhatsApp, bios e fotos ainda não foram entregues. Os valores abaixo são provisórios e estão listados na Task 14 pra troca. Fotos referenciam paths que a Task 4 gera.

- [ ] **Step 1: Escrever `content/types.ts`**

```ts
export type NavItem = { label: string; href: string };

export type Pilar = { titulo: string; texto: string };

export type BlocoProgramacao = { horario: string; titulo: string; descricao: string };

export type LoteStatus = "disponivel" | "esgotado" | "em-breve";

export type Lote = { nome: string; valor: string; status: LoteStatus };

export type Evento = {
  edicao: number;
  dataIso: string;
  dataLabel: string;
  horario: string;
  local: string;
  endereco: string;
  cidade: string;
  mapaUrl: string;
  programacao: BlocoProgramacao[];
  lotes: Lote[];
};

export type Convidada = { nome: string; papel: string; bio: string; foto: string };

export type Pessoa = { nome: string; papel: string; bio: string; foto: string };

export type Edicao = {
  titulo: string;
  local: string;
  data: string;
  descricao: string;
  fotos: string[];
};
```

- [ ] **Step 2: Escrever `content/marca.ts`**

```ts
import type { NavItem, Pilar } from "./types";

export const nav: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Evento", href: "/evento" },
  { label: "Sobre", href: "/sobre" },
  { label: "Edições", href: "/edicoes" },
];

export const pilares: Pilar[] = [
  {
    titulo: "Conexão",
    texto:
      "Relações reais entre mulheres. Conversas que dificilmente aconteceriam pelas redes sociais.",
  },
  {
    titulo: "Propósito",
    texto:
      "Crescimento com significado. A pergunta maior: para que eu estou crescendo?",
  },
  {
    titulo: "Impacto",
    texto:
      "O que é vivido aqui não termina quando as luzes se apagam. Uma mulher impactada transforma o que está ao redor.",
  },
];

export const marca = {
  nome: "Elevation",
  assinatura: "Mulheres que vão mais alto",
  subtitulo: "Evento feminino cristão de negócios",
  tagline: "Mais que um evento. Um movimento.",
  descricao:
    "Movimento feminino que conecta mulheres que desejam crescer com propósito. Conexão, propósito, crescimento e impacto.",
  essencia:
    "O Elevation é um movimento feminino criado para conectar mulheres que desejam crescer com propósito, fortalecer sua identidade, ampliar sua visão, construir negócios e relações relevantes e transformar crescimento em impacto.",
  crescimento:
    "Entre os pilares vive o crescimento: conhecimento prático em empreendedorismo, vendas, marca, liderança, comunicação e estratégia, para que cada mulher avance de verdade.",
  frases: {
    visao: "Visão para hoje. Impacto para sempre.",
    virada: "Nem todo encontro é só um evento. Alguns são pontos de virada.",
    proposito: "Não é sobre aparecer. É sobre construir algo que tenha propósito.",
    lotus: [
      "Nem toda mulher que floresce nasceu em terreno fácil.",
      "Florescer também é um ato de coragem.",
      "Autoridade nasce no silêncio do processo.",
    ],
  },
  site: "https://elevation.com.br",
  instagram: "https://instagram.com/elevation",
  email: "contato@elevation.com.br",
  whatsapp: "5543000000000",
};
```

- [ ] **Step 3: Escrever `content/evento.ts`**

```ts
import type { Evento } from "./types";

export const evento: Evento = {
  edicao: 2,
  dataIso: "2026-10-12",
  dataLabel: "12 de outubro",
  horario: "14h às 19h",
  local: "Local a confirmar",
  endereco: "Endereço a confirmar",
  cidade: "Londrina, PR",
  mapaUrl: "https://maps.google.com/?q=Londrina+PR",
  programacao: [
    { horario: "14h", titulo: "Credenciamento e café", descricao: "Recepção, ambientação e primeiras conexões." },
    { horario: "15h", titulo: "Abertura", descricao: "Carol Oliveira apresenta a visão por trás do movimento." },
    { horario: "15h30", titulo: "Histórias que elevam", descricao: "Entrevistas com convidadas sobre bastidores do crescimento." },
    { horario: "17h", titulo: "Networking guiado", descricao: "Dinâmica para que as mulheres realmente se conheçam." },
    { horario: "18h", titulo: "Encerramento", descricao: "Momento de conexão, fotos e despedida." },
  ],
  lotes: [
    { nome: "1º lote", valor: "R$ 197", status: "disponivel" },
    { nome: "2º lote", valor: "R$ 247", status: "em-breve" },
  ],
};
```

- [ ] **Step 4: Escrever `content/convidadas.ts`** (vazio até a confirmação dos nomes)

```ts
import type { Convidada } from "./types";

export const convidadas: Convidada[] = [];
```

- [ ] **Step 5: Escrever `content/carol.ts`**

```ts
import type { Pessoa } from "./types";

export const carol: Pessoa = {
  nome: "Carol Oliveira",
  papel: "Criadora e anfitriã do Elevation",
  bio: "Empresária e mulher que promove conexões. Criou o Elevation para reunir mulheres em torno de conexão, propósito, crescimento e impacto. Conduz entrevistas, abre o evento e transmite a visão por trás do movimento.",
  foto: "/img/carol/retrato.webp",
};
```

- [ ] **Step 6: Escrever `content/edicoes.ts`**

```ts
import type { Edicao } from "./types";

export const edicoes: Edicao[] = [
  {
    titulo: "1ª edição",
    local: "Decol Design, Londrina",
    data: "2025",
    descricao:
      "Um formato intimista: café, histórias reais, entrevistas e conexões entre mulheres, influenciadoras e empreendedoras. Foi ali que ficou claro que o Elevation podia ser maior do que um encontro.",
    fotos: [
      "/img/edicoes/1/01.webp",
      "/img/edicoes/1/02.webp",
      "/img/edicoes/1/03.webp",
    ],
  },
];
```

- [ ] **Step 7: Escrever `tests/content.test.ts`**

```ts
import { existsSync } from "node:fs";
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

  it("fotos referenciadas existem em public/", () => {
    const fotos = [carol.foto, ...convidadas.map((c) => c.foto), ...edicoes.flatMap((e) => e.fotos)];
    for (const foto of fotos) {
      expect(existsSync(publicPath(foto)), foto).toBe(true);
    }
  });
});
```

- [ ] **Step 8: Rodar teste e confirmar que falha**

Run: `pnpm test`
Esperado: FAIL em "fotos referenciadas existem" (a Task 4 gera as imagens). Os outros dois passam.

- [ ] **Step 9: Commit (o teste de fotos passa na Task 4)**

```powershell
git add content/types.ts content/marca.ts content/evento.ts content/convidadas.ts content/carol.ts content/edicoes.ts tests/content.test.ts
git commit -m @'
Adiciona conteúdo tipado da marca, evento e edições

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 4: Pipeline de imagens com sharp

**Files:**
- Create: `scripts/optimize-images.mjs`, `assets/brand/monograma.jpg`, `assets/hero/poster.jpg`, `assets/carol/retrato.jpg`, `assets/edicoes/1/01.jpg`, `assets/edicoes/1/02.jpg`, `assets/edicoes/1/03.jpg`
- Generate: `public/img/**/*.webp`, `public/og.png`

**Interfaces:**
- Produces: `/img/brand/monograma.webp` (E dourado sobre preto, usado com `mix-blend-screen` só em fundo escuro), `/img/hero/poster.webp`, `/img/carol/retrato.webp`, `/img/edicoes/1/0N.webp`, `/og.png`.

Assets provisórios vêm de `C:\Dev\elevation\midia`. Serão trocados na Task 14.

- [ ] **Step 1: Copiar assets provisórios**

```powershell
New-Item -ItemType Directory -Force assets\brand, assets\hero, assets\carol, assets\edicoes\1 | Out-Null
$m = 'C:\Dev\elevation\midia'
Copy-Item "$m\WhatsApp Image 2026-09-22 at 16.03.11 (1).jpeg" assets\brand\monograma.jpg
Copy-Item "$m\WhatsApp Image 2026-09-22 at 16.03.11.jpeg" assets\hero\poster.jpg
Copy-Item "$m\WhatsApp Image 2026-09-22 at 15.46.53.jpeg" assets\carol\retrato.jpg
Copy-Item "$m\WhatsApp Image 2026-09-22 at 15.46.52.jpeg" assets\edicoes\1\01.jpg
Copy-Item "$m\WhatsApp Image 2026-09-22 at 15.46.53.jpeg" assets\edicoes\1\02.jpg
Copy-Item "$m\WhatsApp Image 2026-09-22 at 15.49.07.jpeg" assets\edicoes\1\03.jpg
```

- [ ] **Step 2: Escrever `scripts/optimize-images.mjs`**

```js
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
```

- [ ] **Step 3: Rodar o script**

Run: `pnpm images`
Esperado: sem erro. Conferir com `Get-ChildItem -Recurse public\img, public\og.png`.

- [ ] **Step 4: Rodar testes**

Run: `pnpm test`
Esperado: todos passam, incluindo "fotos referenciadas existem".

- [ ] **Step 5: Commit**

```powershell
git add scripts/optimize-images.mjs assets public/img public/og.png
git commit -m @'
Adiciona pipeline de imagens e assets provisórios

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 5: Primitivos de UI

**Files:**
- Create: `components/ui/Section.tsx`, `components/ui/Eyebrow.tsx`, `components/ui/Button.tsx`, `components/ui/Monograma.tsx`
- Test: `tests/ui.test.tsx`

**Interfaces:**
- Produces:
  - `Section({ bg: 'ink'|'cream'|'wine'|'plum', id?, className?, children })`
  - `Eyebrow({ children, className? })`
  - `Button({ href, variant?: 'primary'|'outline', className?, children })`
  - `Monograma({ size: number, className?, priority? })`, só em fundo escuro.

- [ ] **Step 1: Escrever `tests/ui.test.tsx`**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

describe("Section", () => {
  it("aplica fundo e texto por variante", () => {
    const html = renderToStaticMarkup(<Section bg="cream">x</Section>);
    expect(html).toContain("bg-cream");
    expect(html).toContain("text-ink");
  });

  it("usa texto cream em fundos escuros", () => {
    for (const bg of ["ink", "wine", "plum"] as const) {
      expect(renderToStaticMarkup(<Section bg={bg}>x</Section>)).toContain("text-cream/90");
    }
  });

  it("propaga id pra âncora", () => {
    expect(renderToStaticMarkup(<Section bg="ink" id="interesse">x</Section>)).toContain('id="interesse"');
  });
});

describe("Eyebrow", () => {
  it("usa tracking largo e gold", () => {
    const html = renderToStaticMarkup(<Eyebrow>Conexão</Eyebrow>);
    expect(html).toContain("tracking-[0.25em]");
    expect(html).toContain("text-gold");
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `pnpm test`
Esperado: FAIL por módulo não encontrado.

- [ ] **Step 3: Escrever `components/ui/Section.tsx`**

```tsx
import type { ReactNode } from "react";

const variants = {
  ink: "bg-ink text-cream/90",
  cream: "bg-cream text-ink",
  wine: "bg-wine text-cream/90",
  plum: "bg-plum text-cream/90",
} as const;

export type SectionBg = keyof typeof variants;

type Props = { bg: SectionBg; id?: string; className?: string; children: ReactNode };

export const Section = ({ bg, id, className = "", children }: Props) => (
  <section id={id} className={`${variants[bg]} py-24 md:py-40 ${className}`}>
    <div className="mx-auto max-w-6xl px-6">{children}</div>
  </section>
);
```

- [ ] **Step 4: Escrever `components/ui/Eyebrow.tsx`**

```tsx
import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export const Eyebrow = ({ children, className = "" }: Props) => (
  <p className={`font-sans text-xs uppercase tracking-[0.25em] text-gold ${className}`}>{children}</p>
);
```

- [ ] **Step 5: Escrever `components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary: "bg-gold text-ink hover:bg-gold-light",
  outline: "border border-gold text-gold hover:bg-gold hover:text-ink",
} as const;

type Props = {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

export const Button = ({ href, variant = "primary", className = "", children }: Props) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] transition-colors duration-300 ${variants[variant]} ${className}`}
  >
    {children}
  </Link>
);
```

- [ ] **Step 6: Escrever `components/ui/Monograma.tsx`**

```tsx
import Image from "next/image";

type Props = { size: number; className?: string; priority?: boolean };

export const Monograma = ({ size, className = "", priority = false }: Props) => (
  <Image
    src="/img/brand/monograma.webp"
    alt="Monograma Elevation"
    width={size}
    height={size}
    priority={priority}
    className={`mix-blend-screen ${className}`}
  />
);
```

- [ ] **Step 7: Rodar testes**

Run: `pnpm test`
Esperado: todos passam.

- [ ] **Step 8: Commit**

```powershell
git add components/ui/Section.tsx components/ui/Eyebrow.tsx components/ui/Button.tsx components/ui/Monograma.tsx tests/ui.test.tsx
git commit -m @'
Adiciona primitivos de UI

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 6: Header, menu mobile e Footer

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/MobileMenu.tsx`, `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `nav`, `pilares`, `marca` de `content/marca.ts`; `Monograma`, `Button`, `Eyebrow`.
- Produces: `Header`, `Footer` (Server Components), `MobileMenu` (Client Component). Desvio do spec: o menu mobile precisa de estado pra fechar após navegação client-side, então `MobileMenu.tsx` é o segundo Client Component além de `Interesse.tsx`.

- [ ] **Step 1: Escrever `components/layout/MobileMenu.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/content/types";

type Props = { items: NavItem[] };

export const MobileMenu = ({ items }: Props) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="font-sans text-xs uppercase tracking-[0.25em] text-cream"
      >
        {open ? "Fechar" : "Menu"}
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-wine">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="font-serif text-3xl uppercase tracking-[0.3em] text-cream"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/evento#interesse"
            onClick={close}
            className="mt-6 bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink"
          >
            Garantir vaga
          </Link>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Escrever `components/layout/Header.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Monograma } from "@/components/ui/Monograma";
import { marca, nav } from "@/content/marca";
import { MobileMenu } from "./MobileMenu";

export const Header = () => (
  <header className="fixed inset-x-0 top-0 z-50 bg-ink/80 backdrop-blur">
    <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
      <Link href="/" aria-label="Elevation, início" className="relative z-50 flex items-center gap-3">
        <Monograma size={40} priority />
        <span className="font-serif text-lg uppercase tracking-[0.3em] text-cream">{marca.nome}</span>
      </Link>
      <nav className="hidden items-center gap-10 md:flex">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-sans text-xs uppercase tracking-[0.25em] text-cream/80 transition-colors hover:text-gold"
          >
            {item.label}
          </Link>
        ))}
        <Button href="/evento#interesse">Garantir vaga</Button>
      </nav>
      <div className="relative z-50">
        <MobileMenu items={nav} />
      </div>
    </div>
  </header>
);
```

- [ ] **Step 3: Escrever `components/layout/Footer.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Monograma } from "@/components/ui/Monograma";
import { marca, pilares } from "@/content/marca";

export const Footer = () => (
  <footer className="bg-ink py-16 text-cream/80">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 text-center">
      <Monograma size={56} />
      <Eyebrow>{pilares.map((p) => p.titulo).join(" • ")}</Eyebrow>
      <p className="font-serif text-xl italic text-cream">{marca.tagline}</p>
      <nav className="flex flex-wrap justify-center gap-8 font-sans text-xs uppercase tracking-[0.25em]">
        <a href={marca.instagram} target="_blank" rel="noopener" className="hover:text-gold">
          Instagram
        </a>
        <a href={`https://wa.me/${marca.whatsapp}`} target="_blank" rel="noopener" className="hover:text-gold">
          WhatsApp
        </a>
        <a href={`mailto:${marca.email}`} className="hover:text-gold">
          E-mail
        </a>
      </nav>
      <p className="font-sans text-xs text-cream/50">
        © {new Date().getFullYear()} {marca.nome}. {marca.assinatura}.
      </p>
    </div>
  </footer>
);
```

- [ ] **Step 4: Ligar no `app/layout.tsx`**

Trocar o `<body>` por:

```tsx
    <body className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </body>
```

E adicionar os imports no topo:

```tsx
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
```

- [ ] **Step 5: Verificar no dev server**

Run: `pnpm dev` e abrir `http://localhost:3000` em 1440px e 390px.
Esperado: header fixo com monograma sem fundo preto visível (blend sobre `ink`), nav desktop com CTA, botão "Menu" no mobile abrindo overlay vinho e fechando ao clicar em um link. Footer com pilares e três links.

- [ ] **Step 6: Commit**

```powershell
git add components/layout/Header.tsx components/layout/MobileMenu.tsx components/layout/Footer.tsx app/layout.tsx
git commit -m @'
Adiciona header, menu mobile e footer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 7: Montagem da URL do WhatsApp

**Files:**
- Create: `lib/whatsapp.ts`
- Test: `tests/whatsapp.test.ts`

**Interfaces:**
- Produces:
  - `type Interesse = { nome: string; whatsapp: string; cidade: string; origem: string }`
  - `buildMensagem(interesse: Interesse, dataLabel: string): string`
  - `buildWhatsAppUrl(numero: string, mensagem: string): string`

- [ ] **Step 1: Escrever `tests/whatsapp.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildMensagem, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildMensagem", () => {
  it("monta a mensagem no formato combinado", () => {
    const msg = buildMensagem(
      { nome: "Ana Paula", whatsapp: "43999990000", cidade: "Londrina", origem: "Instagram" },
      "12/10",
    );
    expect(msg).toBe(
      "Olá! Quero garantir minha vaga no Elevation 12/10. Nome: Ana Paula | WhatsApp: 43999990000 | Cidade: Londrina | Conheci por: Instagram",
    );
  });
});

describe("buildWhatsAppUrl", () => {
  it("usa wa.me com o número e a mensagem codificada", () => {
    const url = buildWhatsAppUrl("5543999140409", "Olá! Tudo bem?");
    expect(url).toBe("https://wa.me/5543999140409?text=Ol%C3%A1!%20Tudo%20bem%3F");
  });

  it("preserva caracteres reservados como &, # e +", () => {
    const url = buildWhatsAppUrl("5543999140409", "A & B #1 + C");
    expect(url).toContain("A%20%26%20B%20%231%20%2B%20C");
    expect(decodeURIComponent(new URL(url).searchParams.get("text") ?? "")).toBe("A & B #1 + C");
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `pnpm test tests/whatsapp.test.ts`
Esperado: FAIL por módulo não encontrado.

- [ ] **Step 3: Escrever `lib/whatsapp.ts`**

```ts
export type Interesse = { nome: string; whatsapp: string; cidade: string; origem: string };

export const buildMensagem = (i: Interesse, dataLabel: string) =>
  `Olá! Quero garantir minha vaga no Elevation ${dataLabel}. Nome: ${i.nome} | WhatsApp: ${i.whatsapp} | Cidade: ${i.cidade} | Conheci por: ${i.origem}`;

export const buildWhatsAppUrl = (numero: string, mensagem: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
```

- [ ] **Step 4: Rodar testes**

Run: `pnpm test`
Esperado: todos passam.

- [ ] **Step 5: Commit**

```powershell
git add lib/whatsapp.ts tests/whatsapp.test.ts
git commit -m @'
Adiciona montagem da URL do WhatsApp

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 8: Página do evento

**Files:**
- Create: `components/evento/Detalhes.tsx`, `components/evento/Programacao.tsx`, `components/evento/Convidadas.tsx`, `components/evento/Lotes.tsx`, `components/evento/Interesse.tsx`, `app/evento/page.tsx`
- Test: `tests/evento.test.tsx`

**Interfaces:**
- Consumes: `evento`, `convidadas`, `marca`; `Section`, `Eyebrow`, `Button`; `buildMensagem`, `buildWhatsAppUrl`.
- Produces: `Detalhes({ evento })`, `Programacao({ blocos })`, `Convidadas({ convidadas })` (retorna `null` se vazio), `Lotes({ lotes })`, `Interesse({ numero, dataLabel })`.

- [ ] **Step 1: Escrever `tests/evento.test.tsx`**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Convidadas } from "@/components/evento/Convidadas";
import { Lotes } from "@/components/evento/Lotes";
import { Programacao } from "@/components/evento/Programacao";

describe("Lotes", () => {
  it("mostra rótulo por status e só aponta pro formulário quando disponível", () => {
    const html = renderToStaticMarkup(
      <Lotes
        lotes={[
          { nome: "1º lote", valor: "R$ 197", status: "disponivel" },
          { nome: "2º lote", valor: "R$ 247", status: "esgotado" },
          { nome: "3º lote", valor: "R$ 297", status: "em-breve" },
        ]}
      />,
    );
    expect(html).toContain("Esgotado");
    expect(html).toContain("Em breve");
    expect(html.match(/href="#interesse"/g)).toHaveLength(1);
  });
});

describe("Convidadas", () => {
  it("não renderiza nada com lista vazia", () => {
    expect(renderToStaticMarkup(<Convidadas convidadas={[]} />)).toBe("");
  });
});

describe("Programacao", () => {
  it("lista horário e título de cada bloco", () => {
    const html = renderToStaticMarkup(
      <Programacao blocos={[{ horario: "14h", titulo: "Café", descricao: "Chegada." }]} />,
    );
    expect(html).toContain("14h");
    expect(html).toContain("Café");
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `pnpm test tests/evento.test.tsx`
Esperado: FAIL por módulo não encontrado.

- [ ] **Step 3: Escrever `components/evento/Detalhes.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Evento } from "@/content/types";

type Props = { evento: Evento };

export const Detalhes = ({ evento }: Props) => (
  <Section bg="ink" className="pt-40">
    <Eyebrow>{evento.edicao}ª edição</Eyebrow>
    <h1 className="mt-6 font-serif text-5xl uppercase tracking-[0.2em] text-cream md:text-7xl">
      {evento.dataLabel}
    </h1>
    <dl className="mt-12 grid gap-8 font-sans text-sm md:grid-cols-3">
      <div>
        <dt className="text-xs uppercase tracking-[0.25em] text-gold">Horário</dt>
        <dd className="mt-2 text-lg">{evento.horario}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.25em] text-gold">Local</dt>
        <dd className="mt-2 text-lg">{evento.local}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.25em] text-gold">Endereço</dt>
        <dd className="mt-2 text-lg">
          {evento.endereco}, {evento.cidade}
          <br />
          <a href={evento.mapaUrl} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
            Ver no mapa
          </a>
        </dd>
      </div>
    </dl>
  </Section>
);
```

- [ ] **Step 4: Escrever `components/evento/Programacao.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { BlocoProgramacao } from "@/content/types";

type Props = { blocos: BlocoProgramacao[] };

export const Programacao = ({ blocos }: Props) => (
  <Section bg="cream">
    <Eyebrow>Programação</Eyebrow>
    <ol className="mt-12 divide-y divide-ink/10">
      {blocos.map((b) => (
        <li key={b.horario} className="grid gap-2 py-8 md:grid-cols-[8rem_1fr]">
          <span className="font-serif text-2xl text-gold">{b.horario}</span>
          <div>
            <h3 className="font-serif text-2xl">{b.titulo}</h3>
            <p className="mt-2 font-sans text-sm text-ink/70">{b.descricao}</p>
          </div>
        </li>
      ))}
    </ol>
  </Section>
);
```

- [ ] **Step 5: Escrever `components/evento/Convidadas.tsx`**

```tsx
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Convidada } from "@/content/types";

type Props = { convidadas: Convidada[] };

export const Convidadas = ({ convidadas }: Props) => {
  if (convidadas.length === 0) return null;

  return (
    <Section bg="wine">
      <Eyebrow>Convidadas</Eyebrow>
      <ul className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {convidadas.map((c) => (
          <li key={c.nome}>
            <Image src={c.foto} alt={c.nome} width={600} height={750} className="aspect-[4/5] w-full object-cover" />
            <h3 className="mt-6 font-serif text-2xl text-cream">{c.nome}</h3>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.25em] text-gold">{c.papel}</p>
            <p className="mt-4 font-sans text-sm text-cream/70">{c.bio}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
};
```

- [ ] **Step 6: Escrever `components/evento/Lotes.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Lote, LoteStatus } from "@/content/types";

const rotulo: Record<LoteStatus, string> = {
  disponivel: "Disponível",
  esgotado: "Esgotado",
  "em-breve": "Em breve",
};

type Props = { lotes: Lote[] };

export const Lotes = ({ lotes }: Props) => (
  <Section bg="ink">
    <Eyebrow>Ingressos</Eyebrow>
    <ul className="mt-12 grid gap-6 md:grid-cols-3">
      {lotes.map((l) => {
        const ativo = l.status === "disponivel";
        return (
          <li
            key={l.nome}
            className={`border p-8 ${ativo ? "border-gold" : "border-cream/20 opacity-60"}`}
          >
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">{l.nome}</p>
            <p className="mt-4 font-serif text-4xl text-cream">{l.valor}</p>
            <p className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-cream/70">{rotulo[l.status]}</p>
            {ativo && (
              <a
                href="#interesse"
                className="mt-8 inline-flex bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
              >
                Garantir vaga
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </Section>
);
```

- [ ] **Step 7: Escrever `components/evento/Interesse.tsx`**

```tsx
"use client";

import type { FormEvent } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { buildMensagem, buildWhatsAppUrl } from "@/lib/whatsapp";

const origens = ["Instagram", "Indicação", "Edição anterior", "Outro"];

const campo =
  "w-full border-b border-cream/30 bg-transparent py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-gold";

type Props = { numero: string; dataLabel: string };

export const Interesse = ({ numero, dataLabel }: Props) => {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const mensagem = buildMensagem(
      { nome: get("nome"), whatsapp: get("whatsapp"), cidade: get("cidade"), origem: get("origem") },
      dataLabel,
    );
    window.open(buildWhatsAppUrl(numero, mensagem), "_blank", "noopener");
  };

  return (
    <Section bg="plum" id="interesse">
      <div className="mx-auto max-w-xl">
        <Eyebrow>Garantir vaga</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl text-cream">Quero estar nesse ambiente.</h2>
        <p className="mt-4 font-sans text-sm text-cream/70">
          Preencha e a gente continua a conversa no WhatsApp.
        </p>
        <form onSubmit={onSubmit} className="mt-12 grid gap-8">
          <input name="nome" placeholder="Nome" required autoComplete="name" className={campo} />
          <input name="whatsapp" type="tel" placeholder="WhatsApp com DDD" required autoComplete="tel" className={campo} />
          <input name="cidade" placeholder="Cidade" required autoComplete="address-level2" className={campo} />
          <select name="origem" required defaultValue="" className={`${campo} appearance-none`}>
            <option value="" disabled>
              Como conheceu o Elevation?
            </option>
            {origens.map((o) => (
              <option key={o} value={o} className="text-ink">
                {o}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="mt-4 bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            Continuar no WhatsApp
          </button>
        </form>
      </div>
    </Section>
  );
};
```

- [ ] **Step 8: Escrever `app/evento/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Convidadas } from "@/components/evento/Convidadas";
import { Detalhes } from "@/components/evento/Detalhes";
import { Interesse } from "@/components/evento/Interesse";
import { Lotes } from "@/components/evento/Lotes";
import { Programacao } from "@/components/evento/Programacao";
import { convidadas } from "@/content/convidadas";
import { evento } from "@/content/evento";
import { marca } from "@/content/marca";

export const metadata: Metadata = {
  title: `Evento ${evento.dataLabel}`,
  description: `${evento.edicao}ª edição do Elevation em ${evento.cidade}. ${marca.tagline}`,
};

const EventoPage = () => (
  <>
    <Detalhes evento={evento} />
    <Programacao blocos={evento.programacao} />
    <Convidadas convidadas={convidadas} />
    <Lotes lotes={evento.lotes} />
    <Interesse numero={marca.whatsapp} dataLabel={evento.dataLabel} />
  </>
);

export default EventoPage;
```

- [ ] **Step 9: Rodar testes**

Run: `pnpm test`
Esperado: todos passam.

- [ ] **Step 10: Verificar no dev server**

Run: `pnpm dev`, abrir `http://localhost:3000/evento`.
Esperado: cinco seções na ordem ink → cream → (wine omitida por lista vazia) → ink → plum. Preencher o formulário e enviar abre nova aba `wa.me` com a mensagem preenchida.

- [ ] **Step 11: Commit**

```powershell
git add components/evento app/evento/page.tsx tests/evento.test.tsx
git commit -m @'
Adiciona página do evento com formulário de interesse

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 9: Home

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/Manifesto.tsx`, `components/home/Pilares.tsx`, `components/home/EventoTeaser.tsx`, `components/home/Carol.tsx`, `components/home/Galeria.tsx`, `components/home/CtaFinal.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `marca`, `pilares`, `evento`, `carol`, `edicoes`; primitivos de UI.
- Produces: `CtaFinal` sem props (reutilizado em `/sobre`).

- [ ] **Step 1: Escrever `components/home/Hero.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Monograma } from "@/components/ui/Monograma";
import { marca, pilares } from "@/content/marca";

export const Hero = () => (
  <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink text-center">
    <video
      className="absolute inset-0 h-full w-full object-cover opacity-40"
      autoPlay
      muted
      loop
      playsInline
      poster="/img/hero/poster.webp"
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-linear-to-b from-ink/40 via-ink/60 to-ink" />
    <div className="relative animate-fade-up px-6 pt-20">
      <Monograma size={160} priority className="mx-auto" />
      <h1 className="mt-8 font-serif text-4xl uppercase tracking-[0.35em] text-cream sm:text-5xl md:text-7xl">
        {marca.nome}
      </h1>
      <p className="mt-4 font-serif text-xl italic text-gold md:text-2xl">{marca.assinatura}</p>
      <Eyebrow className="mt-10">{pilares.map((p) => p.titulo).join(" • ")}</Eyebrow>
      <Button href="/evento#interesse" className="mt-12">
        Garantir vaga
      </Button>
    </div>
  </section>
);
```

- [ ] **Step 2: Escrever `components/home/Manifesto.tsx`**

```tsx
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const Manifesto = () => (
  <Section bg="cream">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-serif text-4xl leading-tight md:text-6xl">{marca.tagline}</h2>
      <p className="mt-10 font-sans text-base leading-relaxed text-ink/70 md:text-lg">{marca.essencia}</p>
    </div>
  </Section>
);
```

- [ ] **Step 3: Escrever `components/home/Pilares.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca, pilares } from "@/content/marca";

export const Pilares = () => (
  <Section bg="wine">
    <Eyebrow className="text-center">Pilares</Eyebrow>
    <ul className="mt-16 grid gap-12 md:grid-cols-3">
      {pilares.map((p) => (
        <li key={p.titulo} className="text-center">
          <h3 className="font-serif text-3xl uppercase tracking-[0.2em] text-cream">{p.titulo}</h3>
          <p className="mt-6 font-sans text-sm leading-relaxed text-cream/70">{p.texto}</p>
        </li>
      ))}
    </ul>
    <p className="mx-auto mt-20 max-w-2xl text-center font-serif text-xl italic text-gold">{marca.crescimento}</p>
  </Section>
);
```

- [ ] **Step 4: Escrever `components/home/EventoTeaser.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { evento } from "@/content/evento";

export const EventoTeaser = () => (
  <Section bg="ink">
    <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow>Próxima edição</Eyebrow>
        <p className="mt-6 font-serif text-5xl uppercase tracking-[0.2em] text-cream md:text-7xl">{evento.dataLabel}</p>
        <p className="mt-4 font-sans text-sm text-cream/70">
          {evento.local} · {evento.cidade}
        </p>
      </div>
      <Button href="/evento" variant="outline">
        Ver o evento
      </Button>
    </div>
  </Section>
);
```

- [ ] **Step 5: Escrever `components/home/Carol.tsx`**

```tsx
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { carol } from "@/content/carol";

export const Carol = () => (
  <Section bg="cream">
    <div className="grid items-center gap-12 md:grid-cols-2">
      <Image src={carol.foto} alt={carol.nome} width={900} height={1125} className="aspect-[4/5] w-full object-cover" />
      <div>
        <Eyebrow>{carol.papel}</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl md:text-5xl">{carol.nome}</h2>
        <p className="mt-8 font-sans text-base leading-relaxed text-ink/70">{carol.bio}</p>
      </div>
    </div>
  </Section>
);
```

- [ ] **Step 6: Escrever `components/home/Galeria.tsx`**

```tsx
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { edicoes } from "@/content/edicoes";

export const Galeria = () => {
  const ultima = edicoes[0];

  return (
    <Section bg="plum">
      <Eyebrow>{ultima.titulo}</Eyebrow>
      <h2 className="mt-6 font-serif text-4xl text-cream">{ultima.local}</h2>
      <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {ultima.fotos.slice(0, 6).map((foto) => (
          <li key={foto}>
            <Image src={foto} alt="" width={800} height={800} className="aspect-square w-full object-cover" />
          </li>
        ))}
      </ul>
      <Button href="/edicoes" variant="outline" className="mt-12">
        Ver edições
      </Button>
    </Section>
  );
};
```

- [ ] **Step 7: Escrever `components/home/CtaFinal.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const CtaFinal = () => (
  <Section bg="ink">
    <div className="text-center">
      <h2 className="font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.visao}</h2>
      <Button href="/evento#interesse" className="mt-12">
        Garantir vaga
      </Button>
    </div>
  </Section>
);
```

- [ ] **Step 8: Reescrever `app/page.tsx`**

```tsx
import { Carol } from "@/components/home/Carol";
import { CtaFinal } from "@/components/home/CtaFinal";
import { EventoTeaser } from "@/components/home/EventoTeaser";
import { Galeria } from "@/components/home/Galeria";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Pilares } from "@/components/home/Pilares";

const Home = () => (
  <>
    <Hero />
    <Manifesto />
    <Pilares />
    <EventoTeaser />
    <Carol />
    <Galeria />
    <CtaFinal />
  </>
);

export default Home;
```

- [ ] **Step 9: Verificar no dev server**

Run: `pnpm dev`, abrir `http://localhost:3000` em 1440px e 390px.
Esperado: hero ocupa a tela com poster (vídeo ainda não existe, poster aparece), sete seções alternando fundo, nenhum scroll horizontal em 390px.

- [ ] **Step 10: Commit**

```powershell
git add components/home app/page.tsx
git commit -m @'
Adiciona home com hero, manifesto, pilares e galeria

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 10: Página Sobre

**Files:**
- Create: `components/sobre/Historia.tsx`, `components/sobre/Lotus.tsx`, `components/sobre/FeProposito.tsx`, `app/sobre/page.tsx`

**Interfaces:**
- Consumes: `marca`, `edicoes`; `CtaFinal`; primitivos.

- [ ] **Step 1: Escrever `components/sobre/Historia.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { edicoes } from "@/content/edicoes";
import { marca } from "@/content/marca";

export const Historia = () => (
  <Section bg="ink" className="pt-40">
    <Eyebrow>Sobre</Eyebrow>
    <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.virada}</h1>
    <div className="mt-16 grid gap-12 font-sans text-base leading-relaxed text-cream/70 md:grid-cols-2">
      <p>
        O Elevation nasceu do desejo de criar um ambiente feminino diferente dos eventos tradicionais. Não um lugar
        onde algumas pessoas sobem ao palco, contam histórias e o público vai embora. Um lugar de conexão verdadeira,
        troca de experiências e histórias reais.
      </p>
      <p>
        A primeira edição, na {edicoes[0].local}, teve formato intimista: café, entrevistas, conversas e networking.
        Foi ali que ficou claro que o Elevation podia ser maior do que um encontro. De um encontro feminino, virou um
        movimento de crescimento e conexão.
      </p>
    </div>
  </Section>
);
```

- [ ] **Step 2: Escrever `components/sobre/Lotus.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const Lotus = () => (
  <Section bg="cream">
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>A flor de lótus</Eyebrow>
      <p className="mt-10 font-sans text-base leading-relaxed text-ink/70">
        Mulheres que nem sempre começaram em circunstâncias fáceis, mas que atravessaram processos, dores e decisões e,
        ainda assim, floresceram. Não é sobre romantizar o sofrimento. É sobre saber que uma trajetória difícil não
        determina onde uma mulher precisa terminar.
      </p>
      <ul className="mt-16 space-y-8">
        {marca.frases.lotus.map((f) => (
          <li key={f} className="font-serif text-2xl italic text-wine md:text-3xl">
            {f}
          </li>
        ))}
      </ul>
    </div>
  </Section>
);
```

- [ ] **Step 3: Escrever `components/sobre/FeProposito.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const FeProposito = () => (
  <Section bg="wine">
    <div className="grid gap-12 md:grid-cols-2 md:items-center">
      <div>
        <Eyebrow>Fé e propósito</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl leading-tight text-cream md:text-5xl">{marca.frases.proposito}</h2>
      </div>
      <p className="font-sans text-base leading-relaxed text-cream/70">
        O Elevation parte de uma visão cristã de vida e propósito. A espiritualidade aparece com elegância e verdade,
        em assuntos como identidade, chamado, família, valores, coragem, serviço e legado. Um ambiente onde mulheres
        crescem profissionalmente sem separar o que fazem daquilo em que acreditam e da mulher que estão se tornando.
      </p>
    </div>
  </Section>
);
```

- [ ] **Step 4: Escrever `app/sobre/page.tsx`**

```tsx
import type { Metadata } from "next";
import { CtaFinal } from "@/components/home/CtaFinal";
import { FeProposito } from "@/components/sobre/FeProposito";
import { Historia } from "@/components/sobre/Historia";
import { Lotus } from "@/components/sobre/Lotus";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Como o Elevation nasceu, o conceito da flor de lótus e a essência de fé e propósito do movimento.",
};

const SobrePage = () => (
  <>
    <Historia />
    <Lotus />
    <FeProposito />
    <CtaFinal />
  </>
);

export default SobrePage;
```

- [ ] **Step 5: Verificar no dev server**

Run: `pnpm dev`, abrir `http://localhost:3000/sobre`.
Esperado: quatro seções ink → cream → wine → ink, título não colide com o header fixo.

- [ ] **Step 6: Commit**

```powershell
git add components/sobre app/sobre/page.tsx
git commit -m @'
Adiciona página sobre

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 11: Página Edições

**Files:**
- Create: `components/edicoes/EdicaoGaleria.tsx`, `app/edicoes/page.tsx`

**Interfaces:**
- Consumes: `edicoes`; primitivos.
- Produces: `EdicaoGaleria({ edicao, bg })`.

- [ ] **Step 1: Escrever `components/edicoes/EdicaoGaleria.tsx`**

```tsx
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section, type SectionBg } from "@/components/ui/Section";
import type { Edicao } from "@/content/types";

type Props = { edicao: Edicao; bg: SectionBg; className?: string };

export const EdicaoGaleria = ({ edicao, bg, className }: Props) => (
  <Section bg={bg} className={className}>
    <Eyebrow>{edicao.data}</Eyebrow>
    <h2 className="mt-6 font-serif text-4xl md:text-6xl">{edicao.titulo}</h2>
    <p className="mt-2 font-sans text-sm opacity-70">{edicao.local}</p>
    <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed opacity-70">{edicao.descricao}</p>
    <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
      {edicao.fotos.map((foto) => (
        <li key={foto}>
          <Image src={foto} alt="" width={800} height={800} className="aspect-square w-full object-cover" />
        </li>
      ))}
    </ul>
  </Section>
);
```

- [ ] **Step 2: Escrever `app/edicoes/page.tsx`**

```tsx
import type { Metadata } from "next";
import { EdicaoGaleria } from "@/components/edicoes/EdicaoGaleria";
import { CtaFinal } from "@/components/home/CtaFinal";
import { edicoes } from "@/content/edicoes";

export const metadata: Metadata = {
  title: "Edições",
  description: "Fotos e histórias das edições do Elevation.",
};

const fundos = ["ink", "cream", "wine"] as const;

const EdicoesPage = () => (
  <>
    {edicoes.map((edicao, i) => (
      <EdicaoGaleria
        key={edicao.titulo}
        edicao={edicao}
        bg={fundos[i % fundos.length]}
        className={i === 0 ? "pt-40" : undefined}
      />
    ))}
    <CtaFinal />
  </>
);

export default EdicoesPage;
```

- [ ] **Step 3: Verificar no dev server**

Run: `pnpm dev`, abrir `http://localhost:3000/edicoes`.
Esperado: uma edição com três fotos em grid, CTA final.

- [ ] **Step 4: Commit**

```powershell
git add components/edicoes app/edicoes/page.tsx
git commit -m @'
Adiciona página de edições

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 12: Sitemap e robots

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: `marca.site`, `nav`.

- [ ] **Step 1: Escrever `tests/seo.test.ts`**

```ts
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
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `pnpm test tests/seo.test.ts`
Esperado: FAIL por módulo não encontrado.

- [ ] **Step 3: Escrever `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { marca, nav } from "@/content/marca";

export const dynamic = "force-static";

const sitemap = (): MetadataRoute.Sitemap =>
  nav.map((item) => ({
    url: `${marca.site}${item.href}`,
    lastModified: new Date("2026-09-22"),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

export default sitemap;
```

- [ ] **Step 4: Escrever `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { marca } from "@/content/marca";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: `${marca.site}/sitemap.xml`,
});

export default robots;
```

- [ ] **Step 5: Rodar testes**

Run: `pnpm test`
Esperado: todos passam.

- [ ] **Step 6: Commit**

```powershell
git add app/sitemap.ts app/robots.ts tests/seo.test.ts
git commit -m @'
Adiciona sitemap e robots

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 13: Build, verificação no navegador e Lighthouse

**Files:**
- Nenhum novo. Correções pontuais em componentes se algo falhar.

- [ ] **Step 1: Lint, testes e build**

Run: `pnpm lint; pnpm test; pnpm build`
Esperado: zero erros. `out/` contém `index.html`, `evento.html` (ou `evento/index.html`), `sobre.html`, `edicoes.html`, `sitemap.xml`, `robots.txt`, `og.png`.

- [ ] **Step 2: Servir o export**

Run: `pnpm dlx serve out -l 4173`

- [ ] **Step 3: Conferir as quatro rotas em 1440px e 390px**

Abrir no Chrome `http://localhost:4173`, `/evento`, `/sobre`, `/edicoes`. Em cada uma, em 390px, conferir no console:

```js
document.documentElement.scrollWidth <= window.innerWidth
```
Esperado: `true` em todas. Se o hero estourar por causa do tracking, reduzir `tracking-[0.35em]` pra `tracking-[0.2em]` no breakpoint base do `Hero.tsx`.

- [ ] **Step 4: Conferir o hero sem vídeo**

`/video/hero.mp4` não existe ainda. Esperado: poster visível a 40% de opacidade, nenhum ícone de erro, layout intacto.

- [ ] **Step 5: Testar o formulário**

Em `/evento#interesse`, preencher `Nome: Ana & Júlia`, `WhatsApp: 43999990000`, `Cidade: Londrina`, `Origem: Instagram`, enviar.
Esperado: nova aba em `https://wa.me/5543000000000?text=...` com a mensagem decodificada mostrando `Ana & Júlia`.

- [ ] **Step 6: Lighthouse na home**

Run: `pnpm dlx lighthouse http://localhost:4173 --only-categories=performance,accessibility --chrome-flags="--headless" --output=json --output-path=./lighthouse.json --quiet`

```powershell
$r = Get-Content lighthouse.json | ConvertFrom-Json; $r.categories.performance.score * 100; $r.categories.accessibility.score * 100
```
Esperado: ambos ≥ 90. Se acessibilidade falhar por contraste de `gold` sobre `wine`, trocar o texto afetado pra `gold-light` e repetir. Apagar `lighthouse.json` ao final.

- [ ] **Step 7: Commit de ajustes (se houver)**

```powershell
git add <arquivos ajustados>
git commit -m @'
Ajusta layout após verificação no navegador

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
'@
```

---

### Task 14: Troca dos dados provisórios (depende do usuário)

Executar quando os materiais chegarem. Cada item é independente.

- [ ] **WhatsApp:** trocar `marca.whatsapp` em `content/marca.ts` pelo número real (formato `55DDDNÚMERO`, só dígitos). Rodar `pnpm test`.
- [ ] **Instagram e e-mail:** confirmar `marca.instagram` e `marca.email`.
- [ ] **Evento:** preencher `local`, `endereco`, `mapaUrl`, `horario`, `programacao` e `lotes` em `content/evento.ts`.
- [ ] **Convidadas:** fotos em `assets/convidadas/<slug>.jpg`, rodar `pnpm images`, preencher `content/convidadas.ts` com `foto: "/img/convidadas/<slug>.webp"`.
- [ ] **Carol:** foto real em `assets/carol/retrato.jpg`, bio revisada em `content/carol.ts`.
- [ ] **1ª edição:** fotos reais em `assets/edicoes/1/NN.jpg`, atualizar `fotos` em `content/edicoes.ts`.
- [ ] **Fontes oficiais:** `.woff2` em `app/fonts/`, trocar `app/fonts.ts` por `localFont({ src: [...], variable: "--font-elevation-serif" })`.
- [ ] **Logo vetor:** se vier SVG com fundo transparente, salvar em `public/img/brand/monograma.svg`, apontar `Monograma.tsx` pra ele e remover `mix-blend-screen`.
- [ ] **Vídeo do hero:** salvar em `public/video/hero.mp4` (H.264, mudo, ≤ 6 MB). Poster em `assets/hero/poster.jpg`.
- [ ] Rodar `pnpm lint; pnpm test; pnpm build` e commitar por grupo.

---

## Apêndice: prompts pra assets de IA

Todos no estilo das referências: luz quente e baixa, veludo, rose gold, muito espaço negativo, sem texto na imagem, sem rosto reconhecível.

**Vídeo do hero** (1920×1080, 8–12 s, loop sem corte, mudo):
> Slow cinematic loop, deep burgundy velvet fabric gently moving under warm low light, subtle rose gold light reflections drifting across the folds, dark wine and black shadows, elegant editorial mood, no text, no people, seamless loop, shallow depth of field, 24fps.

**Poster do hero** (1920×1080):
> Deep burgundy velvet fabric under warm low light, soft rose gold reflections, dark wine and black shadows, editorial luxury photography, lots of negative space in the center, no text, no people.

**Textura preta** (1920×1080, fundo de seção `ink`):
> Black velvet texture close-up, very low warm light from one side, faint rose gold sheen, mostly dark with subtle folds, editorial, no text.

**Textura roxa** (1920×1080, fundo de seção `plum`):
> Deep plum purple velvet fabric, soft warm rim light, subtle rose gold glow, dark and minimal, editorial luxury, no text.

**Imagem OG** (1200×630, substitui a gerada por script):
> Rose gold serif letter E with a delicate leaf branch, centered on black velvet background, warm low light, editorial luxury branding, wide horizontal composition, lots of negative space, no other text.

**Retrato genérico de convidada** (1200×1500, só se faltar foto real):
> Elegant woman in a wine-colored blazer photographed from behind or in profile, warm low light, blurred luxury event background with soft bokeh, editorial, no visible face, no text.

> Criado em 2026-09-22 16:45 (-03) · Última modificação: 2026-09-22 16:45 (-03)
