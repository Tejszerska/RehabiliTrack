using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RehabiliTrack_API.Features.Patients.Commands.CreatePatient;
using RehabiliTrack_API.Features.Patients.Commands.DeletePatient;
using RehabiliTrack_API.Features.Patients.Commands.UpdatePatient;
using RehabiliTrack_API.Features.Patients.Queries.GetAllPatients;
using RehabiliTrack_API.Features.Patients.Queries.GetPatientById;

namespace RehabiliTrack_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PatientsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Reading all patients
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<PatientListItemDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetAllPatients()
        {
            var query = new GetAllPatientsQuery();
            var patients = await _mediator.Send(query);
            return Ok(patients);
        }


        /// <summary>
        /// Read a Patient by id
        /// </summary>
        [HttpGet("{id:int}")] // Swagger fix
        [ProducesResponseType(typeof(PatientDetailsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var query = new GetPatientByIdQuery(id);
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Create a new Patient
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreatePatientCommand command)
        {
            var patientId = await _mediator.Send(command);

            // HTTP 201 Created + Location header
            return CreatedAtAction(
                nameof(GetById),
                new { id = patientId },
                new { id = patientId, message = "New Patient created" }
            );
        }

        /// <summary>
        /// Update Patient by id
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientCommand command)
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
