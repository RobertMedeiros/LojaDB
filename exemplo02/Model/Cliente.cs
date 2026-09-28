namespace exemplo02.Model;

public class Cliente
{
    public int ClienteID { get; set; }
    public string Nome { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Telefone { get; set; }

    public DateTime DataCadastro { get; set; }

    public string Ativo { get; set; } = "S";

    public ICollection<Pedido> Pedidos { get; set; } = [];
}
