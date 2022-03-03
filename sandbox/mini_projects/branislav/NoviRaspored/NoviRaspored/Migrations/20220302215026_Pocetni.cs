using Microsoft.EntityFrameworkCore.Migrations;

namespace NoviRaspored.Migrations
{
    public partial class Pocetni : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rasporeds",
                columns: table => new
                {
                    zadId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(64)", nullable: true),
                    Opis = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    Vreme = table.Column<string>(type: "nvarchar(5)", nullable: true),
                    Dan = table.Column<string>(type: "nvarchar(16)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rasporeds", x => x.zadId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rasporeds");
        }
    }
}
