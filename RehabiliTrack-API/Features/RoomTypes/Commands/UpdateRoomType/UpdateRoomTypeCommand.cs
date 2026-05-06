using MediatR;


namespace RehabiliTrack_API.Features.RoomTypes.Commands.UpdateRoomType
{
    public class UpdateRoomTypeCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

}