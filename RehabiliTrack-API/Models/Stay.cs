using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Models
{
    public class Stay : BaseEntity
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        public DateTime EndDate { get; set; }

        public virtual ICollection<StayParticipation> StayParticipations { get; set; } = new List<StayParticipation>();
    }
}