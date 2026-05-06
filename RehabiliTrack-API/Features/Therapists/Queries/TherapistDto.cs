namespace RehabiliTrack_API.Features.Therapists.Queries
{
    public class TherapistDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
        public int TherapistRoleId { get; set; }
        public string TherapistRoleName { get; set; } = string.Empty;
    }
}