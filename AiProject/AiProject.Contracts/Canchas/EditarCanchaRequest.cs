using AiProject.Domain;

namespace AiProject.Contracts.Canchas;

public record EditarCanchaRequest
{
    public int Id { get; set; }
    public TipoSuelo TipoSuelo { get; set; }
}