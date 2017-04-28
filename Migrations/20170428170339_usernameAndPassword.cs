using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CaseSite.Migrations
{
    public partial class usernameAndPassword : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                table: "Business",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "logo",
                table: "Business",
                newName: "Logo");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Business",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Business",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Business",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "password",
                table: "Business",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "password",
                table: "Business");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Business",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Logo",
                table: "Business",
                newName: "logo");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Business",
                newName: "description");
        }
    }
}
