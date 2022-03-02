﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProjekatNovi.Modeli;

namespace ProjekatNovi.Migrations
{
    [DbContext(typeof(KorisniciDC))]
    partial class KorisniciDCModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.14")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ProjekatNovi.Modeli.KorisnikDetalji", b =>
                {
                    b.Property<int>("IDkorisnika")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Brojlicnekarte")
                        .HasColumnType("nvarchar(9)");

                    b.Property<string>("Imeiprezime")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Tribina")
                        .HasColumnType("nvarchar(10)");

                    b.HasKey("IDkorisnika");

                    b.ToTable("KorisnikDetalji");
                });
#pragma warning restore 612, 618
        }
    }
}
