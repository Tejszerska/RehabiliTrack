using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.StayParticipations.Commands.RemovePatientFromStay
{
    public class RemovePatientFromStayHandler : IRequestHandler<RemovePatientFromStayCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public RemovePatientFromStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(RemovePatientFromStayCommand request, CancellationToken cancellationToken)
        {
            var participation = await _context.StayParticipations
                .FirstOrDefaultAsync(sp => sp.Id == request.StayParticipationId, cancellationToken);

            if (participation == null)
            {
                throw new KeyNotFoundException($"StayParticipation with ID {request.StayParticipationId} not found.");
            }

            _context.StayParticipations.Remove(participation);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}