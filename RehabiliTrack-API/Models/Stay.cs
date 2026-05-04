namespace RehabiliTrack_API.Models
{
    public class Stay : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public virtual ICollection<StayParticipation> StayParticipations { get; set; } = new List<StayParticipation>();
    }
}