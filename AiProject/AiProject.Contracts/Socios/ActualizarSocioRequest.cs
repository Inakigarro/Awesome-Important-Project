namespace AiProject.Contracts.Socios;

public record ActualizarSocioRequest
{
    // Datos del socio.
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;

    // Datos de la cuenta de usuario.
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
