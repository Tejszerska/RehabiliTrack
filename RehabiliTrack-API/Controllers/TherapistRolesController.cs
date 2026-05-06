using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.TherapistRoles.Commands.CreateTherapistRole;
using RehabiliTrack_API.Features.TherapistRoles.Commands.DeleteTherapistRole;
using RehabiliTrack_API.Features.TherapistRoles.Commands.UpdateTherapistRole;
using RehabiliTrack_API.Features.TherapistRoles.Queries;
using RehabiliTrack_API.Features.TherapistRoles.Queries.GetAllTherapistRoles;
using RehabiliTrack_API.Features.TherapistRoles.Queries.GetTherapistRoleById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TherapistRolesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TherapistRolesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<TherapistRoleDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            var query = new GetAllTherapistRolesQuery();
            var roles = await _mediator.Send(query);
            return Ok(roles);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(TherapistRoleDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var query = new GetTherapistRoleByIdQuery(id);
            var result = await _mediator.Send(query);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateTherapistRoleCommand command)
        {
            var roleId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = roleId }, new { id = roleId, message = "New TherapistRole created" });
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTherapistRoleCommand command)
        {
            if (id != command.Id) return BadRequest(new { message = "ID in URL does not match ID in body" });
            try
            {
                await _mediator.Send(command);
                return NoContent();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _mediator.Send(new DeleteTherapistRoleCommand(id));
                return NoContent();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }
    }
}