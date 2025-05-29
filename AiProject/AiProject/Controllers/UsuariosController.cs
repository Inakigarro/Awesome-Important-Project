using AiProject.Contracts;
using AiProject.Contracts.Usuarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var usuarios = await _usuarioService.GetAllAsync(cancellationToken);
        return Ok(usuarios);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var usuario = await _usuarioService.GetByIdAsync(id, cancellationToken);
        if (usuario == null) return NotFound();
        return Ok(usuario);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] CrearUsuarioRequest usuarioRequest, CancellationToken cancellationToken)
    {
        var usuario = await _usuarioService.AddAsync(usuarioRequest, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] ActualizarUsuarioRequest usuarioRequest, CancellationToken cancellationToken)
    {
        await _usuarioService.UpdateAsync(usuarioRequest, cancellationToken);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _usuarioService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
