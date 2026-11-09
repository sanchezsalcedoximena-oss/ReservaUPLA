using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservaUPLA.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarContrasenaAUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContrasenaHash",
                table: "Usuarios",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContrasenaHash",
                table: "Usuarios");
        }
    }
}
