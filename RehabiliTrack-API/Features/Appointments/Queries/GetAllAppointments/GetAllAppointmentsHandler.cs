using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.Appointments.Queries.GetAllAppointments
{
    public class GetAllAppointmentsHandler : IRequestHandler<GetAllAppointmentsQuery, List<AppointmentListItemDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllAppointmentsHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AppointmentListItemDto>> Handle(GetAllAppointmentsQuery request, CancellationToken cancellationToken)
        {
            var appointments = await _context.Appointments
                .Where(p => p.IsActive)
                .OrderByDescending(p => p.UpdatedAt)
                .Select(a => new AppointmentListItemDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientFullName = a.Patient!.FirstName + " " + a.Patient.LastName,
                    TreatmentId = a.TreatmentId,
                    TreatmentName = a.Treatment!.Name,
                    TherapistId = a.TherapistId,
                    TherapistFullName = a.Therapist!.FirstName + " " + a.Therapist.LastName,
                    RoomId = a.RoomId,
                    RoomName = a.Room!.Name,
                    StartDateTime = a.StartDateTime,
                    Status = a.Status.ToString(),
                    Outpatient = a.StayParticipationId == null
                })
                .ToListAsync(cancellationToken);

            return appointments;
        }
    }
}