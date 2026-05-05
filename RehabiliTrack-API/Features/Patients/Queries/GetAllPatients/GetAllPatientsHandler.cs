using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.Patients.Queries.GetAllPatients
{
    public class GetAllPatientsHandler : IRequestHandler<GetAllPatientsQuery, List<PatientListItemDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllPatientsHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<PatientListItemDto>> Handle
            (GetAllPatientsQuery request, CancellationToken cancellationToken)
        {
            var patients = await _context.Patients
                .Where(p => p.IsActive)
                .OrderByDescending(p => p.UpdatedAt)
                .Select(p => new PatientListItemDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Pesel = p.Pesel,
                    IsActive = p.IsActive
                })
                .ToListAsync(cancellationToken);

            return patients;
        }
    }
}
