namespace exemplo02.Model;

public class Categoria
{
    public short CategoriaID { get; set; }
    public string Nome { get; set; } = string.Empty;

    public string Descricao { get; set; } = string.Empty;

    public string Ativo { get; set; } = "S";

    public ICollection<Produto> Produtos { get; set; } = [];
}
