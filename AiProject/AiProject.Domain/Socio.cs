using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AiProject.Domain;

public class Socio
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    public string Apellido { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public Guid UsuarioId { get; set; }

    [ForeignKey("UsuarioId")]
    public Usuario Usuario { get; set; } = null!;

    [Required]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NumeroSocio { get; set; }

    [Required]
    public string Telefono { get; set; } = string.Empty;
}
