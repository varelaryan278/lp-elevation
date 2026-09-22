# Elevation — Site institucional (v1)

## Objetivo

Site institucional do movimento Elevation com um objetivo de conversão: levar a visitante a garantir vaga na edição de 12 de outubro. A conversão acontece fora do site, via WhatsApp da organização. O site é 100% estático, sem backend, sem banco.

Fora de escopo nesta versão: loja de produtos, área logada, checkout, CMS, mídia de eventos além da galeria da 1ª edição.

## Identidade visual

Referência: imagens em `C:\Dev\elevation\midia`. Elas mandam na estética. O `ideia.md` manda no tom de voz e no conteúdo.

### Tokens (`app/globals.css`, bloco `@theme`)

| Token   | Valor     | Uso                                   |
| ------- | --------- | ------------------------------------- |
| `ink`   | `#0E0A0C` | fundo escuro principal                |
| `wine`  | `#3A0E1E` | fundo bordô, overlays sobre fotos     |
| `plum`  | `#2A1030` | fundo roxo profundo                   |
| `cream` | `#F3EBE1` | fundo claro e texto sobre escuro      |
| `gold`  | `#C9A27E` | acento rose gold, botões, monograma   |
| `gold-light` | `#E2C4A3` | hover de `gold`                  |

Regras:

- Um único metálico (`gold`). Sem gradientes coloridos. Brilho só com `text-shadow`/`box-shadow` sutil.
- Texto sobre escuro: `cream` a 90%. Texto sobre claro: `ink`.
- Alternância de fundo por seção: `ink` → `cream` → `wine` → `ink`.
- Fotos recebem overlay `wine/60` pra manter legibilidade e tom de veludo.

### Tipografia

- Serif oficial da marca em títulos e monograma, via `next/font/local` a partir de `public/fonts/`.
- Rótulos em uppercase com `tracking-[0.25em]` (ex.: `CONEXÃO • PROPÓSITO • IMPACTO`).
- Corpo em sans neutra. Se a marca não tiver sans oficial, Inter via `next/font/google`.

### Ritmo e motion

- Seções com `py-24 md:py-40`, container `max-w-6xl`, muito espaço negativo.
- Animações só em CSS: `@keyframes` fade-up no carregamento e `transition` em hover. Sem lib de animação.

## Stack

- Next.js 16 App Router, React 19, Tailwind 4, TypeScript.
- `next.config.ts`: `output: 'export'`, `images.unoptimized: true`.
- Otimização de imagem em build time: script único com `sharp` gera WebP em `public/img/`.
- Sem libs de UI, form ou animação.
- Package manager: pnpm. O repo veio com `package-lock.json` do `create-next-app`; migrar na primeira tarefa (remover o lock do npm, `pnpm install`, fixar `packageManager` com versão exata).
- Antes de codar, ler `node_modules/next/dist/docs/` (esta versão do Next tem breaking changes).

## Rotas e componentes

```
app/
  layout.tsx          fontes, metadata base, Header + Footer
  globals.css         @theme tokens
  page.tsx            home
  evento/page.tsx
  sobre/page.tsx
  edicoes/page.tsx
  sitemap.ts
  robots.ts
components/
  layout/Header.tsx   monograma + nav (Início, Evento, Sobre, Edições) + CTA "Garantir vaga"
  layout/Footer.tsx   pilares, Instagram, WhatsApp, e-mail
  ui/Button.tsx       variantes: primary (gold sólido) e outline (borda gold)
  ui/Section.tsx      wrapper com variante de fundo (ink | cream | wine | plum) e padding padrão
  ui/Eyebrow.tsx      rótulo uppercase com tracking largo
  home/Hero.tsx
  home/Manifesto.tsx
  home/Pilares.tsx
  home/EventoTeaser.tsx
  home/Carol.tsx
  home/Galeria.tsx
  home/CtaFinal.tsx
  evento/Detalhes.tsx
  evento/Programacao.tsx
  evento/Convidadas.tsx
  evento/Lotes.tsx
  evento/Interesse.tsx   único Client Component
  sobre/Historia.tsx
  sobre/Lotus.tsx
  sobre/FeProposito.tsx
```

- Header fixo, fundo `ink/80` com `backdrop-blur`. No mobile, menu de tela cheia com fundo `wine`.
- `metadata` por página com título, descrição e OG image com o monograma.
- Nenhum componente acima de ~100 linhas.

### Home (`/`)

