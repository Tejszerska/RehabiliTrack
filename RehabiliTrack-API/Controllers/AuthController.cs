using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var token = await _mediator.Send(command);

            return Ok(new { Token = token }); // for easy access in React
        }

        /// <summary>
        /// Register new user
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            var newUserId = await _mediator.Send(command);

            return Ok(newUserId);
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword()
        {
            // TODO: logika zmiany hasła (sprawdzenie aktualnego hasła, walidacja nowego hasła, aktualizacja w bazie danych itp.)
            return Ok();
        }
    }
}
