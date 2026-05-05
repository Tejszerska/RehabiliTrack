using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace RehabiliTrack_API.Models
{
    public class Appointment : BaseEntity
    {
        [Required(ErrorMessage = "Patient ID is required.")]
        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        [Required(ErrorMessage = "Treatment ID is required.")]
        [ForeignKey("Treatment")]
        public int TreatmentId { get; set; }

        [Required(ErrorMessage = "Therapist ID is required.")]
        [ForeignKey("Therapist")]
        public int TherapistId { get; set; }

        [Required(ErrorMessage = "Room ID is required.")]
        [ForeignKey("Room")]
        public int RoomId { get; set; }

        [Required(ErrorMessage = "Appointment date is required.")]
        public DateTime StartDateTime { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public AppointmentStatus Status { get; set; }

        [ForeignKey("StayParticipation")]
        public int? StayParticipationId { get; set; } // Null = Outpatient (ambulatoryjny)


        public virtual Patient? Patient { get; set; }
        public virtual Treatment? Treatment { get; set; }
        public virtual Therapist? Therapist { get; set; }
        public virtual RehabRoom? Room { get; set; }
        public virtual StayParticipation? StayParticipation { get; set; }
    }
}