using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RehabiliTrack_API.Models
{
    [Index(nameof(LicenseNumber), IsUnique = true)]
    public class Therapist : BaseEntity
    {
        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "License number is required.")]
        [MaxLength(7, ErrorMessage = "License number cannot exceed 7 characters.")]
        public string LicenseNumber { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number format.")]
        [MaxLength(15, ErrorMessage = "Phone number cannot exceed 15 characters.")]
        public string? PhoneNumber { get; set; }

        [MaxLength(500, ErrorMessage = "Notes cannot exceed 500 characters.")]
        public string? Notes { get; set; }

        [Required(ErrorMessage = "Therapist role ID is required.")]
        [ForeignKey("Role")]
        public int TherapistRoleId { get; set; }
        public virtual TherapistRole? Role { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}