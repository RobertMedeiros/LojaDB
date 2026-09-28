using exemplo02.Data;
using exemplo02.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace exemplo02.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClientesController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
    {
        var clientes = await context.Clientes.ToListAsync();
        return Ok(clientes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cliente>> GetCliente(int id)
    {
        var cliente = await context.Clientes.FindAsync(id);

        if (cliente == null)
        {
            return NotFound();
        }

        return Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<Cliente>> PostCliente([FromBody] Cliente cliente)
    {
        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCliente), new { id = cliente.ClienteID }, cliente);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCliente(int id, [FromBody] Cliente cliente)
    {
        if (id != cliente.ClienteID)
        {
            return BadRequest();
        }

        var clienteNew = await context.Clientes.FindAsync(id);

        if (clienteNew == null)
        {
            return NotFound();
        }

        clienteNew.Nome = cliente.Nome;
        clienteNew.Email = cliente.Email;
        clienteNew.Telefone = cliente.Telefone;
        clienteNew.DataCadastro = cliente.DataCadastro;
        clienteNew.Ativo = cliente.Ativo;
        context.Entry(clienteNew).State = EntityState.Modified;
        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var cliente = await context.Clientes.FindAsync(id);

        if (cliente == null)
        {
            return NotFound();
        }

        context.Clientes.Remove(cliente);
        await context.SaveChangesAsync();

        return NoContent();
    }
}
