namespace RehabiliTrack_API.Models
{
    public class Therapist : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty; // PWZ
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
        public int TherapistRoleId { get; set; }
        public virtual TherapistRole? Role { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}