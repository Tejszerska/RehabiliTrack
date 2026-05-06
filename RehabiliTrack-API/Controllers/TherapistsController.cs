using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.Therapists.Commands.CreateTherapist;
using RehabiliTrack_API.Features.Therapists.Commands.DeleteTherapist;
using RehabiliTrack_API.Features.Therapists.Commands.UpdateTherapist;
using RehabiliTrack_API.Features.Therapists.Queries;
using RehabiliTrack_API.Features.Therapists.Queries.GetAllTherapists;
using RehabiliTrack_API.Features.Therapists.Queries.GetTherapistById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TherapistsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TherapistsController(IMediator mediator) { _mediator = mediator; }

        [HttpGet]
        [ProducesResponseType(typeof(List<TherapistDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            return Ok(await _mediator.Send(new GetAllTherapistsQuery()));
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(TherapistDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetTherapistByIdQuery(id));
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] CreateTherapistCommand command)
        {
            var therapistId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = therapistId }, new { id = therapistId, message = "New Therapist created" });
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTherapistCommand command)
        {
            if (id != command.Id) return BadRequest(new { message = "ID mismatch" });
            try { await _mediator.Send(command); return NoContent(); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try { await _mediator.Send(new DeleteTherapistCommand(id)); return NoContent(); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }
    }
}