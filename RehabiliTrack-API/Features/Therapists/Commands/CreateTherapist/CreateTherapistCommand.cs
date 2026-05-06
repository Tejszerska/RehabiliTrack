using MediatR;
namespace RehabiliTrack_API.Features.Therapists.Commands.CreateTherapist
{
    public class CreateTherapistCommand : IRequest<int>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
        public int TherapistRoleId { get; set; }
    }
}