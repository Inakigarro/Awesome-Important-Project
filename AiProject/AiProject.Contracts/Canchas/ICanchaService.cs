using AiProject.Domain;

namespace AiProject.Contracts.Canchas;

public interface ICanchaService
{
    Task<PagedResultDto<CanchaDto>> GetAllAsync(ObtenerCanchasRequest request,  CancellationToken cancellationToken);
    Task<Cancha?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<int> AddAsync(TipoSuelo tipoSuelo, CancellationToken cancellationToken);
    Task UpdateAsync(int id, TipoSuelo tipoSuelo, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
}
