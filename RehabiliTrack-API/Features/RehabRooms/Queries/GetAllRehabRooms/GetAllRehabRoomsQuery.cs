using MediatR;
using RehabiliTrack_API.Features.RehabRooms.Queries;

namespace RehabiliTrack_API.Features.RehabRooms.Queries.GetAllRehabRooms
{
    public class GetAllRehabRoomsQuery : IRequest<List<RehabRoomDto>>
    {
    }
}