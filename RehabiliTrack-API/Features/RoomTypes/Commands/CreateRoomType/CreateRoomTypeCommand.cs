using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.RoomTypes.Commands.CreateRoomType
{
    public class CreateRoomTypeCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
    }
}