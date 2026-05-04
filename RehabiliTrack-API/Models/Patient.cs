namespace RehabiliTrack_API.Models
{
    public class Patient : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Pesel { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<StayParticipation> StayParticipations { get; set; } = new List<StayParticipation>();
    }
}
