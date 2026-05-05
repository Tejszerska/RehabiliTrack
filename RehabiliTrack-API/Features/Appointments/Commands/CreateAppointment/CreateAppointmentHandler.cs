using MediatR;
using RehabiliTrack_API.Models.Data;
using RehabiliTrack_API.Models;

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
            var appointment = new Appointment
            {
                PatientId = request.PatientId,
                TreatmentId = request.TreatmentId,
                TherapistId = request.TherapistId,
                RoomId = request.RoomId,
                StartDateTime = request.StartDateTime,
                Status = AppointmentStatus.Scheduled,
                StayParticipationId = request.StayParticipationId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync(cancellationToken);

            return appointment.Id;
        }
    }
}