using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Therapists.Commands.UpdateTherapist
{
    public class UpdateTherapistHandler : IRequestHandler<UpdateTherapistCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        public UpdateTherapistHandler(ApplicationDbContext context) { _context = context; }
        public async Task<Unit> Handle(UpdateTherapistCommand request, CancellationToken cancellationToken)
        {
            var therapist = await _context.Therapists.FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);
            if (therapist == null) throw new KeyNotFoundException($"Therapist with ID {request.Id} not found.");

            therapist.FirstName = request.FirstName;
            therapist.LastName = request.LastName;
            therapist.LicenseNumber = request.LicenseNumber;
            therapist.PhoneNumber = request.PhoneNumber;
            therapist.Notes = request.Notes;
            therapist.TherapistRoleId = request.TherapistRoleId;

            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}