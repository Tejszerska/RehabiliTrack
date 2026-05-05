using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.Appointments.Commands.CreateAppointment;
using RehabiliTrack_API.Features.Appointments.Commands.UpdateAppointment;
using RehabiliTrack_API.Features.Appointments.Queries.GetAllAppointments;
using RehabiliTrack_API.Features.Appointments.Queries.GetAppointmentById;
using RehabiliTrack_API.Features.Patients.Commands.CreatePatient;
using RehabiliTrack_API.Features.Patients.Commands.DeletePatient;
using RehabiliTrack_API.Features.Patients.Commands.UpdatePatient;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AppointmentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Reading all appontments
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<AppointmentListItemDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAll()
        {
            var query = new GetAllAppointmentsQuery();
            var appointments = await _mediator.Send(query);
            return Ok(appointments);
        }


        /// <summary>
        /// Read an Appointment by id
        /// </summary>
        [HttpGet("{id:int}")] // Swagger fix
        [ProducesResponseType(typeof(AppointmentDetailsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var query = new GetAppointmentByIdQuery(id);
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Create a new Appointment
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateAppointmentCommand command)
        {
            var appointmentId = await _mediator.Send(command);

            // HTTP 201 Created + Location header
            return CreatedAtAction(
                nameof(GetById),
                new { id = appointmentId },
                new { id = appointmentId, message = "New Appointment created" }
            );
        }

        /// <summary>
        /// Update Appointment by id
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAppointmentCommand command)
        {

            if (id != command.Id)
            {
                return BadRequest(new { message = "ID in URL does not match ID in body" });
            }

            try
            {
                await _mediator.Send(command);
                return NoContent();  // HTTP 204 - succes but no body
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }

        }

        /// <summary>
        /// Delete (soft) Patient by id
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeletePatientCommand(id);

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
