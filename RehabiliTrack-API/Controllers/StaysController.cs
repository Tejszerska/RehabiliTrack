using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.Stays.Commands.CreateStay;
using RehabiliTrack_API.Features.Stays.Commands.DeleteStay;
using RehabiliTrack_API.Features.Stays.Commands.UpdateStay;
using RehabiliTrack_API.Features.Stays.GetCurrentStay;
using RehabiliTrack_API.Features.Stays.Queries.GetAllStays;
using RehabiliTrack_API.Features.Stays.Queries.GetStayById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaysController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StaysController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<StayDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            var query = new GetAllStaysQuery();
            var stays = await _mediator.Send(query);
            return Ok(stays);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(StayDetailsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var query = new GetStayByIdQuery(id);
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateStayCommand command)
        {
            var stayId = await _mediator.Send(command);

            return CreatedAtAction(
                nameof(GetById),
                new { id = stayId },
                new { id = stayId, message = "New Stay created" }
            );
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStayCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest(new { message = "ID in URL does not match ID in body" });
            }

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

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeleteStayCommand(id);

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


        [HttpGet("current")]
        [ProducesResponseType(typeof(List<StayDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetCurrent()
        {
            var query = new GetCurrentStayQuery();
            var stays = await _mediator.Send(query);
            return Ok(stays);
        }
    }
}