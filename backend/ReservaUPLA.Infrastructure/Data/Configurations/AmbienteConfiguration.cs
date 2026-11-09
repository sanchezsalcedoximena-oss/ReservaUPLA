using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Infrastructure.Data.Configurations;

public class AmbienteConfiguration : IEntityTypeConfiguration<Ambiente>
{
    public void Configure(EntityTypeBuilder<Ambiente> builder)
    {
        builder.ToTable("Ambientes");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id)
            .ValueGeneratedNever();

        builder.Property(a => a.Nombre)
            .HasMaxLength(100)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(a => a.Tipo)
            .HasMaxLength(50)
            .HasColumnType("varchar(50)")
            .IsRequired();

        builder.Property(a => a.Capacidad)
            .IsRequired();

        builder.Property(a => a.Ubicacion)
            .HasMaxLength(100)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(a => a.Estado)
            .HasMaxLength(30)
            .HasColumnType("varchar(30)")
            .IsRequired();

        builder.Property(a => a.ResponsableId)
            .IsRequired(false);

        builder.HasOne(a => a.Responsable)
            .WithMany()
            .HasForeignKey(a => a.ResponsableId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
