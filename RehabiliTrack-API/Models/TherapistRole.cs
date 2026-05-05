using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Models
{
    public class TherapistRole : BaseEntity
    {
        [Required(ErrorMessage = "Role name is required.")]
        [MaxLength(50, ErrorMessage = "Role name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty; // eg. "Physiotherapist", "Massage Therapist"

        public virtual ICollection<Therapist> Therapists { get; set; } = new List<Therapist>();
    }
}