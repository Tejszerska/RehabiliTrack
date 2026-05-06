using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RehabRooms.Queries.GetRehabRoomById
{
    public class GetRehabRoomByIdHandler : IRequestHandler<GetRehabRoomByIdQuery, RehabRoomDto?>
    {
        private readonly ApplicationDbContext _context;

        public GetRehabRoomByIdHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RehabRoomDto?> Handle(GetRehabRoomByIdQuery request, CancellationToken cancellationToken)
        {
            var room = await _context.RehabRooms
                .Where(r => r.Id == request.Id && r.IsActive)
                .Select(r => new RehabRoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    Name = r.Name,
                    Capacity = r.Capacity,
                    RoomTypeId = r.RoomTypeId,
                    RoomTypeName = r.RoomType!.Name
                })
                .FirstOrDefaultAsync(cancellationToken);

            return room;
        }
    }
}