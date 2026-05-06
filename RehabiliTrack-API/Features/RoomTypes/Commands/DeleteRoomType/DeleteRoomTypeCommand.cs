using MediatR;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RoomTypes.Commands.DeleteRoomType
{
    public class DeleteRoomTypeCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public DeleteRoomTypeCommand(int id) { Id = id; }
    }

}