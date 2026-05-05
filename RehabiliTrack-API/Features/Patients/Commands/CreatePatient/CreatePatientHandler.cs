using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Patients.Commands.CreatePatient
{
    public class CreatePatientHandler : IRequestHandler<CreatePatientCommand, int>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CreatePatientCommand> _logger;

        public CreatePatientHandler(
            ApplicationDbContext context, ILogger<CreatePatientCommand> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> Handle(
            CreatePatientCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Creating new patient : {FirstName} {LastName}", request.FirstName, request.LastName);

            var patient = new Patient
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Pesel = request.Pesel,
                PhoneNumber = request.PhoneNumber,
                Notes = request.Notes
            };

            _context.Patients.Add(patient);

            await _context.SaveChangesAsync(cancellationToken);


            _logger.LogInformation("New patient created : {FirstName} {LastName}", request.FirstName, request.LastName);

            return patient.Id;
        }

    }
}