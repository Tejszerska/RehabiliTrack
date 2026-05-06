using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RehabRooms.Commands.UpdateRehabRoom
{
    public class UpdateRehabRoomHandler : IRequestHandler<UpdateRehabRoomCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public UpdateRehabRoomHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateRehabRoomCommand request, CancellationToken cancellationToken)
        {
            var room = await _context.RehabRooms
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (room == null)
            {
                throw new KeyNotFoundException($"RehabRoom with ID {request.Id} not found.");
            }

            room.RoomNumber = request.RoomNumber;
            room.Name = request.Name;
            room.Capacity = request.Capacity;
            room.RoomTypeId = request.RoomTypeId;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}