using MediatR;
using RehabiliTrack_API.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RehabiliTrack_API.Features.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentCommand : IRequest<int>
    {
        public int PatientId { get; set; }
        public int TreatmentId { get; set; }
        public int TherapistId { get; set; }
        public int RoomId { get; set; }
        public DateTime StartDateTime { get; set; }
        public AppointmentStatus Status { get; set; }
        public int? StayParticipationId { get; set; } // Null = Outpatient (ambulatoryjny)
        public int? StayId { get; set; } // Null = Outpatient (ambulatoryjny)

    }
}
