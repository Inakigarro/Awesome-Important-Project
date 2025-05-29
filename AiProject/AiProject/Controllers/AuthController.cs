using AiProject.Contracts.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AiProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var response = await _authService.RefreshAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [HttpPost("add-role")]
    public async Task<IActionResult> AddRole([FromBody] AddRoleRequest request)
    {
        var (success, message) = await _authService.AddRoleAsync(request.Email, request.Role);
        if (!success)
            return BadRequest(message);
        return Ok(message);
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity == null || !identity.IsAuthenticated)
            return Unauthorized();

        var userId = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = identity.FindFirst(ClaimTypes.Email)?.Value;
        var username = identity.FindFirst(ClaimTypes.Name)?.Value;
        var roles = identity.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        return Ok(new
        {
            Id = userId,
            UserName = username,
            Email = email,
            Roles = roles
        });
    }
}

public class AddRoleRequest
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
