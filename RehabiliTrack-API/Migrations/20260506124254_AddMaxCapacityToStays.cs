using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RehabiliTrack_API.Migrations
{
    /// <inheritdoc />
    public partial class AddMaxCapacityToStays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxCapacity",
                table: "Stays",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Stays",
                keyColumn: "Id",
                keyValue: 1,
                column: "MaxCapacity",
                value: 20);

            migrationBuilder.UpdateData(
                table: "Stays",
                keyColumn: "Id",
                keyValue: 2,
                column: "MaxCapacity",
                value: 20);

            migrationBuilder.UpdateData(
                table: "Stays",
                keyColumn: "Id",
                keyValue: 3,
                column: "MaxCapacity",
                value: 20);

            migrationBuilder.UpdateData(
                table: "Stays",
                keyColumn: "Id",
                keyValue: 4,
                column: "MaxCapacity",
                value: 20);

            migrationBuilder.UpdateData(
                table: "Stays",
                keyColumn: "Id",
                keyValue: 5,
                column: "MaxCapacity",
                value: 20);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxCapacity",
                table: "Stays");
        }
    }
}
