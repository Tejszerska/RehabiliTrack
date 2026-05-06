using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RoomTypes.Commands.CreateRoomType
{
    public class CreateRoomTypeHandler : IRequestHandler<CreateRoomTypeCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public CreateRoomTypeHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateRoomTypeCommand request, CancellationToken cancellationToken)
        {
            var roomType = new RoomType
            {
                Name = request.Name
            };

            _context.RoomTypes.Add(roomType);
            await _context.SaveChangesAsync(cancellationToken);

            return roomType.Id;
        }
    }
}
