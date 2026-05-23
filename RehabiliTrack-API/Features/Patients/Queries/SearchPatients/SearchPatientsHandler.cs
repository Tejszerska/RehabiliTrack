using RehabiliTrack_API.Features.Patients.Queries.GetAllPatients;
using RehabiliTrack_API.Features.Patients.Queries.GetPatientById;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.Patients.Queries.SearchPatients
{
    public class SearchPatientsHandler
    {
        private readonly ApplicationDbContext _context;

        public SearchPatientsHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<PatientListItemDto>> Handle(
    SearchPatientsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchPhrase))
            {
                var phrase = request.SearchPhrase.Trim();

                if (phrase.All(char.IsDigit))
                {                    
                    query = query.Where(p => p.Pesel.StartsWith(phrase));
                }
                else
                {
                    var words = phrase.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);

                    foreach (var word in words)
                    {
                        query = query.Where(p =>
                            p.FirstName.ToLower().StartsWith(word) ||
                            p.LastName.ToLower().StartsWith(word));
                    }
                }
            }
            return await query
                .Where(p => p.IsActive)
                .Select(p => new PatientListItemDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Pesel = p.Pesel,
                    IsActive = p.IsActive
                }).ToListAsync(cancellationToken);
        }

        
    }
}
