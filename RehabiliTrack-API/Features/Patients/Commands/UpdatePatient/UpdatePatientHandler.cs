using MediatR;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Patients.Commands.UpdatePatient
{
    public class UpdatePatientHandler : IRequestHandler<UpdatePatientCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UpdatePatientCommand> _logger;

        public UpdatePatientHandler(ApplicationDbContext context, ILogger<UpdatePatientCommand> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Unit> Handle(
            UpdatePatientCommand request, CancellationToken cancellationToken)
        {
            var patient = await _context.Patients.FindAsync(request.Id, cancellationToken);

            if (patient == null)
            {
                _logger.LogWarning("Patient with ID {Id} not found.", request.Id);
                throw new KeyNotFoundException($"Patient with ID {request.Id} not found.");
            }

            _logger.LogWarning("Patient with ID {Id} is being updated.", request.Id);

            patient.FirstName = request.FirstName;
            patient.LastName = request.LastName;
            patient.Pesel = request.Pesel;
            patient.PhoneNumber = request.PhoneNumber;
            patient.Notes = request.Notes;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogWarning("Patient with ID {Id} has been updated.", request.Id);


            return Unit.Value;
        }
    }
}