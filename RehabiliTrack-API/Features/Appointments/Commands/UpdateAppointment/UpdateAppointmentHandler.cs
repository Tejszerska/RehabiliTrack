using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Appointments.Commands.UpdateAppointment
{
    public class UpdateAppointmentHandler : IRequestHandler<UpdateAppointmentCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UpdateAppointmentHandler> _logger;

        public UpdateAppointmentHandler(
            ApplicationDbContext context,
            ILogger<UpdateAppointmentHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Unit> Handle(
           UpdateAppointmentCommand request,
           CancellationToken cancellationToken)
        {

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            if (appointment == null)
            {
                throw new KeyNotFoundException($"Appointment with ID {request.Id} not found.");
            }

            _logger.LogInformation("Updating appointment with ID {AppointmentId}", request.Id);

            appointment.PatientId = request.PatientId;
            appointment.TreatmentId = request.TreatmentId;
            appointment.TherapistId = request.TherapistId;
            appointment.RoomId = request.RoomId;
            appointment.StartDateTime = request.StartDateTime;
            appointment.StayParticipationId = request.StayParticipationId;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Appointment with ID: {AppointmentId} updated successfully", request.Id);

            return Unit.Value;  // MediatR Unit = void
        }
    }
}
