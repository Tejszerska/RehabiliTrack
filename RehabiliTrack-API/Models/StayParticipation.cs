namespace RehabiliTrack_API.Models
{
    // table linking Patient and Stay, representing the participation of a patient in a stay
    public class StayParticipation : BaseEntity
    {
        public int PatientId { get; set; }
        public int StayId { get; set; }
        public virtual Patient? Patient { get; set; }
        public virtual Stay? Stay { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}