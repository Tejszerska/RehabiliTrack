using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.TherapistRoles.Commands.DeleteTherapistRole
{
    public class DeleteTherapistRoleHandler : IRequestHandler<DeleteTherapistRoleCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        public DeleteTherapistRoleHandler(ApplicationDbContext context) { _context = context; }
        public async Task<Unit> Handle(DeleteTherapistRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _context.TherapistRoles.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
            if (role == null) throw new KeyNotFoundException($"TherapistRole with ID {request.Id} not found.");
            _context.TherapistRoles.Remove(role);
            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}