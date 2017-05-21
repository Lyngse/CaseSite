using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CaseSite.Migrations
{
    public partial class BusinessContactEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Logo",
                table: "Business");

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "Business",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Business",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Business");

            migrationBuilder.AddColumn<byte[]>(
                name: "Logo",
                table: "Business",
                nullable: true);
        }
    }
}
