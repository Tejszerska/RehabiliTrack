using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.TherapistRoles.Queries.GetTherapistRoleById
{
    public class GetTherapistRoleByIdHandler : IRequestHandler<GetTherapistRoleByIdQuery, TherapistRoleDto?>
    {
        private readonly ApplicationDbContext _context;
        public GetTherapistRoleByIdHandler(ApplicationDbContext context) { _context = context; }
        public async Task<TherapistRoleDto?> Handle(GetTherapistRoleByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.TherapistRoles
                .Where(r => r.Id == request.Id && r.IsActive)
                .Select(r => new TherapistRoleDto { Id = r.Id, Name = r.Name })
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}