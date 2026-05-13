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
                .Include(a => a.Patient)
                .Include(a => a.Treatment)
                .Include(a => a.Therapist)
                .Include(a => a.Room)
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