import { loteAtual } from "./evento";

export type ConvidadaLp = { nome: string; sobrenome: string; papel?: string; foto?: string; destaque?: boolean };

export const compraHref = loteAtual?.checkoutUrl ?? "#ingressos";

export const inicioEvento = "2026-10-23T14:00:00-03:00";

export const especial = (c: ConvidadaLp) => c.destaque === true;

export const lp = {
  rotulo: "Evento feminino de negócios",
  titulo: { antes: "Uma tarde para", destaque: "Mulheres", depois: "que decidem mais" },
  subtitulo: "Elevando seus negócios, sua imagem e sua história.",
  diaSemana: "Sexta-feira",
  hora: "14h",
  localDetalhe: "Espaço Gourmet",
  temas: ["Negócios", "Imagem", "Saúde mental", "Propósito"],
  pilares: ["Conteúdo", "Conexões reais", "Experiências exclusivas", "Oportunidades de crescimento"],
  numeros: [
    { valor: 2, sufixo: "ª", rotulo: "edição do movimento" },
    { valor: 5, sufixo: "", rotulo: "palestrantes convidadas" },
    { valor: 5, sufixo: "h", rotulo: "de experiência" },
    { valor: 4, sufixo: "", rotulo: "temas que movem sua vida" },
  ],
  manifesto: "Nem todo encontro é só um evento. Alguns são pontos de virada.",
  paraQuem: [
    { titulo: "Negócios", texto: "Para quem empreende e quer decidir com mais clareza sobre o próximo passo." },
    { titulo: "Imagem", texto: "Para quem sabe que a forma como é percebida abre ou fecha portas." },
    { titulo: "Saúde mental", texto: "Para quem quer crescer sem perder o equilíbrio no caminho." },
    { titulo: "Propósito", texto: "Para quem quer que o crescimento tenha um porquê." },
  ],
  experiencia: [
    { titulo: "Conteúdo", texto: "Conversas práticas com mulheres que vivem o que falam." },
    { titulo: "Conexões reais", texto: "Networking guiado para você sair conhecendo pessoas de verdade." },
    { titulo: "Experiências exclusivas", texto: "Um ambiente pensado em cada detalhe, do café ao encerramento." },
    { titulo: "Oportunidades de crescimento", texto: "Relações e ideias que continuam rendendo depois do evento." },
  ],
  convidadas: [
    { nome: "Dra. Fernanda", sobrenome: "Oliveira", papel: "Biomédica esteta", foto: "/img/palestrantes/fernanda.webp" },
    { nome: "Lindsey", sobrenome: "Pontes", papel: "Esteticista", foto: "/img/palestrantes/lindsey-pontes.webp" },
    { nome: "Barbara", sobrenome: "Giangarelli", papel: "Influenciadora e empresária", foto: "/img/palestrantes/barbara-giangarelli.webp" },
    { nome: "Kelly", sobrenome: "Higashi", papel: "Mentora", foto: "/img/palestrantes/kelly-higashi.webp" },
    { nome: "Lavínia", sobrenome: "Rocha", papel: "Influenciadora e empresária", foto: "/img/palestrantes/lavinia-rocha.webp", destaque: true },
  ] satisfies ConvidadaLp[],
  faq: [
    { pergunta: "Quando e onde acontece?", resposta: "Sexta-feira, 23 de outubro, a partir das 14h, no Royal Tennis, Espaço Gourmet, em Londrina, PR." },
    { pergunta: "Como pago meu ingresso?", resposta: "A compra é feita pela Kiwify, no Pix ou no cartão em até 12x." },
    { pergunta: "Posso transferir meu ingresso para outra pessoa?", resposta: "Não. O titular do ingresso não pode ser alterado após a compra, então preencha os dados de quem vai participar." },
    { pergunta: "O valor muda?", resposta: "Sim. O ingresso é vendido em lotes e o valor sobe a cada virada de lote." },
    { pergunta: "Entrar no grupo do WhatsApp garante minha vaga?", resposta: "Não. O grupo é gratuito e serve para acompanhar novidades e próximas edições. A vaga no evento é garantida só com o ingresso." },
  ],
};
