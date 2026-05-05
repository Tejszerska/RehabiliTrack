using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Models
{
    public class Treatment : BaseEntity
    {
        [Required(ErrorMessage = "Treatment name is required.")]
        [MaxLength(100, ErrorMessage = "Treatment name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Duration is required.")]
        [Range(1, 480, ErrorMessage = "Duration must be between 1 and 480 minutes.")]
        public int DurationMinutes { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}