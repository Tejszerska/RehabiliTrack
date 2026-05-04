namespace RehabiliTrack_API.Models
{
    public class Appointment : BaseEntity
    {
        public int PatientId { get; set; }
        public int TreatmentId { get; set; }
        public int TherapistId { get; set; }
        public int RoomId { get; set; }
        public DateTime StartDateTime { get; set; }
        public AppointmentStatus Status { get; set; }
        public int? StayParticipationId { get; set; } // Null = Outpatient (ambulatoryjny)
        public virtual Patient? Patient { get; set; }
        public virtual Treatment? Treatment { get; set; }
        public virtual Therapist? Therapist { get; set; }
        public virtual RehabRoom? Room { get; set; }
        public virtual StayParticipation? StayParticipation { get; set; }
    }
}