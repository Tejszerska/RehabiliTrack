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
            var query = _context.Appointments.AsQueryable();

            if (request.StayIds != null && request.StayIds.Any())
            {
                var stays = await _context.Stays
                    .Where(s => request.StayIds.Contains(s.Id))
                    .ToListAsync(cancellationToken);

                if (!stays.Any())
                {
                    return new List<AppointmentListItemDto>();
                }

                // min and max dates of current stays
                var minDate = stays.Min(s => s.StartDate);
                var maxDate = stays.Max(s => s.EndDate);

                // 3 filtering:
                query = query.Where(a =>
                    // stay appointments
                    (a.StayParticipationId != null && request.StayIds.Contains(a.StayParticipation.StayId))
                    ||
                    // outpatients appointment but date matches the stay
                    (a.StayParticipationId == null && a.StartDateTime >= minDate && a.StartDateTime <= maxDate)
                );
            }
            query = query.OrderBy(a => a.StartDateTime);

            
            var appointments = await query
                .Select(a => new AppointmentListItemDto
                {
                    Id = a.Id,
                    StartDateTime = a.StartDateTime,
                    Status = a.Status.ToString(),
                    Outpatient = a.StayParticipationId == null,

                    Patient = new PatientInfoDto
                    {
                        Id = a.Patient.Id,
                        FullName = a.Patient.FirstName + " " + a.Patient.LastName
                    },
                    Treatment = new TreatmentInfoDto
                    {
                        Id = a.Treatment.Id,
                        Name = a.Treatment.Name
                    },
                    Therapist = new TherapistInfoDto
                    {
                        Id = a.Therapist.Id,
                        FullName = a.Therapist.FirstName + " " + a.Therapist.LastName
                    },
                    Room = new RoomInfoDto
                    {
                        Id = a.Room.Id,
                        Name = a.Room.Name
                    }
                })
                .ToListAsync(cancellationToken);

            return appointments;
        }
    }
}