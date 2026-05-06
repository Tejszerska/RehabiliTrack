using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.RoomTypes.Commands.DeleteRoomType
{
    public class DeleteRoomTypeHandler : IRequestHandler<DeleteRoomTypeCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public DeleteRoomTypeHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteRoomTypeCommand request, CancellationToken cancellationToken)
        {
            var roomType = await _context.RoomTypes
                .FirstOrDefaultAsync(rt => rt.Id == request.Id, cancellationToken);

            if (roomType == null)
                throw new KeyNotFoundException($"RoomType with ID {request.Id} not found.");

            _context.RoomTypes.Remove(roomType);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
