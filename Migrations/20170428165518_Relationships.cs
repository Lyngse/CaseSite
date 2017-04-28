using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CaseSite.Migrations
{
    public partial class Relationships : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BusinessId",
                table: "Job",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Job_BusinessId",
                table: "Job",
                column: "BusinessId");

            migrationBuilder.AddForeignKey(
                name: "FK_Job_Business_BusinessId",
                table: "Job",
                column: "BusinessId",
                principalTable: "Business",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Job_Business_BusinessId",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Job_BusinessId",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "BusinessId",
                table: "Job");
        }
    }
}
