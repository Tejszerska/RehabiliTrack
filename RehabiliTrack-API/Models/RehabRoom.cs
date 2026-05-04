namespace RehabiliTrack_API.Models
{
    public class RehabRoom : BaseEntity
    {
        public string RoomNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int RoomTypeId { get; set; }
        public virtual RoomType? RoomType { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}