namespace AiProject.Contracts.Turnos;

public interface ITurnosService
{
    Task<TurnoDto> CrearTurnoAsync(CrearTurnoRequest request, CancellationToken cancellationToken);
    Task<IEnumerable<TurnoDto>> ObtenerTurnosDisponiblesSemanaAsync(DateOnly desde, CancellationToken cancellationToken);
}
