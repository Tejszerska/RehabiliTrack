namespace RehabiliTrack_API.Models
{
    public class TherapistRole : BaseEntity
    {
        public string Name { get; set; } = string.Empty; // eg. "Physiotherapist", "Massage Therapist"
        public virtual ICollection<Therapist> Therapists { get; set; } = new List<Therapist>();
    }
}
