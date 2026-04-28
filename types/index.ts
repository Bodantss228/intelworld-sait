export interface Player {
  id: string;
  name: string;
  skin: string;
}

export interface BankAccount {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  date: string;
  description?: string;
}

export interface ServerStats {
  online: number;
  maxPlayers: number;
  uptime: string;
  version: string;
  tps: number;
}

export interface WikiArticle {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface WikiCategory {
  id: string;
  title: string;
  articles: WikiArticle[];
}