1. **Hero**: monograma "E" em gold sobre `ink`, título "ELEVATION", assinatura "Mulheres que vão mais alto", rótulo dos pilares, botão "Garantir vaga" → `/evento#interesse`. Fundo: vídeo de IA em loop, mudo, com `poster` em imagem como fallback.
2. **Manifesto** (`cream`): "Mais que um evento. Um movimento." e parágrafo curto da essência (seção 21 do `ideia.md`).
3. **Pilares** (`wine`): três cards, Conexão, Propósito, Impacto. "Crescimento" entra como texto dentro da seção.
4. **EventoTeaser** (`ink`): data, local, cidade, botão pra `/evento`.
5. **Carol** (`cream`): retrato, papel de criadora e anfitriã, sem tom de guru.
6. **Galeria** (`plum`): grid de fotos reais da 1ª edição, link pra `/edicoes`.
7. **CtaFinal** (`ink`): "Visão para hoje. Impacto para sempre." e botão "Garantir vaga".

### Evento (`/evento`)

1. **Detalhes**: data, horário, local, endereço, mapa via link externo.
2. **Programacao**: lista de blocos com horário e título.
3. **Convidadas**: grid com foto, nome, papel e mini-bio.
4. **Lotes**: cards com nome do lote, valor e status (disponível, esgotado, em breve).
5. **Interesse** (`#interesse`): formulário descrito abaixo.

### Sobre (`/sobre`)

1. **Historia**: nascimento do projeto, 1ª fase na Decol Design, evolução de encontro a movimento.
2. **Lotus**: conceito da flor de lótus com as três frases do `ideia.md`.
3. **FeProposito**: fé como essência, sem aparência de culto.

### Edições (`/edicoes`)

Lista de edições a partir de `content/edicoes.ts`. Cada edição: título, local, data, grid de fotos. Hoje só a 1ª.

## Conteúdo e dados

Todo texto e dado vive em `content/`, tipado em `content/types.ts`. Componentes só renderizam.

```
content/
  types.ts
  marca.ts        taglines, pilares, frases, links (Instagram, WhatsApp, e-mail)
  evento.ts       edição atual: data, local, endereço, horário, programacao[], lotes[]
  convidadas.ts   { nome, papel, bio, foto }[]
  carol.ts        bio e foto
  edicoes.ts      { titulo, local, data, fotos[] }[]
```

- Fotos em `public/img/<contexto>/`. Convidadas e edições referenciam por path.
- Frases do `ideia.md` entram como estão. Tom de voz: elegante, emocional, forte. Sem frase motivacional genérica.
- Nova edição = novo item em `edicoes.ts` e troca de `evento.ts`. Nenhum componente muda.

### Assets pendentes (fornecidos pelo usuário)

- Logo em vetor (SVG) e fontes oficiais (arquivos `.woff2`).
- Fotos reais da 1ª edição.
- Fotos e bios das convidadas.
- Foto da Carol.
- Número do WhatsApp da organização.
- Detalhes do evento: local, endereço, horário, programação, lotes e valores.

### Assets gerados por IA (prompts entregues pelo dev)

O usuário gera imagens e vídeos de IA a partir de prompts. O dev entrega, no plano de implementação, uma lista com dimensão, formato e prompt pra cada um:

- Vídeo do hero (loop 8–12s, 1920×1080, mudo) e seu poster.
- Fundos de textura (veludo bordô, veludo preto) pra seções sem foto.
- Imagem OG (1200×630) com o monograma sobre `ink`.

## Formulário de interesse

- Componente `evento/Interesse.tsx`, Client Component.
- Campos: nome, WhatsApp, cidade, "como conheceu" (select: Instagram, indicação, edição anterior, outro).
- Validação nativa (`required`, `type="tel"`). Sem lib.
- Ao enviar, monta a mensagem e abre `https://wa.me/55<numero>?text=<mensagem>` via `window.open`. Nada é armazenado.
- Mensagem: `Olá! Quero garantir minha vaga no Elevation 12/10. Nome: … | Cidade: … | Conheci por: …`
- Número em `content/marca.ts`.
- Botões "Garantir vaga" do header e do CTA final apontam pra `/evento#interesse`.

## SEO e metadata

- `metadata` por rota com título e descrição em pt-BR.
- `app/sitemap.ts` e `app/robots.ts` nativos.
- OG image estática em `public/og.png`.
- `lang="pt-BR"` no `<html>`.

## Verificação

- `pnpm lint` e `pnpm build` limpos com `output: 'export'`.
- Servir `out/` e conferir as 4 rotas no Chrome em 390px e 1440px.
- Testar o fluxo do formulário: abre o WhatsApp com a mensagem correta e os campos preenchidos.
- Lighthouse na home: alvo 90+ em performance e acessibilidade. Contraste `gold` sobre `wine` é o ponto de atenção; ajustar tom se falhar.

## Decisões registradas

- Sem backend e sem armazenamento de lead: escolha do usuário, aceito o risco de perder lead que desiste antes de enviar no WhatsApp.
- Três pilares no rótulo visual (como nas imagens), quatro no texto (como no `ideia.md`).
- Estrutura multi-page pra suportar loja e mídia de eventos como novas rotas sem refatorar.

> Criado em 2026-09-22 16:29 (-03) · Última modificação: 2026-09-22 16:29 (-03)
