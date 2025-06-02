using AiProject.Contracts.Turnos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AiProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TurnosController : ControllerBase
{
    private readonly ITurnosService _turnosService;

    public TurnosController(ITurnosService turnosService)
    {
        _turnosService = turnosService;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TurnoDto>> CrearTurno([FromBody] CrearTurnoRequest request, CancellationToken cancellationToken)
    {
        var turno = await _turnosService.CrearTurnoAsync(request, cancellationToken);
        return Ok(turno);
    }

    [HttpGet("disponibles")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<TurnoDto>>> ObtenerDisponibles(CancellationToken cancellationToken)
    {
        var hoy = DateOnly.FromDateTime(DateTime.Today);
        var turnos = await _turnosService.ObtenerTurnosDisponiblesSemanaAsync(hoy, cancellationToken);
        return Ok(turnos);
    }
}
