using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
namespace RehabiliTrack_API.Features.Treatments.Queries.GetAllTreatments
{
    public class GetAllTreatmentsHandler : IRequestHandler<GetAllTreatmentsQuery, List<TreatmentDto>>
    {
        private readonly ApplicationDbContext _context;
        public GetAllTreatmentsHandler(ApplicationDbContext context) { _context = context; }
        public async Task<List<TreatmentDto>> Handle(GetAllTreatmentsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Treatments
                .Where(t => t.IsActive)
                .OrderByDescending(t => t.UpdatedAt)
                .Select(t => new TreatmentDto { Id = t.Id, Name = t.Name, DurationMinutes = t.DurationMinutes })
                .ToListAsync(cancellationToken);
        }
    }
}