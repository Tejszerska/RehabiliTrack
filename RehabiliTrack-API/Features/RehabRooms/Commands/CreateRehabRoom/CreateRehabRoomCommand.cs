using MediatR;

namespace RehabiliTrack_API.Features.RehabRooms.Commands.CreateRehabRoom
{
    public class CreateRehabRoomCommand : IRequest<int>
    {
        public string RoomNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int RoomTypeId { get; set; }
    }
}