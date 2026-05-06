using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.RoomTypes.Commands.CreateRoomType;
using RehabiliTrack_API.Features.RoomTypes.Commands.DeleteRoomType;
using RehabiliTrack_API.Features.RoomTypes.Commands.UpdateRoomType;
using RehabiliTrack_API.Features.RoomTypes.Queries;
using RehabiliTrack_API.Features.RoomTypes.Queries.GetAllRoomTypes;
using RehabiliTrack_API.Features.RoomTypes.Queries.GetRoomTypeById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RoomTypesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Reading all room types
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<RoomTypeDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            var query = new GetAllRoomTypesQuery();
            var roomTypes = await _mediator.Send(query);
            return Ok(roomTypes);
        }

        /// <summary>
        /// Read a RoomType by id
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(RoomTypeDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var query = new GetRoomTypeByIdQuery(id);
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Create a new RoomType
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateRoomTypeCommand command)
        {
            var roomTypeId = await _mediator.Send(command);

            return CreatedAtAction(
                nameof(GetById),
                new { id = roomTypeId },
                new { id = roomTypeId, message = "New RoomType created" }
            );
        }

        /// <summary>
        /// Update RoomType by id
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomTypeCommand command)
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
        /// Delete (soft) RoomType by id
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeleteRoomTypeCommand(id);

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