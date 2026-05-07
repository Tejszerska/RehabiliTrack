using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;
using static RehabiliTrack_API.Features.Patients.Queries.GetPatientById.PatientDetailsDto;

namespace RehabiliTrack_API.Features.Patients.Queries.GetPatientById
{
    public class GetPatientByIdHandler :IRequestHandler<GetPatientByIdQuery, PatientDetailsDto?>
    {
        private readonly ApplicationDbContext _context;
        public GetPatientByIdHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PatientDetailsDto?> Handle(
    GetPatientByIdQuery request, CancellationToken cancellationToken)
        {
            var patient = await _context.Patients
                .Where(p => p.Id == request.Id)
                .Select(p => new PatientDetailsDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Pesel = p.Pesel,
                    PhoneNumber = p.PhoneNumber,
                    Notes = p.Notes,
                    IsActive = p.IsActive,
                    Stays = p.StayParticipations
                        .Select(sp => new PatientStayDto
                        {
                            StayId = sp.StayId,
                            StayName = sp.Stay!.Name,
                            StartDate = sp.Stay.StartDate,
                            EndDate = sp.Stay.EndDate
                        }).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            return patient;
        }
    }
}

