namespace AiProject.Contracts.Turnos;

public record PersonaTurnoDto
{
    public Guid? SocioId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
}
