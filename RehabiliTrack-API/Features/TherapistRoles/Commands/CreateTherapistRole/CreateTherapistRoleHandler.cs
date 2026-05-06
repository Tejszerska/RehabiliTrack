using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.TherapistRoles.Commands.CreateTherapistRole
{
    public class CreateTherapistRoleHandler : IRequestHandler<CreateTherapistRoleCommand, int>
    {
        private readonly ApplicationDbContext _context;
        public CreateTherapistRoleHandler(ApplicationDbContext context) { _context = context; }
        public async Task<int> Handle(CreateTherapistRoleCommand request, CancellationToken cancellationToken)
        {
            var role = new TherapistRole { Name = request.Name };
            _context.TherapistRoles.Add(role);
            await _context.SaveChangesAsync(cancellationToken);
            return role.Id;
        }
    }
}