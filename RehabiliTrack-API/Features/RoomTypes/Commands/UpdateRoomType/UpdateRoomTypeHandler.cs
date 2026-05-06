using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.RoomTypes.Commands.UpdateRoomType
{

    public class UpdateRoomTypeHandler : IRequestHandler<UpdateRoomTypeCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public UpdateRoomTypeHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateRoomTypeCommand request, CancellationToken cancellationToken)
        {
            var roomType = await _context.RoomTypes
                .FirstOrDefaultAsync(rt => rt.Id == request.Id, cancellationToken);

            if (roomType == null)
                throw new KeyNotFoundException($"RoomType with ID {request.Id} not found.");

            roomType.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
