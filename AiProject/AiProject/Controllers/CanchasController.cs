using AiProject.Contracts.Canchas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CanchasController : ControllerBase
{
    private readonly ICanchaService _canchaService;

    public CanchasController(ICanchaService canchaService)
    {
        _canchaService = canchaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ObtenerCanchasRequest request, CancellationToken cancellationToken = default)
    {
        var canchas = await _canchaService.GetAllAsync(request, cancellationToken);
        return Ok(canchas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken = default)
    {
        var cancha = await _canchaService.GetByIdAsync(id, cancellationToken);
        if (cancha == null) return NotFound();
        return Ok(cancha);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CrearCanchaRequest request, CancellationToken cancellationToken = default)
    {
        var id = await _canchaService.AddAsync(request.TipoSuelo, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("Actualizar")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromBody] EditarCanchaRequest request, CancellationToken cancellationToken = default)
    {
        await _canchaService.UpdateAsync(request.Id, request.TipoSuelo, cancellationToken);
        return NoContent();
    }
}
