using MediatR;

namespace RehabiliTrack_API.Features.Patients.Queries.GetAllPatients
{
    public class GetAllPatientsQuery : IRequest<List<PatientListItemDto>>
    {

    }

    public class PatientListItemDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Pesel { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
