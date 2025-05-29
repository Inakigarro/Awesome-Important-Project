using AiProject.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AiProject.Persistence.Configurations
{
    public class SocioConfiguration : IEntityTypeConfiguration<Socio>
    {
        public void Configure(EntityTypeBuilder<Socio> builder)
        {
            builder.ToTable("Socios");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Nombre).IsRequired().HasMaxLength(100);
            builder.Property(s => s.Apellido).IsRequired().HasMaxLength(100);
            builder.Property(s => s.Email).IsRequired().HasMaxLength(255);
            builder.HasIndex(s => s.Email).IsUnique();
            builder.Property(s => s.NumeroSocio).IsRequired().ValueGeneratedOnAdd();
            builder.HasIndex(s => s.NumeroSocio).IsUnique();
            builder.Property(s => s.Telefono).IsRequired().HasMaxLength(30);
            builder.HasOne(s => s.Usuario)
                .WithOne()
                .HasForeignKey<Socio>(s => s.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
