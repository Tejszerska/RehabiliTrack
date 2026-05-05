using MediatR;

namespace RehabiliTrack_API.Features.Patients.Commands.UpdatePatient
{
    public class UpdatePatientCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Pesel { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
    }
}
