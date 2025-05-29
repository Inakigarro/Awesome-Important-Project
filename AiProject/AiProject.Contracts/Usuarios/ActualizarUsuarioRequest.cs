namespace AiProject.Contracts.Usuarios;

public record ActualizarUsuarioRequest
{
    public Guid Id { get; set; } = Guid.Empty;
    public string NombreUsuario { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Contrasena { get; init; } = string.Empty;
}
