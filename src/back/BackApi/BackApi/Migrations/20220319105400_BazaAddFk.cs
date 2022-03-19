using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackApi.Migrations
{
    public partial class BazaAddFk : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "NNs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Datasets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Datasets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_User_id",
                table: "Projects",
                column: "User_id");

            migrationBuilder.CreateIndex(
                name: "IX_NNs_ProjectId",
                table: "NNs",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Datasets_OwnerId",
                table: "Datasets",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Datasets_ProjectId",
                table: "Datasets",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Datasets_Korisnici_OwnerId",
                table: "Datasets",
                column: "OwnerId",
                principalTable: "Korisnici",
                principalColumn: "UserId",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Datasets_Projects_ProjectId",
                table: "Datasets",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_NNs_Projects_ProjectId",
                table: "NNs",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Korisnici_User_id",
                table: "Projects",
                column: "User_id",
                principalTable: "Korisnici",
                principalColumn: "UserId",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Datasets_Korisnici_OwnerId",
                table: "Datasets");

            migrationBuilder.DropForeignKey(
                name: "FK_Datasets_Projects_ProjectId",
                table: "Datasets");

            migrationBuilder.DropForeignKey(
                name: "FK_NNs_Projects_ProjectId",
                table: "NNs");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Korisnici_User_id",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_User_id",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_NNs_ProjectId",
                table: "NNs");

            migrationBuilder.DropIndex(
                name: "IX_Datasets_OwnerId",
                table: "Datasets");

            migrationBuilder.DropIndex(
                name: "IX_Datasets_ProjectId",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "NNs");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Datasets");
        }
    }
}
