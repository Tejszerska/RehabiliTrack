using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.Treatments.Commands.CreateTreatment;
using RehabiliTrack_API.Features.Treatments.Commands.DeleteTreatment;
using RehabiliTrack_API.Features.Treatments.Commands.UpdateTreatment;
using RehabiliTrack_API.Features.Treatments.Queries;
using RehabiliTrack_API.Features.Treatments.Queries.GetAllTreatments;
using RehabiliTrack_API.Features.Treatments.Queries.GetTreatmentById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TreatmentsController(IMediator mediator) { _mediator = mediator; }

        [HttpGet]
        [ProducesResponseType(typeof(List<TreatmentDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            return Ok(await _mediator.Send(new GetAllTreatmentsQuery()));
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(TreatmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetTreatmentByIdQuery(id));
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] CreateTreatmentCommand command)
        {
            var treatmentId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = treatmentId }, new { id = treatmentId, message = "New Treatment created" });
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTreatmentCommand command)
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
            try { await _mediator.Send(new DeleteTreatmentCommand(id)); return NoContent(); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }
    }
}