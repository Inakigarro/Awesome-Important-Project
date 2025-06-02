using AiProject.Contracts;
using AiProject.Contracts.Turnos;
using AiProject.Domain;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AiProject.Persistence;

public class TurnosService : ITurnosService
{
    private readonly IUnitOfWork _unitOfWork;

    public TurnosService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<TurnoDto> CrearTurnoAsync(CrearTurnoRequest request, CancellationToken cancellationToken)
    {
        // Validar cantidad de personas
        if (request.Personas.Count < 1)
            throw new InvalidOperationException("Debe haber al menos una persona acompañante para crear un turno.");

        if (request.Personas.Count > 3)
            throw new InvalidOperationException("No se pueden agregar más de 3 personas al turno (además del solicitante).");

        // Validar horario permitido
        var horaInicio = request.HoraInicio;
        var horaFin = request.HoraFin;
        var esHorarioValido =
            (horaInicio >= new TimeOnly(9, 0) && horaFin <= new TimeOnly(13, 0)) ||
            (horaInicio >= new TimeOnly(16, 0) && horaFin <= new TimeOnly(21, 0));
        if (!esHorarioValido)
            throw new InvalidOperationException("El horario debe estar entre 9-13 o 16-21 hs.");

        // Validar día permitido (lunes a sábado)
        var diaSemana = request.Fecha.DayOfWeek;
        if (diaSemana == DayOfWeek.Sunday)
            throw new InvalidOperationException("No se pueden reservar turnos los domingos.");

        // Validar disponibilidad (no debe superponerse con otro turno en la misma cancha y horario)
        var turnoRepo = _unitOfWork.Repository<Turno, Guid>();
        var turnosSuperpuestos = await turnoRepo.Query()
            .Where(t => t.CanchaId == request.CanchaId && t.Fecha == request.Fecha && (request.HoraInicio < t.HoraFin && request.HoraFin > t.HoraInicio))
            .ToListAsync(cancellationToken);
        if (turnosSuperpuestos.Any())
            throw new InvalidOperationException("Ya existe un turno reservado para la cancha y horario seleccionado.");

        // Crear entidad Turno
        var turno = new Turno
        {
            Id = Guid.NewGuid(),
            CanchaId = request.CanchaId,
            Fecha = request.Fecha,
            HoraInicio = request.HoraInicio,
            HoraFin = request.HoraFin,
            SocioSolicitanteId = request.SocioSolicitanteId,
            Personas = request.Personas.Select(p => new PersonaTurno
            {
                Id = Guid.NewGuid(),
                SocioId = p.SocioId,
                Nombre = p.Nombre,
                Apellido = p.Apellido
            }).ToList()
        };

        await turnoRepo.AddAsync(turno, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Mapear a TurnoDto
        return new TurnoDto
        {
            Id = turno.Id,
            CanchaId = turno.CanchaId,
            Fecha = turno.Fecha,
            HoraInicio = turno.HoraInicio,
            HoraFin = turno.HoraFin,
            SocioSolicitanteId = turno.SocioSolicitanteId,
            Personas = turno.Personas.Select(p => new PersonaTurnoDto
            {
                SocioId = p.SocioId,
                Nombre = p.Nombre,
                Apellido = p.Apellido
            }).ToList()
        };
    }

    public async Task<IEnumerable<TurnoDto>> ObtenerTurnosDisponiblesSemanaAsync(DateOnly desde, CancellationToken cancellationToken)
    {
        // Lógica para obtener turnos disponibles de la semana irá aquí
        throw new NotImplementedException();
    }
}
