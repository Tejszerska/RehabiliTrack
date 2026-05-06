using MediatR;
using RehabiliTrack_API.Features.RehabRooms.Queries;

namespace RehabiliTrack_API.Features.RehabRooms.Queries.GetRehabRoomById
{
    public class GetRehabRoomByIdQuery : IRequest<RehabRoomDto>
    {
        public int Id { get; set; }

        public GetRehabRoomByIdQuery(int id)
        {
            Id = id;
        }
    }
}