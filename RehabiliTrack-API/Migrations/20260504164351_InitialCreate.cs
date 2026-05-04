using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RehabiliTrack_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pesel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoomTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Stays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stays", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TherapistRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TherapistRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Treatments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treatments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RehabRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    RoomTypeId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RehabRooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RehabRooms_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StayParticipations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    StayId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StayParticipations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StayParticipations_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StayParticipations_Stays_StayId",
                        column: x => x.StayId,
                        principalTable: "Stays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Therapists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TherapistRoleId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Therapists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Therapists_TherapistRoles_TherapistRoleId",
                        column: x => x.TherapistRoleId,
                        principalTable: "TherapistRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    TreatmentId = table.Column<int>(type: "int", nullable: false),
                    TherapistId = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    StartDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StayParticipationId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_RehabRooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "RehabRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_StayParticipations_StayParticipationId",
                        column: x => x.StayParticipationId,
                        principalTable: "StayParticipations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_Therapists_TherapistId",
                        column: x => x.TherapistId,
                        principalTable: "Therapists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_Treatments_TreatmentId",
                        column: x => x.TreatmentId,
                        principalTable: "Treatments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Patients",
                columns: new[] { "Id", "CreatedAt", "FirstName", "IsActive", "LastName", "Notes", "Pesel", "PhoneNumber", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Adam", true, "Zieliński", null, "80010112345", "600100200", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Ewa", true, "Szymańska", null, "92020254321", "600200300", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Michał", true, "Woźniak", null, "75030398765", "600300400", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Karolina", true, "Dąbrowska", null, "88040411223", "600400500", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Krzysztof", true, "Kozłowski", null, "65050533445", "600500600", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "RoomTypes",
                columns: new[] { "Id", "CreatedAt", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Kinesitherapy", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Hydrotherapy", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Massage", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Stays",
                columns: new[] { "Id", "CreatedAt", "EndDate", "IsActive", "Name", "StartDate", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "Spring Stay 2026", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "Summer Stay 2026", new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 10, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "Autumn Stay 2026", new DateTime(2026, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 12, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "Winter Stay 2026", new DateTime(2026, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2027, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "New Year Stay 2027", new DateTime(2027, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "TherapistRoles",
                columns: new[] { "Id", "CreatedAt", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Physiotherapist", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Massage Therapist", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Occupational Therapist", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Treatments",
                columns: new[] { "Id", "CreatedAt", "DurationMinutes", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), 30, true, "Classic Massage", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), 15, true, "Cryotherapy", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), 15, true, "Laser Therapy", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), 20, true, "Pearl Bath", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), 45, true, "Individual Exercises", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "RehabRooms",
                columns: new[] { "Id", "Capacity", "CreatedAt", "IsActive", "Name", "RoomNumber", "RoomTypeId", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 10, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Main Gym Hall", "101", 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Massage Parlor A", "102", 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Massage Parlor B", "103", 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, 8, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Rehabilitation Pool", "201", 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, 4, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), true, "Whirlpool Tubs", "202", 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Therapists",
                columns: new[] { "Id", "CreatedAt", "FirstName", "IsActive", "LastName", "LicenseNumber", "Notes", "PhoneNumber", "TherapistRoleId", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Jan", true, "Kowalski", "PWZ12345", null, "111222333", 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Anna", true, "Nowak", "PWZ23456", null, "222333444", 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Piotr", true, "Wiśniewski", "PWZ34567", null, "333444555", 1, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Maria", true, "Wójcik", "PWZ45678", null, "444555666", 3, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Tomasz", true, "Kamiński", "PWZ56789", null, "555666777", 2, new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientId",
                table: "Appointments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_RoomId",
                table: "Appointments",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_StayParticipationId",
                table: "Appointments",
                column: "StayParticipationId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_TherapistId",
                table: "Appointments",
                column: "TherapistId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_TreatmentId",
                table: "Appointments",
                column: "TreatmentId");

            migrationBuilder.CreateIndex(
                name: "IX_RehabRooms_RoomTypeId",
                table: "RehabRooms",
                column: "RoomTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_StayParticipations_PatientId",
                table: "StayParticipations",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_StayParticipations_StayId",
                table: "StayParticipations",
                column: "StayId");

            migrationBuilder.CreateIndex(
                name: "IX_Therapists_TherapistRoleId",
                table: "Therapists",
                column: "TherapistRoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "RehabRooms");

            migrationBuilder.DropTable(
                name: "StayParticipations");

            migrationBuilder.DropTable(
                name: "Therapists");

            migrationBuilder.DropTable(
                name: "Treatments");

            migrationBuilder.DropTable(
                name: "RoomTypes");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Stays");

            migrationBuilder.DropTable(
                name: "TherapistRoles");
        }
    }
}
