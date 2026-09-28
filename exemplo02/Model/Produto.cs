namespace exemplo02.Model;

public class Produto
{
    public int ProdutoID { get; set; }

    public short CategoriaID { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public decimal Preco { get; set; }

    public int Estoque { get; set; }

    public DateTime DataCadastro { get; set; }

    public string Ativo { get; set; } = "S";

    public Categoria? Categoria { get; set; }

    public ICollection<ItemPedido> ItensPedido { get; set; } = [];
}
