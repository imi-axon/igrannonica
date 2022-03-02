using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjekatNovi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KorisnikDetalji",
                columns: table => new
                {
                    IDkorisnika = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Imeiprezime = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Brojlicnekarte = table.Column<string>(type: "nvarchar(9)", nullable: true),
                    Tribina = table.Column<string>(type: "nvarchar(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorisnikDetalji", x => x.IDkorisnika);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KorisnikDetalji");
        }
    }
}
