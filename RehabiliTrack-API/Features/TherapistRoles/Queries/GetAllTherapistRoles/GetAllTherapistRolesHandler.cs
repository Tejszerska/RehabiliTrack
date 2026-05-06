using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.TherapistRoles.Queries.GetAllTherapistRoles
{
    public class GetAllTherapistRolesHandler : IRequestHandler<GetAllTherapistRolesQuery, List<TherapistRoleDto>>
    {
        private readonly ApplicationDbContext _context;
        public GetAllTherapistRolesHandler(ApplicationDbContext context) { _context = context; }
        public async Task<List<TherapistRoleDto>> Handle(GetAllTherapistRolesQuery request, CancellationToken cancellationToken)
        {
            return await _context.TherapistRoles
                .Where(r => r.IsActive)
                .OrderByDescending(t => t.UpdatedAt)
                .Select(r => new TherapistRoleDto { Id = r.Id, Name = r.Name })
                .ToListAsync(cancellationToken);
        }
    }
}