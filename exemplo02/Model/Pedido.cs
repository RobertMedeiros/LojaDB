namespace exemplo02.Model;

public class Pedido
{
    public int PedidoID { get; set; }

    public int ClienteID { get; set; }

    public DateTime DataPedido { get; set; }

    public string Situacao { get; set; } = "PENDENTE";

    public decimal ValorTotal { get; private set; }

    public Cliente? Cliente { get; set; }

    public ICollection<ItemPedido> Itens { get; set; } = [];
}
