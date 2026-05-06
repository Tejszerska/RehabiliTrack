using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RehabRooms.Commands.CreateRehabRoom
{
    public class CreateRehabRoomHandler : IRequestHandler<CreateRehabRoomCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public CreateRehabRoomHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateRehabRoomCommand request, CancellationToken cancellationToken)
        {
            var room = new RehabRoom
            {
                RoomNumber = request.RoomNumber,
                Name = request.Name,
                Capacity = request.Capacity,
                RoomTypeId = request.RoomTypeId
            };

            _context.RehabRooms.Add(room);
            await _context.SaveChangesAsync(cancellationToken);

            return room.Id;
        }
    }
}