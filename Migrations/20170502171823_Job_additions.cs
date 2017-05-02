using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CaseSite.Migrations
{
    public partial class Job_additions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JobType",
                table: "Job",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkPlace",
                table: "Job",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobType",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "WorkPlace",
                table: "Job");
        }
    }
}
