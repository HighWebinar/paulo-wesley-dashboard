export interface LeadsPageFilters {
  from?: string;
  to?: string;
  renda?: string;
  tempo?: string;
}

export interface LeadsFilters {
  startDate?: string;
  endDate?: string;
  renda?: string;
  tempo?: string;
}

export interface Lead {
  id: number;
  data: string | null;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  tempo_mercado: string | null;
  ativo_principal: string | null;
  contato_tape: string | null;
  maior_dificuldade: string | null;
  renda_mensal: string | null;
  objetivo_trading: string | null;
}
