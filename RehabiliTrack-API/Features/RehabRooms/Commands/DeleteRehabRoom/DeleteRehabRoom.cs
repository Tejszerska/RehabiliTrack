using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RehabRooms.Commands.DeleteRehabRoom
{
    public class DeleteRehabRoomHandler : IRequestHandler<DeleteRehabRoomCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public DeleteRehabRoomHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteRehabRoomCommand request, CancellationToken cancellationToken)
        {
            var room = await _context.RehabRooms
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (room == null)
            {
                throw new KeyNotFoundException($"RehabRoom with ID {request.Id} not found.");
            }

            _context.RehabRooms.Remove(room);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}