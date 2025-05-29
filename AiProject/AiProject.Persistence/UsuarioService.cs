using AiProject.Contracts;
using AiProject.Contracts.Usuarios;
using AiProject.Domain;
using Microsoft.AspNetCore.Identity;

namespace AiProject.Persistence;

public class UsuarioService : IUsuarioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<Usuario> _userManager;

    public UsuarioService(IUnitOfWork unitOfWork, UserManager<Usuario> userManager)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    public async Task<UsuarioDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var usuario = await _unitOfWork.Repository<Usuario, Guid>().GetByIdAsync(id, cancellationToken);
        return usuario == null ? null : MapToResponse(usuario);
    }

    public async Task<IEnumerable<UsuarioDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var usuarios = await _unitOfWork.Repository<Usuario, Guid>().GetAllAsync(cancellationToken);
        return usuarios.Select(MapToResponse);
    }

    public async Task<UsuarioDto> AddAsync(CrearUsuarioRequest usuarioRequest, CancellationToken cancellationToken)
    {
        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            UserName = usuarioRequest.NombreUsuario,
            Email = usuarioRequest.Email
        };
        var result = await _userManager.CreateAsync(usuario, usuarioRequest.Contrasena);
        if (!result.Succeeded)
        {
            throw new Exception($"No se pudo crear el usuario: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return MapToResponse(usuario);
    }

    public async Task UpdateAsync(ActualizarUsuarioRequest usuarioRequest, CancellationToken cancellationToken)
    {
        var usuario = await _unitOfWork.Repository<Usuario, Guid>().GetByIdAsync(usuarioRequest.Id, cancellationToken);
        if (usuario != null)
        {
            usuario.UserName = usuarioRequest.NombreUsuario;
            usuario.Email = usuarioRequest.Email;
            var result = await _userManager.UpdateAsync(usuario);
            if (!result.Succeeded)
            {
                throw new Exception($"No se pudo actualizar el usuario: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            if (!string.IsNullOrWhiteSpace(usuarioRequest.Contrasena))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(usuario);
                var passwordResult = await _userManager.ResetPasswordAsync(usuario, token, usuarioRequest.Contrasena);
                if (!passwordResult.Succeeded)
                {
                    throw new Exception($"No se pudo actualizar la contraseña: {string.Join(", ", passwordResult.Errors.Select(e => e.Description))}");
                }
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var usuario = await _unitOfWork.Repository<Usuario, Guid>().GetByIdAsync(id, cancellationToken);
        if (usuario != null)
        {
            var result = await _userManager.DeleteAsync(usuario);
            if (!result.Succeeded)
            {
                throw new Exception($"No se pudo eliminar el usuario: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }

    private static UsuarioDto MapToResponse(Usuario usuario)
    {
        return new UsuarioDto
        {
            Id = usuario.Id,
            NombreUsuario = usuario.UserName ?? string.Empty,
            Email = usuario.Email ?? string.Empty
        };
    }
}
