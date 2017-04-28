using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using CaseSite.Models;

namespace CaseSite.Migrations
{
    [DbContext(typeof(CaseSiteContext))]
    [Migration("20170427160928_Businesses")]
    partial class Businesses
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("CaseSite.Models.Business", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("description");

                    b.Property<byte[]>("logo");

                    b.Property<string>("name");

                    b.HasKey("Id");

                    b.ToTable("Business");
                });

            modelBuilder.Entity("CaseSite.Models.Job", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Deadline");

                    b.Property<string>("Disciption");

                    b.Property<int>("MaxNumPersons");

                    b.Property<int>("MinNumPersons");

                    b.Property<decimal>("RewardValue");

                    b.Property<string>("Title");

                    b.HasKey("Id");

                    b.ToTable("Job");
                });
        }
    }
}
