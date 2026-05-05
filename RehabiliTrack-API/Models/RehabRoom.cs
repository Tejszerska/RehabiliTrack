using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Wymagane dla ForeignKey

namespace RehabiliTrack_API.Models
{
    public class RehabRoom : BaseEntity
    {
        [Required(ErrorMessage = "Room number is required.")]
        [MaxLength(10, ErrorMessage = "Room number cannot exceed 10 characters.")]
        public string RoomNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Room name is required.")]
        [MaxLength(100, ErrorMessage = "Room name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Capacity is required.")]
        [Range(1, 100, ErrorMessage = "Capacity must be between 1 and 100.")]
        public int Capacity { get; set; }

        [Required(ErrorMessage = "Room type ID is required.")]
        [ForeignKey("RoomType")] // Wskazuje, że to jest klucz obcy dla właściwości nawigacyjnej poniżej
        public int RoomTypeId { get; set; }
        public virtual RoomType? RoomType { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}