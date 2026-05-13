using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;


namespace RehabiliTrack_API.Features.Appointments.Queries.GetAppointmentById
{
    public class GetAppointmentByIdHandler : IRequestHandler<GetAppointmentByIdQuery, AppointmentDetailsDto>
    {
        private readonly ApplicationDbContext _context;

        public GetAppointmentByIdHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AppointmentDetailsDto?> Handle(
           GetAppointmentByIdQuery request,
           CancellationToken cancellationToken)
        {
            var appointment = await _context.Appointments
                .Where(a => a.Id == request.Id && a.IsActive == true)
                .Include(a => a.Patient)
                .Include(a => a.Treatment)
                .Include(a => a.Therapist)
                .Include(a => a.Room)
                .Select(a => new AppointmentDetailsDto
                {
                    Id = a.Id,
                    StartDateTime = a.StartDateTime,
                    Status = a.Status.ToString(),

                    Patient = new PatientInfoDto
                    {
                        Id = a.Patient.Id,
                        FullName = a.Patient.FirstName + " " + a.Patient.LastName,
                        Notes = a.Patient.Notes,
                        PhoneNumber = a.Patient.PhoneNumber
                    },
                    Treatment = new TreatmentInfoDto
                    {
                        Id = a.Treatment.Id,
                        Name = a.Treatment.Name,
                        DurationMinutes = a.Treatment.DurationMinutes.ToString()
                    },
                    Therapist = new TherapistInfoDto
                    {
                        Id = a.Therapist.Id,
                        FullName = a.Therapist.FirstName + " " + a.Therapist.LastName,
                        RoleId= a.Therapist.Role.Id,
                        RoleName = a.Therapist.Role.Name
                    },
                    Room = new RoomInfoDto
                    {
                        Id = a.Room.Id,
                        Name = a.Room.Name,
                        Number = a.Room.RoomNumber,
                        TypeId = a.Room.RoomType.Id,
                        TypeName = a.Room.RoomType.Name
                    }
                })
                .FirstOrDefaultAsync(cancellationToken);

            return appointment;
        }
    }
}

