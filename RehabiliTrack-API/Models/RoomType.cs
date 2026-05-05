using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Models
{
    public class RoomType : BaseEntity
    {
        [Required(ErrorMessage = "Room type name is required.")]
        [MaxLength(50, ErrorMessage = "Room type name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty; // eg. "Kinesitherapy", "Hydrotherapy"

        public virtual ICollection<RehabRoom> RehabRooms { get; set; } = new List<RehabRoom>();
    }
}