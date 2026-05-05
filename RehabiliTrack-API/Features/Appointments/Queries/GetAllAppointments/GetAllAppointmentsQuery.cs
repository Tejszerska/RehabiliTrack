using MediatR;

namespace RehabiliTrack_API.Features.Appointments.Queries.GetAllAppointments
{
    public class GetAllAppointmentsQuery : IRequest<List<AppointmentListItemDto>>
    {
    }

    public class AppointmentListItemDto
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public string PatientFullName { get; set; } = string.Empty;

        public int TreatmentId { get; set; }
        public string TreatmentName { get; set; } = string.Empty;

        public int TherapistId { get; set; }
        public string TherapistFullName { get; set; } = string.Empty;

        public int RoomId { get; set; }
        public string RoomName { get; set; } = string.Empty;

        public DateTime StartDateTime { get; set; }
        public string Status { get; set; } = string.Empty;

        public bool Outpatient { get; set; }


    }
}
