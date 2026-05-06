using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.TherapistRoles.Commands.UpdateTherapistRole
{
    public class UpdateTherapistRoleHandler : IRequestHandler<UpdateTherapistRoleCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        public UpdateTherapistRoleHandler(ApplicationDbContext context) { _context = context; }
        public async Task<Unit> Handle(UpdateTherapistRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _context.TherapistRoles.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
            if (role == null) throw new KeyNotFoundException($"TherapistRole with ID {request.Id} not found.");
            role.Name = request.Name;
            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}