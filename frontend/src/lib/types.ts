export type Status = "S" | "N";

export interface Categoria {
  categoriaID: number;
  nome: string;
  descricao: string;
  ativo: Status;
}

export interface Cliente {
  clienteID: number;
  nome: string;
  email: string;
  telefone: string | null;
  dataCadastro: string;
  ativo: Status;
}

export interface Produto {
  produtoID: number;
  categoriaID: number;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  dataCadastro: string;
  ativo: Status;
}
