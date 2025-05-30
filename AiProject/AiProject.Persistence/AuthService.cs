using AiProject.Contracts;
using AiProject.Contracts.Auth;
using AiProject.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AiProject.Persistence;

public class AuthService : IAuthService
{
    private readonly UserManager<Usuario> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<Usuario> userManager, RoleManager<IdentityRole<Guid>> roleManager, IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new UnauthorizedAccessException("Credenciales inv�lidas");
        }

        var accessToken = await GenerateJwtToken(user);
        var refreshToken = await CreateAndStoreRefreshToken(user);

        return new AuthResponse
        {
            Token = accessToken,
            RefreshToken = refreshToken.Token,
            Email = user.Email ?? string.Empty,
            NombreUsuario = user.UserName ?? string.Empty
        };
    }

    public async Task<AuthResponse> RefreshAsync(RefreshTokenRequest request)
    {
        var refreshToken = (await _unitOfWork.Repository<RefreshToken, Guid>().GetAllAsync(default))
            .FirstOrDefault(rt => rt.Token == request.RefreshToken);

        if (refreshToken == null || refreshToken.Expiration < DateTime.UtcNow || refreshToken.Revoked != null)
        {
            throw new UnauthorizedAccessException("Refresh token inv�lido o expirado");
        }

        refreshToken.Revoked = DateTime.UtcNow;
        _unitOfWork.Repository<RefreshToken, Guid>().UpdateAsync(refreshToken);
        await _unitOfWork.SaveChangesAsync();

        var user = refreshToken.Usuario;
        var newAccessToken = await GenerateJwtToken(user);
        var newRefreshToken = await CreateAndStoreRefreshToken(user);

        return new AuthResponse
        {
            Token = newAccessToken,
            RefreshToken = newRefreshToken.Token,
            Email = user.Email ?? string.Empty,
            NombreUsuario = user.UserName ?? string.Empty
        };
    }

    public async Task<(bool Success, string Message)> AddRoleAsync(string email, string role)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return (false, "Usuario no encontrado");

        if (!await _roleManager.RoleExistsAsync(role))
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole<Guid>(role));
            if (!roleResult.Succeeded)
                return (false, $"No se pudo crear el rol: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
        }

        var result = await _userManager.AddToRoleAsync(user, role);
        if (!result.Succeeded)
            return (false, $"No se pudo asignar el rol: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        return (true, $"Rol '{role}' asignado al usuario '{user.Email}'");
    }

    private async Task<RefreshToken> CreateAndStoreRefreshToken(Usuario user)
    {
        var token = GenerateSecureToken();
        var refreshToken = new RefreshToken
        {
            Token = token,
            UsuarioId = user.Id,
            Expiration = DateTime.UtcNow.AddDays(7),
            Created = DateTime.UtcNow
        };
        await _unitOfWork.Repository<RefreshToken, Guid>().AddAsync(refreshToken, default);
        await _unitOfWork.SaveChangesAsync();
        return refreshToken;
    }

    private string GenerateSecureToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private async Task<string> GenerateJwtToken(Usuario user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "SuperSecretKey12345";
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "AiProjectIssuer";
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
        };

        var userRoles = await _userManager.GetRolesAsync(user);
        foreach (var role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
