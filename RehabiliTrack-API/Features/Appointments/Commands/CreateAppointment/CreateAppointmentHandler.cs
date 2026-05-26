using MediatR;
using RehabiliTrack_API.Models.Data;
using RehabiliTrack_API.Models;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentHandler : IRequestHandler<CreateAppointmentCommand, int>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CreateAppointmentHandler> _logger;

        public CreateAppointmentHandler(
            ApplicationDbContext context,
            ILogger<CreateAppointmentHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {

            int? correctStayParticipationId = null;

            if (request.StayId.HasValue)
            {
                var participation = await _context.StayParticipations
                    .FirstOrDefaultAsync(sp => sp.PatientId == request.PatientId && sp.StayId == request.StayId);
                                
                correctStayParticipationId = participation?.Id;
            }

            var appointment = new Appointment
            {
                PatientId = request.PatientId,
                TreatmentId = request.TreatmentId,
                TherapistId = request.TherapistId,
                RoomId = request.RoomId,
                StartDateTime = request.StartDateTime,
                Status = AppointmentStatus.Scheduled,
                StayParticipationId = correctStayParticipationId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync(cancellationToken);

            return appointment.Id;
        }
    }
}