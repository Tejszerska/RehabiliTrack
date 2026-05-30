using MediatR;
using Microsoft.AspNetCore.Identity;
using RehabiliTrack_API.Features.Patients.Commands.CreatePatient;
using RehabiliTrack_API.Infrastructure.Security;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Auth.Command.Login
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, string>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public LoginCommandHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new Exception("Incorrect username or password");
            }

            // get roles for the user (if any)
            var roles = await _userManager.GetRolesAsync(user);
           
            var token = _tokenService.GenerateToken(user, roles);

            return token;
        }

    }
}
