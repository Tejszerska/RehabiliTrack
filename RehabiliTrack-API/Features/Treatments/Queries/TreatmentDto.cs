namespace RehabiliTrack_API.Features.Treatments.Queries
{
    public class TreatmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
    }
}