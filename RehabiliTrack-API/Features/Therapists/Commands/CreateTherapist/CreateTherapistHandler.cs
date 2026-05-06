using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Therapists.Commands.CreateTherapist
{
    public class CreateTherapistHandler : IRequestHandler<CreateTherapistCommand, int>
    {
        private readonly ApplicationDbContext _context;
        public CreateTherapistHandler(ApplicationDbContext context) { _context = context; }
        public async Task<int> Handle(CreateTherapistCommand request, CancellationToken cancellationToken)
        {
            var therapist = new Therapist
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                LicenseNumber = request.LicenseNumber,
                PhoneNumber = request.PhoneNumber,
                Notes = request.Notes,
                TherapistRoleId = request.TherapistRoleId
            };
            _context.Therapists.Add(therapist);
            await _context.SaveChangesAsync(cancellationToken);
            return therapist.Id;
        }
    }
}