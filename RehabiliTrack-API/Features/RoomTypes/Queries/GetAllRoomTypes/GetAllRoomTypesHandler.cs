using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.RoomTypes.Queries.GetAllRoomTypes
{
    public class GetAllRoomTypesHandler : IRequestHandler<GetAllRoomTypesQuery, List<RoomTypeDto>>
    {
        private readonly ApplicationDbContext _context;
        public GetAllRoomTypesHandler(ApplicationDbContext context) { _context = context; }

        public async Task<List<RoomTypeDto>> Handle(GetAllRoomTypesQuery request, CancellationToken cancellationToken)
        {
            return await _context.RoomTypes
                .Where(rt => rt.IsActive)
                .OrderByDescending(r => r.UpdatedAt)
                .Select(rt => new RoomTypeDto { Id = rt.Id, Name = rt.Name })
                .ToListAsync(cancellationToken);
        }
    }
}
