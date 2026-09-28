using exemplo02.Model;
using Microsoft.EntityFrameworkCore;

namespace exemplo02.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("Categorias");
            entity.HasKey(e => e.CategoriaID);
            entity.Property(e => e.CategoriaID).ValueGeneratedOnAdd();
            entity.Property(e => e.Nome).IsRequired().IsUnicode(false).HasMaxLength(50);
            entity.Property(e => e.Descricao).IsRequired().IsUnicode(false).HasMaxLength(50);
            entity.Property(e => e.Ativo).IsRequired().IsUnicode(false).HasMaxLength(1).HasDefaultValue("S");
            entity.ToTable(t => t.HasCheckConstraint("CK_Categorias_Ativo", "[Ativo] = 'N' OR [Ativo] = 'S'"));
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Clientes");
            entity.HasKey(e => e.ClienteID);
            entity.Property(e => e.ClienteID)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Nome)
                .IsRequired()
                .IsUnicode(false)
                .HasMaxLength(50);
            entity.Property(e => e.Email)
                .IsRequired()
                .IsUnicode(false)
                .HasMaxLength(50);
            entity.HasIndex(e => e.Email)
                .IsUnique()
                .HasDatabaseName("UN_Clientes_Email");
            entity.Property(e => e.Telefone)
                .IsUnicode(false)
                .HasMaxLength(20);
            entity.Property(e => e.DataCadastro)
                .IsRequired();
            entity.Property(e => e.Ativo)
                .IsRequired()
                .IsUnicode(false)
                .HasMaxLength(1)
                .HasDefaultValue("S");
            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Clientes_Ativo",
                "[Ativo] = 'N' OR [Ativo] = 'S'"));
        });

        modelBuilder.Entity<Produto>(entity =>
        {
            entity.ToTable("Produtos");
            entity.HasKey(e => e.ProdutoID);
            entity.Property(e => e.ProdutoID)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Nome)
                .IsRequired()
                .IsUnicode(false)
                .HasMaxLength(100);
            entity.Property(e => e.Descricao)
                .IsUnicode(false)
                .HasMaxLength(500);
            entity.Property(e => e.Preco)
                .IsRequired()
                .HasPrecision(15, 2);
            entity.Property(e => e.Estoque)
                .IsRequired();
            entity.Property(e => e.DataCadastro)
                .IsRequired()
                .HasDefaultValueSql("getdate()");
            entity.Property(e => e.Ativo)
                .IsRequired()
                .IsUnicode(false)
                .HasMaxLength(1)
                .HasDefaultValue("S");

            entity.HasOne(e => e.Categoria)
                .WithMany(e => e.Produtos)
                .HasForeignKey(e => e.CategoriaID)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_Produtos_Categorias");

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Produtos_Ativo",
                "[Ativo] = 'N' OR [Ativo] = 'S'"));

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Produtos_Estoque",
                "[Estoque] >= 0"));

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Produtos_Preco",
                "[Preco] > 0"));
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.ToTable("Pedidos");

            entity.HasKey(e => e.PedidoID);

            entity.Property(e => e.PedidoID)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.DataPedido)
                .IsRequired()
                .HasDefaultValueSql("getdate()");

            entity.Property(e => e.Situacao)
                .IsRequired()
                .IsUnicode(false)
                .HasMaxLength(20)
                .HasDefaultValue("PENDENTE");

            entity.Property(e => e.ValorTotal)
                .HasPrecision(15, 2)
                .HasComputedColumnSql("[dbo].[fnValorTotal]([PedidoID])");

            entity.HasOne(e => e.Cliente)
                .WithMany(e => e.Pedidos)
                .HasForeignKey(e => e.ClienteID)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_Pedidos_Clientes");

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Pedidos_Situacao",
                "[Situacao] = 'FINALIZADO' OR [Situacao] = 'CANCELADO' OR [Situacao] = 'PAGO' OR [Situacao] = 'PENDENTE'"));
        });

        modelBuilder.Entity<ItemPedido>(entity =>
        {
            entity.ToTable("ItensPedido");

            entity.HasKey(e => e.ItemPedidoID);

            entity.Property(e => e.ItemPedidoID)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Quantidade)
                .IsRequired();

            entity.Property(e => e.PrecoUnitario)
                .IsRequired()
                .HasPrecision(15, 2);

            entity.Property(e => e.SubTotal)
                .HasPrecision(15, 2)
                .HasComputedColumnSql("([Quantidade] * [PrecoUnitario])");

            entity.HasOne(e => e.Pedido)
                .WithMany(e => e.Itens)
                .HasForeignKey(e => e.PedidoID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ItensPedido_Pedidos");

            entity.HasOne(e => e.Produto)
                .WithMany(e => e.ItensPedido)
                .HasForeignKey(e => e.ProdutoID)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_ItensPedido_Produtos");

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_ItensPedido_Quantidade",
                "[Quantidade] > 0"));
        });
    }

    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }
}
