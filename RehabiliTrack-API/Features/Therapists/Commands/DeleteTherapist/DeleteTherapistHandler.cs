using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Therapists.Commands.DeleteTherapist
{
    public class DeleteTherapistHandler : IRequestHandler<DeleteTherapistCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        public DeleteTherapistHandler(ApplicationDbContext context) { _context = context; }
        public async Task<Unit> Handle(DeleteTherapistCommand request, CancellationToken cancellationToken)
        {
            var therapist = await _context.Therapists.FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);
            if (therapist == null) throw new KeyNotFoundException($"Therapist with ID {request.Id} not found.");
            _context.Therapists.Remove(therapist);
            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}