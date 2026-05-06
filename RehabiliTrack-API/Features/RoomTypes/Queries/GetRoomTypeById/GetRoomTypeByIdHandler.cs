using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.RoomTypes.Queries.GetRoomTypeById
{
    public class GetRoomTypeByIdHandler : IRequestHandler<GetRoomTypeByIdQuery, RoomTypeDto?>
    {
        private readonly ApplicationDbContext _context;
        public GetRoomTypeByIdHandler(ApplicationDbContext context) { _context = context; }

        public async Task<RoomTypeDto?> Handle(GetRoomTypeByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.RoomTypes
                .Where(rt => rt.Id == request.Id && rt.IsActive)
                .Select(rt => new RoomTypeDto { Id = rt.Id, Name = rt.Name })
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
