using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using CaseSite.Models;

namespace CaseSite.Migrations
{
    [DbContext(typeof(CaseSiteContext))]
    [Migration("20170428170339_usernameAndPassword")]
    partial class usernameAndPassword
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

                    b.Property<string>("Description");

                    b.Property<string>("Email");

                    b.Property<byte[]>("Logo");

                    b.Property<string>("Name");

                    b.Property<string>("Username");

                    b.Property<string>("password");

                    b.HasKey("Id");

                    b.ToTable("Business");
                });

            modelBuilder.Entity("CaseSite.Models.Job", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BusinessId");

                    b.Property<DateTimeOffset>("Deadline");

                    b.Property<string>("Disciption");

                    b.Property<int>("MaxNumPersons");

                    b.Property<int>("MinNumPersons");

                    b.Property<decimal>("RewardValue");

                    b.Property<string>("Title");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.ToTable("Job");
                });

            modelBuilder.Entity("CaseSite.Models.Job", b =>
                {
                    b.HasOne("CaseSite.Models.Business", "Business")
                        .WithMany("Jobs")
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
