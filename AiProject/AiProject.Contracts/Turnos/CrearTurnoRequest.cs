namespace AiProject.Contracts.Turnos;

public record CrearTurnoRequest
{
    public int CanchaId { get; set; }
    public DateOnly Fecha { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFin { get; set; }
    public Guid SocioSolicitanteId { get; set; }
    public List<PersonaTurnoDto> Personas { get; set; } = new();
}
