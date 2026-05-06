using MediatR;

namespace RehabiliTrack_API.Features.RoomTypes.Queries.GetAllRoomTypes
{
    public class GetAllRoomTypesQuery : IRequest<List<RoomTypeDto>> { }
}
