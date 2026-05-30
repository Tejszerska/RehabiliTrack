using MediatR;

namespace RehabiliTrack_API.Features.Auth.Command.Register
{
    public class RegisterCommand : IRequest<int>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
        public int? PersonalId { get; set; }


    }
}
