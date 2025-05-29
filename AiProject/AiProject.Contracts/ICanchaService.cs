using AiProject.Domain;

namespace AiProject.Contracts;

public interface ICanchaService
{
    Task<IEnumerable<Cancha>> GetAllAsync(CancellationToken cancellationToken);
    Task<Cancha?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<int> AddAsync(TipoSuelo tipoSuelo, CancellationToken cancellationToken);
    Task UpdateAsync(int id, TipoSuelo tipoSuelo, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
}
