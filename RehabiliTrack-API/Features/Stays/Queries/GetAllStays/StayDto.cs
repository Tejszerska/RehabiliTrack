namespace RehabiliTrack_API.Features.Stays.Queries.GetAllStays
{
    public class StayDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Occupancy { get; set; } // Number of patients currently in the stay counted in handler
    }
}