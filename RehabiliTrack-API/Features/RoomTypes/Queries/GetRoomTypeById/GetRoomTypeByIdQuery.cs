using MediatR;

namespace RehabiliTrack_API.Features.RoomTypes.Queries.GetRoomTypeById
{
    public class GetRoomTypeByIdQuery : IRequest<RoomTypeDto>
    {
        public int Id { get; set; }
        public GetRoomTypeByIdQuery(int id) { Id = id; }
    }
}
