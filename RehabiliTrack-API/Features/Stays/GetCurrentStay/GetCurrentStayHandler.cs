using MediatR;
using RehabiliTrack_API.Features.Patients.Queries.GetAllPatients;
using RehabiliTrack_API.Features.StayParticipations.Queries.GetPatientsForStay;
using RehabiliTrack_API.Features.Stays.Queries.GetAllStays;
using RehabiliTrack_API.Models.Data;

using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.Stays.GetCurrentStay
{
    public class GetCurrentStayHandler : IRequestHandler<GetCurrentStayQuery, List<StayDto?>>
    {
        private readonly ApplicationDbContext _context;

        public GetCurrentStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<List<StayDto?>> Handle(GetCurrentStayQuery request, CancellationToken cancellationToken)
        {
            var curentStays = await _context.Stays
                .Where(s => s.StartDate <= DateTime.Now && s.EndDate >= DateTime.Now)
                .Where(s => s.IsActive == true)
                .Select(s => new StayDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Occupancy = s.StayParticipations.Count(),
                    MaxCapacity = s.MaxCapacity
                })
                .ToListAsync(cancellationToken);

            return curentStays;
        }
    }
}
