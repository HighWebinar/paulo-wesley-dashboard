export interface Lead {
  id: number;
  created_at: string;
  data: string | null;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_id: string | null;
  utm_medium: string | null;
  utm_term: string | null;
  utm_content: string | null;
  tempo_mercado: string | null;
  ativo_principal: string | null;
  contato_tape: string | null;
  maior_dificuldade: string | null;
  renda_mensal: string | null;
  objetivo_trading: string | null;
}
