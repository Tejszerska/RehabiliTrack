using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Treatments.Commands.UpdateTreatment
{
    public class UpdateTreatmentHandler : IRequestHandler<UpdateTreatmentCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        public UpdateTreatmentHandler(ApplicationDbContext context) { _context = context; }
        public async Task<Unit> Handle(UpdateTreatmentCommand request, CancellationToken cancellationToken)
        {
            var treatment = await _context.Treatments.FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);
            if (treatment == null) throw new KeyNotFoundException($"Treatment with ID {request.Id} not found.");
            treatment.Name = request.Name;
            treatment.DurationMinutes = request.DurationMinutes;
            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}