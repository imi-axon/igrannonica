using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackApi.Migrations
{
    public partial class IspravkaStrukture : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Datasets_Korisnici_OwnerId",
                table: "Datasets");

            migrationBuilder.DropIndex(
                name: "IX_Datasets_OwnerId",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "Delimiter",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "inQuotes",
                table: "Datasets");

            migrationBuilder.AlterColumn<bool>(
                name: "Main",
                table: "Datasets",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Main",
                table: "Datasets",
                type: "int",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "Delimiter",
                table: "Datasets",
                type: "nvarchar(1)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Datasets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "inQuotes",
                table: "Datasets",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Datasets_OwnerId",
                table: "Datasets",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Datasets_Korisnici_OwnerId",
                table: "Datasets",
                column: "OwnerId",
                principalTable: "Korisnici",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
