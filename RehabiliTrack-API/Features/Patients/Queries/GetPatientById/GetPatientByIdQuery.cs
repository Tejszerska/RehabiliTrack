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

        public List<PatientStayDto> Stays { get; set; } = new();

        public class PatientStayDto
        {
            public int StayId { get; set; }
            public string StayName { get; set; } = string.Empty;
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            
        }
    }
}
