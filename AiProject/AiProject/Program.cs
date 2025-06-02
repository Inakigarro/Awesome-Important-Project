using AiProject.Contracts;
using AiProject.Contracts.Auth;
using AiProject.Contracts.Socios;
using AiProject.Contracts.Turnos;
using AiProject.Domain;
using AiProject.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AiProject;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        // Configuración de DbContext con SQL Server
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Identity
        builder.Services.AddIdentityCore<Usuario>(options => { })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        // JWT Authentication
        var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKey12345";
        var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "AiProjectIssuer";
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

        // Add CORS policy for localhost:4200
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularLocalhost",
                policy => policy
                    .WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
            );
        });

        builder.Services
            .AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>))
            .AddScoped<IUnitOfWork, UnitOfWork>()
            .AddScoped<IUsuarioService, UsuarioService>()
            .AddScoped<IAuthService, AuthService>()
            .AddScoped<ICanchaService, CanchaService>()
            .AddScoped<ISociosService, SociosService>()
            .AddScoped<ITurnosService, TurnosService>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        // Use CORS before authentication/authorization
        app.UseCors("AllowAngularLocalhost");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
