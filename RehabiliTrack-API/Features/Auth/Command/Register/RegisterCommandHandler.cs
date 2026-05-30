using MediatR;
using Microsoft.AspNetCore.Identity;
using RehabiliTrack_API.Features.Auth.Command.Login;
using RehabiliTrack_API.Infrastructure.Security;
using RehabiliTrack_API.Models;

namespace RehabiliTrack_API.Features.Auth.Command.Register
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, int>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public RegisterCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<int> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user != null)
            {
                throw new Exception("User already exists");
            }

            user = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email
            };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error while registering: {errors}");
            }

            // Add user to specified roles
            if (request.Roles != null && request.Roles.Any())
            {
                await _userManager.AddToRolesAsync(user, request.Roles);
            }

            // get roles for the user (if any)
            var roles = await _userManager.GetRolesAsync(user);

            return user.Id;
        }
    }
}
