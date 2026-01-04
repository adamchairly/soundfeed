using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Soundfeed.Dal.Migrations
{
    /// <inheritdoc />
    public partial class Add_User_DismissedReleases : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReleaseDismissals",
                columns: table => new
                {
                    DismissedById = table.Column<string>(type: "text", nullable: false),
                    DismissedReleasesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReleaseDismissals", x => new { x.DismissedById, x.DismissedReleasesId });
                    table.ForeignKey(
                        name: "FK_ReleaseDismissals_Releases_DismissedReleasesId",
                        column: x => x.DismissedReleasesId,
                        principalTable: "Releases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReleaseDismissals_Users_DismissedById",
                        column: x => x.DismissedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReleaseDismissals_DismissedReleasesId",
                table: "ReleaseDismissals",
                column: "DismissedReleasesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReleaseDismissals");
        }
    }
}
