using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Soundfeed.Dal.Migrations
{
    /// <inheritdoc />
    public partial class Add_User_LastSyncedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastSyncedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastSyncedAt",
                table: "Users");
        }
    }
}
