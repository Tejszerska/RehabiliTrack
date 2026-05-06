using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Treatments.Commands.CreateTreatment
{
    public class CreateTreatmentHandler : IRequestHandler<CreateTreatmentCommand, int>
    {
        private readonly ApplicationDbContext _context;
        public CreateTreatmentHandler(ApplicationDbContext context) { _context = context; }
        public async Task<int> Handle(CreateTreatmentCommand request, CancellationToken cancellationToken)
        {
            var treatment = new Treatment { Name = request.Name, DurationMinutes = request.DurationMinutes };
            _context.Treatments.Add(treatment);
            await _context.SaveChangesAsync(cancellationToken);
            return treatment.Id;
        }
    }
}