using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Stays.Queries.GetStayById
{
    public class GetStayByIdHandler : IRequestHandler<GetStayByIdQuery, StayDetailsDto?>
    {
        private readonly ApplicationDbContext _context;

        public GetStayByIdHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<StayDetailsDto?> Handle(GetStayByIdQuery request, CancellationToken cancellationToken)
        {
            var stay = await _context.Stays
                .Where(s => s.Id == request.Id && s.IsActive)
                .Select(s => new StayDetailsDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Occupancy = s.StayParticipations.Count(sp => sp.IsActive),
                    MaxCapacity = s.MaxCapacity,

                    Patients = s.StayParticipations
                        .Where(sp => sp.IsActive)
                        .Select(sp => new StayPatientDto
                        {
                            StayParticipationId = sp.Id,
                            PatientId = sp.PatientId,
                            PatientFullName = sp.Patient!.FirstName + " " + sp.Patient.LastName
                        }).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            return stay;
        }
    }
}