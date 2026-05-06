using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Therapists.Queries.GetAllTherapists
{
    public class GetAllTherapistsHandler : IRequestHandler<GetAllTherapistsQuery, List<TherapistDto>>
    {
        private readonly ApplicationDbContext _context;
        public GetAllTherapistsHandler(ApplicationDbContext context) { _context = context; }
        public async Task<List<TherapistDto>> Handle(GetAllTherapistsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Therapists
                .Where(t => t.IsActive)
                .OrderByDescending(t => t.UpdatedAt)
                .Select(t => new TherapistDto
                {
                    Id = t.Id,
                    FirstName = t.FirstName,
                    LastName = t.LastName,
                    LicenseNumber = t.LicenseNumber,
                    PhoneNumber = t.PhoneNumber,
                    Notes = t.Notes,
                    TherapistRoleId = t.TherapistRoleId,
                    TherapistRoleName = t.Role!.Name
                })
                .ToListAsync(cancellationToken);
        }
    }
}