export interface Usuario {
  id: number;
  nome: string;
  email: string;
  limite_diario?: number;
}

export interface Envelope {
  id: number;
  usuarioId: number;
  nome: string;
  limite: number;
  valor_gasto: number;
  valor_total?: number; // Compatibilidade visual
}

export interface Gasto {
  id: number;
  usuarioId: number;
  envelopeId: number;
  valor: number;
  descricao: string;
  criadoEm?: string;
}

export interface MetaFinanceira {
  id: number;
  usuarioId: number;
  nome: string;
  valor_alvo: number;
  valor_atual: number;
  data_limite?: string;
}

export interface MetaFitness {
  id: number;
  usuarioId: number;
  nome: string;
  unidade: string;
  valor_atual: number;
  valor_alvo: number;
}

export interface HistoricoFitness {
  id: number;
  metaId: number;
  valor_registrado: number;
  data_registro?: string;
}

export interface Tarefa {
  id: number;
  usuarioId: number;
  titulo: string;
  concluida: boolean;
  valor_diario: number;
  pontos?: number; // Compatibilidade visual
}

export interface Diario {
  id: number;
  usuarioId: number;
  titulo: string;
  conteudo: string;
  criadoEm?: string;
}

export interface Falha {
  id: number;
  usuarioId: number;
  categoriaId: number;
  descricao: string;
  valor_diario: number;
  penalidade?: number; // Compatibilidade visual
}

export interface CategoriaFalha {
  id: number;
  nome: string;
  valor: number;
}
