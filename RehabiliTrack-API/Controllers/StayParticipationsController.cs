using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.StayParticipations.Commands.AssignPatientToStay;
using RehabiliTrack_API.Features.StayParticipations.Commands.RemovePatientFromStay;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StayParticipationsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StayParticipationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Assign a patient to a stay
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AssignPatient([FromBody] AssignPatientToStayCommand command)
        {
            var stayParticipationId = await _mediator.Send(command);

            // 200 OK with new ID
            return Ok(new { id = stayParticipationId, message = "Patient assigned to stay successfully" });
        }

        /// <summary>
        /// Remove (soft delete) a patient from a stay
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemovePatient(int id)
        {
            var command = new RemovePatientFromStayCommand(id);

            try
            {
                await _mediator.Send(command);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}