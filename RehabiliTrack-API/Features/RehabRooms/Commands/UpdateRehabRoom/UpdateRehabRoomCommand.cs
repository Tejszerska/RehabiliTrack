using MediatR;

namespace RehabiliTrack_API.Features.RehabRooms.Commands.UpdateRehabRoom
{
    public class UpdateRehabRoomCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int RoomTypeId { get; set; }
    }
}