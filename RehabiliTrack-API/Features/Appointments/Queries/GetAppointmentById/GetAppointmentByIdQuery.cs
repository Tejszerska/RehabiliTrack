using MediatR;

namespace RehabiliTrack_API.Features.Appointments.Queries.GetAppointmentById
{
    public class GetAppointmentByIdQuery : IRequest<AppointmentDetailsDto>
    {
        public int Id { get; set; }

        public GetAppointmentByIdQuery(int id)
        {
            Id = id;
        }

    }

    public class AppointmentDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientFullName { get; set; } = string.Empty;
        public string? PatientNotes { get; set; }
        public string? PatientPhoneNumber { get; set; }

        public int TreatmentId { get; set; }
        public string TreatmentName { get; set; } = string.Empty;
        public string TreatmentDurationMinutes { get; set; } = string.Empty;

        public int TherapistId { get; set; }
        public string TherapistFullName { get; set; } = string.Empty;
        public int TherapistRoleId { get; set; }
        public string TherapistRoleName { get; set; } = string.Empty;

        public int RoomId { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;

        public DateTime StartDateTime { get; set; }
        public string Status { get; set; } = string.Empty;

        public int ? StayParticipationId { get; set; }
        public string StayName { get; set; } = string.Empty;
        public int StayId { get; set; }


    }
}
