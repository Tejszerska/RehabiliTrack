using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Creation date is required.")]
        public DateTime CreatedAt { get; set; }

        [Required(ErrorMessage = "Update date is required.")]
        public DateTime UpdatedAt { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}