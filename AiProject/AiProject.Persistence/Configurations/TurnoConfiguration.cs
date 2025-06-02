using AiProject.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AiProject.Persistence.Configurations;

public class TurnoConfiguration : IEntityTypeConfiguration<Turno>
{
    public void Configure(EntityTypeBuilder<Turno> builder)
    {
        builder.ToTable("Turnos");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Fecha).IsRequired();
        builder.Property(t => t.HoraInicio).IsRequired();
        builder.Property(t => t.HoraFin).IsRequired();
        builder.HasOne(t => t.Cancha)
            .WithMany()
            .HasForeignKey(t => t.CanchaId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(t => t.SocioSolicitante)
            .WithMany()
            .HasForeignKey(t => t.SocioSolicitanteId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(t => t.Personas)
            .WithOne(p => p.Turno)
            .HasForeignKey(p => p.TurnoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
