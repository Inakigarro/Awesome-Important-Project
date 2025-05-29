namespace AiProject.Contracts.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(RefreshTokenRequest request);
    Task<(bool Success, string Message)> AddRoleAsync(string email, string role);
}