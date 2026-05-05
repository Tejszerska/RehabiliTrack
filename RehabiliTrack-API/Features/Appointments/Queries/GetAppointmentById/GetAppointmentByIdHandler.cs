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
                .Select(a => new AppointmentDetailsDto
                {
                    Id = a.Id,

                    PatientId = a.PatientId,
                    PatientFullName = a.Patient!.FirstName + " " + a.Patient.LastName,
                    PatientNotes = a.Patient.Notes,
                    PatientPhoneNumber = a.Patient.PhoneNumber,

                    TreatmentId = a.TreatmentId,
                    TreatmentName = a.Treatment!.Name,
                    TreatmentDurationMinutes = a.Treatment.DurationMinutes.ToString(),

                    TherapistId = a.TherapistId,
                    TherapistFullName = a.Therapist!.FirstName + " " + a.Therapist.LastName,
                    TherapistRoleId = a.Therapist.Role!.Id,
                    TherapistRoleName = a.Therapist.Role.Name,

                    RoomId = a.RoomId,
                    RoomName = a.Room!.Name,
                    RoomNumber = a.Room.RoomNumber,
                    RoomTypeId = a.Room.RoomTypeId,
                    RoomTypeName = a.Room.RoomType!.Name,

                    StartDateTime = a.StartDateTime,
                    Status = a.Status.ToString(),

                    StayParticipationId = a.StayParticipationId,
                    StayName = a.StayParticipation != null ? a.StayParticipation.Stay!.Name : string.Empty,
                    StayId = a.StayParticipation != null ? a.StayParticipation.Stay!.Id : 0
                })
                .FirstOrDefaultAsync(cancellationToken);

            return appointment;
        }
    }
}

