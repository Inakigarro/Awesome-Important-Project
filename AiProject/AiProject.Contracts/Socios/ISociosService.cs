namespace AiProject.Contracts.Socios;

public interface ISociosService
{
    Task<IEnumerable<SocioDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<SocioDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<SocioDto> AddAsync(CrearSocioRequest socioRequest, CancellationToken cancellationToken);
    Task UpdateAsync(ActualizarSocioRequest socioRequest, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<IEnumerable<SocioDto>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken);
}
