using AiProject.Contracts;
using AiProject.Contracts.Socios;
using AiProject.Contracts.Usuarios;
using AiProject.Domain;

namespace AiProject.Persistence;

public class SociosService : ISociosService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUsuarioService _usuarioService;
    public SociosService(IUnitOfWork unitOfWork, IUsuarioService usuarioService)
    {
        _unitOfWork = unitOfWork;
        _usuarioService = usuarioService;
    }

    public async Task<SocioDto> AddAsync(CrearSocioRequest socioRequest, CancellationToken cancellationToken)
    {
        // Crear usuario asociado
        var usuario = new CrearUsuarioRequest()
        {
            NombreUsuario = socioRequest.Username,
            Contrasena = socioRequest.Password,
            Email = socioRequest.Email,
        };

        var usuarioCreado = await _usuarioService.AddAsync(usuario, cancellationToken);

        if (usuarioCreado == null)
        {
            throw new Exception("Error al crear el usuario asociado al socio.");
        }

        // Crear socio asociado al usuario
        var socio = new Socio()
        {
            Id = Guid.NewGuid(),
            Nombre = socioRequest.Nombre,
            Apellido = socioRequest.Apellido,
            Telefono = socioRequest.Telefono,
            Email = socioRequest.Email,
            UsuarioId = usuarioCreado.Id
        };

        await _unitOfWork.Repository<Socio, Guid>().AddAsync(socio, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new SocioDto
        {
            Id = socio.Id,
            NumeroSocio = socio.NumeroSocio,
            Nombre = socio.Nombre,
            Apellido = socio.Apellido,
            Email = socio.Email,
            Telefono = socio.Telefono,
            Username = usuarioCreado.NombreUsuario
        };
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var socioRepo = _unitOfWork.Repository<Socio, Guid>();
        var socio = await socioRepo.GetByIdAsync(id, cancellationToken);
        if (socio == null)
            throw new Exception("Socio no encontrado");
        await socioRepo.DeleteAsync(socio, cancellationToken);
        await _usuarioService.DeleteAsync(socio.UsuarioId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<SocioDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var socios = await _unitOfWork.Repository<Socio, Guid>().GetAllAsync(cancellationToken);
        var result = new List<SocioDto>();
        foreach (var socio in socios)
        {
            var usuario = await _usuarioService.GetByIdAsync(socio.UsuarioId, cancellationToken);
            result.Add(new SocioDto
            {
                Id = socio.Id,
                NumeroSocio = socio.NumeroSocio,
                Nombre = socio.Nombre,
                Apellido = socio.Apellido,
                Email = socio.Email,
                Telefono = socio.Telefono,
                Username = usuario?.NombreUsuario ?? string.Empty
            });
        }
        return result;
    }

    public async Task<SocioDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var socio = await _unitOfWork.Repository<Socio, Guid>().GetByIdAsync(id, cancellationToken);
        if (socio == null) return null;
        var usuario = await _usuarioService.GetByIdAsync(socio.UsuarioId, cancellationToken);
        return new SocioDto
        {
            Id = socio.Id,
            NumeroSocio = socio.NumeroSocio,
            Nombre = socio.Nombre,
            Apellido = socio.Apellido,
            Email = socio.Email,
            Telefono = socio.Telefono,
            Username = usuario?.NombreUsuario ?? string.Empty
        };
    }

    public async Task<IEnumerable<SocioDto>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken)
    {
        var socios = await _unitOfWork.Repository<Socio, Guid>().GetAllAsync(cancellationToken);
        var result = new List<SocioDto>();
        foreach (var socio in socios.Where(s => s.UsuarioId == usuarioId))
        {
            var usuario = await _usuarioService.GetByIdAsync(socio.UsuarioId, cancellationToken);
            result.Add(new SocioDto
            {
                Id = socio.Id,
                NumeroSocio = socio.NumeroSocio,
                Nombre = socio.Nombre,
                Apellido = socio.Apellido,
                Email = socio.Email,
                Telefono = socio.Telefono,
                Username = usuario?.NombreUsuario ?? string.Empty
            });
        }
        return result;
    }

    public async Task UpdateAsync(ActualizarSocioRequest socioRequest, CancellationToken cancellationToken)
    {
        var socioRepo = _unitOfWork.Repository<Socio, Guid>();
        var socio = await socioRepo.GetByIdAsync(socioRequest.Id, cancellationToken);
        if (socio == null)
            throw new Exception("Socio no encontrado");

        // Actualizar datos del socio
        socio.Nombre = socioRequest.Nombre;
        socio.Apellido = socioRequest.Apellido;
        socio.Email = socioRequest.Email;
        socio.Telefono = socioRequest.Telefono;
        await socioRepo.UpdateAsync(socio, cancellationToken);

        // Actualizar datos del usuario asociado
        await _usuarioService.UpdateAsync(new ActualizarUsuarioRequest
        {
            Id = socio.UsuarioId,
            NombreUsuario = socioRequest.Username,
            Email = socioRequest.Email,
            Contrasena = socioRequest.Password
        }, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
