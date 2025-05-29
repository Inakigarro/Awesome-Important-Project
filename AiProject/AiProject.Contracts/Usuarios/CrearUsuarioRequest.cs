namespace AiProject.Contracts.Usuarios;

public record CrearUsuarioRequest
{
    public string NombreUsuario { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Contrasena { get; init; } = string.Empty;
}
