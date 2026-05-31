using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RehabiliTrack_API.Features.Auth.Command.ChangePassword;
using RehabiliTrack_API.Features.Auth.Command.Login;
using RehabiliTrack_API.Features.Auth.Command.Register;
using RehabiliTrack_API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Login 
        /// </summary>
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            try
            {
                var token = await _mediator.Send(command);

                return Ok(new { Token = token }); // for easy access in React
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });

            }
        }

        /// <summary>
        /// Register new user
        /// </summary>
        [HttpPost("Register")]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            try
            {
                var newUserId = await _mediator.Send(command);

                return Ok(newUserId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }

        }

        [HttpPost("Change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            // id set in the command based on the authenticated user
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdString, out int userId))
            {
                command.UserId = userId;
            }
            else
            {
                return Unauthorized(new { Error = "Wrong token." });
            }

            try
            {
                await _mediator.Send(command);
                return Ok(new { Message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
