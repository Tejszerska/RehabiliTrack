using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Models
{
    [Index(nameof(Pesel), IsUnique = true)]
    public class Patient : BaseEntity
    {
        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "PESEL is required.")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "PESEL must be exactly 11 characters long.")]
        public string Pesel { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number format.")]
        [MaxLength(15)]
        public string? PhoneNumber { get; set; }

        [MaxLength(500, ErrorMessage = "Notes cannot exceed 500 characters.")]
        public string? Notes { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<StayParticipation> StayParticipations { get; set; } = new List<StayParticipation>();
    }
}