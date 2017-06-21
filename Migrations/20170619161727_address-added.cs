using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CaseSite.Migrations
{
    public partial class addressadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Job");

            migrationBuilder.RenameColumn(
                name: "ContactEmail",
                table: "Business",
                newName: "City");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Business",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Zip",
                table: "Business",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Task",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(nullable: true),
                    BusinessId = table.Column<int>(nullable: false),
                    City = table.Column<string>(nullable: true),
                    ContactDescription = table.Column<string>(nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(nullable: false),
                    Deadline = table.Column<DateTimeOffset>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    RewardType = table.Column<string>(nullable: true),
                    RewardValue = table.Column<decimal>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    WorkPlace = table.Column<string>(nullable: true),
                    Zip = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Task", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Task_Business_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Business",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Task_BusinessId",
                table: "Task",
                column: "BusinessId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Task");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Business");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Business",
                newName: "ContactEmail");

            migrationBuilder.CreateTable(
                name: "Job",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BusinessId = table.Column<int>(nullable: false),
                    Deadline = table.Column<DateTimeOffset>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    JobType = table.Column<string>(nullable: true),
                    MaxNumPersons = table.Column<int>(nullable: false),
                    MinNumPersons = table.Column<int>(nullable: false),
                    RewardValue = table.Column<decimal>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    WorkPlace = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Job_Business_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Business",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Job_BusinessId",
                table: "Job",
                column: "BusinessId");
        }
    }
}
