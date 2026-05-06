using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Stays.Queries.GetAllStays
{
    public class GetAllStaysHandler : IRequestHandler<GetAllStaysQuery, List<StayDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllStaysHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<StayDto>> Handle(GetAllStaysQuery request, CancellationToken cancellationToken)
        {
            var stays = await _context.Stays
                .Where(s => s.IsActive)
                .OrderByDescending(s => s.UpdatedAt)
                .Select(s => new StayDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Occupancy = s.StayParticipations.Count(sp => sp.IsActive)
                })
                .ToListAsync(cancellationToken);

            return stays;
        }
    }
}