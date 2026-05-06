using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RehabRooms.Queries.GetAllRehabRooms
{
    public class GetAllRehabRoomsHandler : IRequestHandler<GetAllRehabRoomsQuery, List<RehabRoomDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllRehabRoomsHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RehabRoomDto>> Handle(GetAllRehabRoomsQuery request, CancellationToken cancellationToken)
        {
            var rooms = await _context.RehabRooms
                .Where(r => r.IsActive)
                .OrderByDescending(r => r.UpdatedAt)
                .Select(r => new RehabRoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    Name = r.Name,
                    Capacity = r.Capacity,
                    RoomTypeId = r.RoomTypeId,
                    RoomTypeName = r.RoomType!.Name
                })
                .ToListAsync(cancellationToken);

            return rooms;
        }
    }
}