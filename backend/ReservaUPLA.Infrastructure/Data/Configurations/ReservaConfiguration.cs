using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Infrastructure.Data.Configurations;

public class ReservaConfiguration : IEntityTypeConfiguration<Reserva>
{
    public void Configure(EntityTypeBuilder<Reserva> builder)
    {
        builder.ToTable("Reservas");

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id)
            .ValueGeneratedNever();

        builder.Property(r => r.Fecha)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(r => r.HoraInicio)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(r => r.HoraFin)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(r => r.Motivo)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(r => r.Estado)
            .HasMaxLength(30)
            .HasColumnType("varchar(30)")
            .IsRequired();

        builder.HasOne(r => r.Usuario)
            .WithMany()
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Ambiente)
            .WithMany()
            .HasForeignKey(r => r.AmbienteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => new { r.AmbienteId, r.Fecha });
    }
}
