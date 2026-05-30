using MediatR;

namespace RehabiliTrack_API.Features.Auth.Command.Login
{
    public class LoginCommand : IRequest<string>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

    }
}
