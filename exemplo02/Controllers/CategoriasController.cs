using exemplo02.Data;
using exemplo02.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace exemplo02.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriasController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
    {
        var categorias = await context.Categorias
            .ToListAsync();
        return Ok(categorias);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Categoria>> GetCategoria(short id)
    {
        var categoria = await context.Categorias.FindAsync(id);

        if (categoria == null)
        {
            return NotFound();
        }

        return Ok(categoria);
    }

    [HttpPost]
    public async Task<ActionResult<Categoria>> PostCategoria([FromBody] Categoria categoria)
    {
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategoria), new { id = categoria.CategoriaID }, categoria);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCategoria(short id, [FromBody] Categoria categoria)
    {
        if (id != categoria.CategoriaID)
        {
            return BadRequest();
        }

        var categoriaNew = await context.Categorias.FindAsync(id);

        if (categoriaNew == null)
        {
            return NotFound();
        }

        categoriaNew.Nome = categoria.Nome;
        categoriaNew.Descricao = categoria.Descricao;
        categoriaNew.Ativo = categoria.Ativo;
        context.Entry(categoriaNew).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategoria(short id)
    {
        var categoria = await context.Categorias.FindAsync(id);

        if (categoria == null)
        {
            return NotFound();
        }

        context.Categorias.Remove(categoria);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
