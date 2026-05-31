using MediatR;

namespace RehabiliTrack_API.Features.Auth.Command.ChangePassword
{
    public class ChangePasswordCommand : IRequest<bool>
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;

        public int UserId { get; set; } // This will be set in the controller based on the authenticated user
    }
}
