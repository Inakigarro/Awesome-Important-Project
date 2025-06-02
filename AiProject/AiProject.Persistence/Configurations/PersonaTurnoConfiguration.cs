using AiProject.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AiProject.Persistence.Configurations;

public class PersonaTurnoConfiguration : IEntityTypeConfiguration<PersonaTurno>
{
    public void Configure(EntityTypeBuilder<PersonaTurno> builder)
    {
        builder.ToTable("PersonasTurno");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Nombre).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Apellido).IsRequired().HasMaxLength(100);
        builder.HasOne(p => p.Socio)
            .WithMany()
            .HasForeignKey(p => p.SocioId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
