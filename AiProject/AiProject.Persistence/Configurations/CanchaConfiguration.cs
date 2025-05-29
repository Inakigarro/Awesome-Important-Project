using AiProject.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AiProject.Persistence.Configurations;

public class CanchaConfiguration : IEntityTypeConfiguration<Cancha>
{
    public void Configure(EntityTypeBuilder<Cancha> builder)
    {
        builder.ToTable("Canchas");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .ValueGeneratedOnAdd();
        builder.Property(c => c.TipoSuelo)
            .IsRequired();
    }
}
