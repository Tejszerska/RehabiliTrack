using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Therapists.Queries.GetTherapistById
{
    public class GetTherapistByIdHandler : IRequestHandler<GetTherapistByIdQuery, TherapistDto?>
    {
        private readonly ApplicationDbContext _context;
        public GetTherapistByIdHandler(ApplicationDbContext context) { _context = context; }
        public async Task<TherapistDto?> Handle(GetTherapistByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Therapists
                .Where(t => t.Id == request.Id && t.IsActive)
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
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}