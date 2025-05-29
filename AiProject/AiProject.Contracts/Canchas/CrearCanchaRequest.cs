using AiProject.Domain;

namespace AiProject.Contracts.Canchas;

public record CrearCanchaRequest
{
    public TipoSuelo TipoSuelo { get; init; }
}
