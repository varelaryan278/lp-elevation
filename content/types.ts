export type NavItem = { label: string; href: string };

export type Pilar = { titulo: string; texto: string };

export type BlocoProgramacao = { horario: string; titulo: string; descricao: string };

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
