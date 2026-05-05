using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Patients.Commands.DeletePatient
{
    public class DeletePatientHandler : IRequestHandler<DeletePatientCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DeletePatientCommand> _logger;
        public DeletePatientHandler(ApplicationDbContext context, ILogger<DeletePatientCommand> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<Unit> Handle(
            DeletePatientCommand request, CancellationToken cancellationToken)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id ==request.Id, cancellationToken);
            if (patient == null)
            {
                _logger.LogWarning("Patient with ID {Id} not found.", request.Id);
                throw new KeyNotFoundException($"Patient with ID {request.Id} not found.");
            }

            _logger.LogWarning("Patient with ID {Id} is being deleted.", request.Id);

            // overriden SaveChangesAsync() in ApplicationDbContext will change isActive to false instead of deleting the record
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogWarning("Patient with ID {Id} has been deleted.", request.Id);

            return Unit.Value;
        }
    }
}
