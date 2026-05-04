namespace RehabiliTrack_API.Models
{
    public class RoomType : BaseEntity
    {
        public string Name { get; set; } = string.Empty; // eg. "Kinesitherapy", "Hydrotherapy"
        public virtual ICollection<RehabRoom> RehabRooms { get; set; } = new List<RehabRoom>();
    }
}