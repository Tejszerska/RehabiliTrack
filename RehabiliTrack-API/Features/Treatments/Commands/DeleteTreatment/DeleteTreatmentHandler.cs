using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Treatments.Commands.DeleteTreatment
{
    public class DeleteTreatmentHandler : IRequestHandler<DeleteTreatmentCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        public DeleteTreatmentHandler(ApplicationDbContext context) { _context = context; }
        public async Task<Unit> Handle(DeleteTreatmentCommand request, CancellationToken cancellationToken)
        {
            var treatment = await _context.Treatments.FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);
            if (treatment == null) throw new KeyNotFoundException($"Treatment with ID {request.Id} not found.");
            _context.Treatments.Remove(treatment);
            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}