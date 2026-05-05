using MediatR;

namespace RehabiliTrack_API.Features.Appointments.Commands.UpdateAppointment
{
    public class UpdateAppointmentCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TreatmentId { get; set; }
        public int TherapistId { get; set; }
        public int RoomId { get; set; }
        public DateTime StartDateTime { get; set; }
        public int? StayParticipationId { get; set; } // Null = Outpatient (ambulatoryjny)
    }
}
