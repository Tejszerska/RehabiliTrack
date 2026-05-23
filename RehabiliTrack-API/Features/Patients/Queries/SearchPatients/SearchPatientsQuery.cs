using MediatR;
using RehabiliTrack_API.Features.Patients.Queries.GetAllPatients;
using RehabiliTrack_API.Features.Patients.Queries.GetPatientById;

namespace RehabiliTrack_API.Features.Patients.Queries.SearchPatients
{
    public class SearchPatientsQuery : IRequest<List<PatientListItemDto>>
    {
        public string SearchPhrase { get; set; }

        public SearchPatientsQuery(string searchTerm)
        {
            SearchPhrase = searchTerm;
        }
    }
}
