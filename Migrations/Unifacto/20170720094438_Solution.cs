using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CaseSite.Migrations.Unifacto
{
    public partial class Solution : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Task_Student_StudentId",
                table: "Task");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Task",
                newName: "WinnerSolutionId");

            migrationBuilder.RenameIndex(
                name: "IX_Task_StudentId",
                table: "Task",
                newName: "IX_Task_WinnerSolutionId");

            migrationBuilder.CreateTable(
                name: "Solution",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    StudentId = table.Column<int>(nullable: false),
                    TaskId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Solution", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Solution_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Solution_Task_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Solution_StudentId",
                table: "Solution",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Solution_TaskId",
                table: "Solution",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Solution_WinnerSolutionId",
                table: "Task",
                column: "WinnerSolutionId",
                principalTable: "Solution",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Task_Solution_WinnerSolutionId",
                table: "Task");

            migrationBuilder.DropTable(
                name: "Solution");

            migrationBuilder.RenameColumn(
                name: "WinnerSolutionId",
                table: "Task",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Task_WinnerSolutionId",
                table: "Task",
                newName: "IX_Task_StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Student_StudentId",
                table: "Task",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
