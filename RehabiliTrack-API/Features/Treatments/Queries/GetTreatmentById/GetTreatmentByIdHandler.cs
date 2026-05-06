using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Treatments.Queries.GetTreatmentById
{
    public class GetTreatmentByIdHandler : IRequestHandler<GetTreatmentByIdQuery, TreatmentDto?>
    {
        private readonly ApplicationDbContext _context;
        public GetTreatmentByIdHandler(ApplicationDbContext context) { _context = context; }
        public async Task<TreatmentDto?> Handle(GetTreatmentByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Treatments
                .Where(t => t.Id == request.Id && t.IsActive)
                .Select(t => new TreatmentDto { Id = t.Id, Name = t.Name, DurationMinutes = t.DurationMinutes })
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}