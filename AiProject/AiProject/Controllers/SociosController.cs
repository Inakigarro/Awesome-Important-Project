using AiProject.Contracts;
using AiProject.Contracts.Auth;
using AiProject.Contracts.Socios;
using AiProject.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AiProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SociosController: ControllerBase
{
    private readonly ISociosService _socioService;
    private readonly IAuthService _authService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<Usuario> _userManager;

    public SociosController(ISociosService sociosService, IAuthService authService, IUnitOfWork unitOfWork, UserManager<Usuario> userManager)
    {
        _socioService = sociosService;
        _authService = authService;
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearSocioRequest request, CancellationToken cancellationToken)
    {
        var id = await _socioService.AddAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var socio = await _socioService.GetByIdAsync(id, cancellationToken);
        if (socio == null) return NotFound();
        return Ok(socio);
    }

    [HttpPost("iniciar-sesion")]
    public async Task<IActionResult> IniciarSesion([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        // Realizar login
        var authResponse = await _authService.LoginAsync(request);
        // Buscar usuario por email
        var usuarioRepo = _unitOfWork.Repository<Usuario, Guid>();
        var usuario = (await usuarioRepo.GetAllAsync(cancellationToken)).FirstOrDefault(u => u.Email == request.Email);
        if (usuario == null)
            return Unauthorized("Usuario no encontrado");
        // Buscar socio asociado
        var socioRepo = _unitOfWork.Repository<Socio, Guid>();
        var socio = (await socioRepo.GetAllAsync(cancellationToken)).FirstOrDefault(s => s.UsuarioId == usuario.Id);
        if (socio == null)
            return Unauthorized("Socio no encontrado para el usuario");
        // Obtener roles del usuario
        var roles = await _userManager.GetRolesAsync(usuario);
        // Construir respuesta
        return Ok(new
        {
            Token = authResponse.Token,
            RefreshToken = authResponse.RefreshToken,
            UserName = authResponse.NombreUsuario,
            Roles = roles,
            Socio = new {
                socio.Id,
                socio.NumeroSocio,
                socio.Nombre,
                socio.Apellido,
                socio.Email,
                socio.Telefono
            }
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity == null || !identity.IsAuthenticated)
            return Unauthorized();

        var userIdStr = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var usuarioRepo = _unitOfWork.Repository<Usuario, Guid>();
        var usuario = await usuarioRepo.GetByIdAsync(userId, cancellationToken);
        if (usuario == null)
            return Unauthorized("Usuario no encontrado");

        var socioRepo = _unitOfWork.Repository<Socio, Guid>();
        var socio = (await socioRepo.GetAllAsync(cancellationToken)).FirstOrDefault(s => s.UsuarioId == usuario.Id);
        if (socio == null)
            return Unauthorized("Socio no encontrado para el usuario");

        var roles = await _userManager.GetRolesAsync(usuario);

        return Ok(new
        {
            UserName = usuario.UserName,
            Roles = roles,
            Socio = new {
                socio.Id,
                socio.NumeroSocio,
                socio.Nombre,
                socio.Apellido,
                socio.Email,
                socio.Telefono
            }
        });
    }
}
