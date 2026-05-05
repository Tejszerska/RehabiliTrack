using MediatR;

namespace RehabiliTrack_API.Features.Patients.Queries.GetPatientById
{
    public class GetPatientByIdQuery : IRequest<PatientDetailsDto?>
    {
        public int Id { get; set; }

        public GetPatientByIdQuery(int id)
        {
            Id = id;
        }

    }

    public class PatientDetailsDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Pesel { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; }

        // @TODO Patient - Stays (many-to-many via StayParticipation) LAB 3
    }
}
