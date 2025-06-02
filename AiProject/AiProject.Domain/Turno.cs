using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AiProject.Domain;

public class Turno
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public int CanchaId { get; set; }
    [ForeignKey("CanchaId")]
    public Cancha Cancha { get; set; } = null!;

    [Required]
    public DateOnly Fecha { get; set; }
    [Required]
    public TimeOnly HoraInicio { get; set; }
    [Required]
    public TimeOnly HoraFin { get; set; }

    [Required]
    public Guid SocioSolicitanteId { get; set; }
    [ForeignKey("SocioSolicitanteId")]
    public Socio SocioSolicitante { get; set; } = null!;

    public ICollection<PersonaTurno> Personas { get; set; } = new List<PersonaTurno>();
}
