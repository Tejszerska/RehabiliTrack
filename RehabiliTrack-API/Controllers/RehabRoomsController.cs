using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.RehabRooms.Commands.CreateRehabRoom;
using RehabiliTrack_API.Features.RehabRooms.Commands.DeleteRehabRoom;
using RehabiliTrack_API.Features.RehabRooms.Commands.UpdateRehabRoom;
using RehabiliTrack_API.Features.RehabRooms.Queries;
using RehabiliTrack_API.Features.RehabRooms.Queries.GetAllRehabRooms;
using RehabiliTrack_API.Features.RehabRooms.Queries.GetRehabRoomById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RehabRoomsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RehabRoomsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Reading all rehab rooms
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<RehabRoomDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            var query = new GetAllRehabRoomsQuery();
            var rooms = await _mediator.Send(query);
            return Ok(rooms);
        }

        /// <summary>
        /// Read a RehabRoom by id
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(RehabRoomDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var query = new GetRehabRoomByIdQuery(id);
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Create a new RehabRoom
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateRehabRoomCommand command)
        {
            var roomId = await _mediator.Send(command);

            return CreatedAtAction(
                nameof(GetById),
                new { id = roomId },
                new { id = roomId, message = "New RehabRoom created" }
            );
        }

        /// <summary>
        /// Update RehabRoom by id
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRehabRoomCommand command)
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

        /// <summary>
        /// Delete (soft) RehabRoom by id
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeleteRehabRoomCommand(id);

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