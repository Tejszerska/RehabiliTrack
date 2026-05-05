using MediatR;

namespace RehabiliTrack_API.Features.Patients.Commands.CreatePatient
{
    public class CreatePatientCommand : IRequest<int>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Pesel { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
    }
}
