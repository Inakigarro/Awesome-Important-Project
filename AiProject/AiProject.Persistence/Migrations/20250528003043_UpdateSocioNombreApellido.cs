using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSocioNombreApellido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NombreCompleto",
                table: "Socios");

            migrationBuilder.AddColumn<string>(
                name: "Apellido",
                table: "Socios",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "Socios",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Apellido",
                table: "Socios");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "Socios");

            migrationBuilder.AddColumn<string>(
                name: "NombreCompleto",
                table: "Socios",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
