using AiProject.Contracts.Usuarios;

namespace AiProject.Contracts;

public interface IUsuarioService
{
    Task<UsuarioDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IEnumerable<UsuarioDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<UsuarioDto> AddAsync(CrearUsuarioRequest usuario, CancellationToken cancellationToken);
    Task UpdateAsync(ActualizarUsuarioRequest usuario, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
