namespace RehabiliTrack_API.Models
{
    public class Treatment : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}