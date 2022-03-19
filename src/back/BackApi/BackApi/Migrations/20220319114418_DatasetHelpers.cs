using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackApi.Migrations
{
    public partial class DatasetHelpers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Delimiter",
                table: "Datasets",
                type: "nvarchar(1)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ext",
                table: "Datasets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "inQuotes",
                table: "Datasets",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delimiter",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "Ext",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "inQuotes",
                table: "Datasets");
        }
    }
}
