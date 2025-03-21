using Microsoft.AspNetCore.Mvc;
using MeetPoint.Models;
using System.Collections.Generic;
using System.Linq;

namespace MeetPoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private static List<Produto> produtos = new List<Produto>
        {
            new Produto { Id = 1, Nome = "Teclado", Preco = 29.99M },
            new Produto { Id = 2, Nome = "Rato", Preco = 19.99M }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Produto>> GetTodos()
        {
            return Ok(produtos);
        }

        [HttpGet("{id}")]
        public ActionResult<Produto> GetPorId(int id)
        {
            var produto = produtos.FirstOrDefault(p => p.Id == id);
            if (produto == null) return NotFound();
            return Ok(produto);
        }

        [HttpPost]
        public ActionResult<Produto> CriarProduto(Produto produto)
        {
            produto.Id = produtos.Max(p => p.Id) + 1;
            produtos.Add(produto);
            return CreatedAtAction(nameof(GetPorId), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarProduto(int id, Produto produtoAtualizado)
        {
            var produto = produtos.FirstOrDefault(p => p.Id == id);
            if (produto == null) return NotFound();

            produto.Nome = produtoAtualizado.Nome;
            produto.Preco = produtoAtualizado.Preco;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult ApagarProduto(int id)
        {
            var produto = produtos.FirstOrDefault(p => p.Id == id);
            if (produto == null) return NotFound();

            produtos.Remove(produto);
            return NoContent();
        }
    }
}
