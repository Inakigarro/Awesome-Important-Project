using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AiProject.Domain;

public class PersonaTurno
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid TurnoId { get; set; }
    [ForeignKey("TurnoId")]
    public Turno Turno { get; set; } = null!;

    public Guid? SocioId { get; set; } // null si es invitado
    [ForeignKey("SocioId")]
    public Socio? Socio { get; set; }

    [Required]
    public string Nombre { get; set; } = string.Empty;
    [Required]
    public string Apellido { get; set; } = string.Empty;
}
