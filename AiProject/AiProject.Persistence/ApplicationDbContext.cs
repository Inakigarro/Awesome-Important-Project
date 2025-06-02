using AiProject.Domain;
using AiProject.Persistence.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AiProject.Persistence;

public class ApplicationDbContext : IdentityDbContext<Usuario, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Socio> Socios => Set<Socio>();
    public DbSet<Cancha> Canchas => Set<Cancha>();
    public DbSet<Turno> Turnos => Set<Turno>();
    public DbSet<PersonaTurno> PersonasTurno => Set<PersonaTurno>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfiguration(new UsuarioConfiguration());
        builder.ApplyConfiguration(new RefreshTokenConfiguration());
        builder.ApplyConfiguration(new SocioConfiguration());
        builder.ApplyConfiguration(new CanchaConfiguration());
        builder.ApplyConfiguration(new TurnoConfiguration());
        builder.ApplyConfiguration(new PersonaTurnoConfiguration());
    }
}