using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CaseSite.Migrations
{
    public partial class BusinessUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Business");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Business",
                newName: "UserId");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Business",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Business_UserId",
                table: "Business",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Business_AspNetUsers_UserId",
                table: "Business",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Business_AspNetUsers_UserId",
                table: "Business");

            migrationBuilder.DropIndex(
                name: "IX_Business_UserId",
                table: "Business");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Business",
                newName: "Username");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Business",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Business",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Business",
                nullable: true);
        }
    }
}
