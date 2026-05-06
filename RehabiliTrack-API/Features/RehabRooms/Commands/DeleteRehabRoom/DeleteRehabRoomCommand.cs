using MediatR;

namespace RehabiliTrack_API.Features.RehabRooms.Commands.DeleteRehabRoom
{
    public class DeleteRehabRoomCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteRehabRoomCommand(int id)
        {
            Id = id;
        }
    }
}