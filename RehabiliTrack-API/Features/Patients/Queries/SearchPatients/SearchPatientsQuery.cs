namespace RehabiliTrack_API.Features.Patients.Queries.SearchPatients
{
    public class SearchPatientsQuery
    {
        public string SearchPhrase { get; set; }

        public SearchPatientsQuery(string searchTerm)
        {
            SearchPhrase = searchTerm;
        }
    }
}
