using MediatR;
using RehabiliTrack_API.Features.Patients.Queries.GetAllPatients;
using RehabiliTrack_API.Models.Data;

using Microsoft.EntityFrameworkCore;


namespace RehabiliTrack_API.Features.StayParticipations.Queries.GetPatientsForStay
{
    public class GetPatientsForStayHandler : IRequestHandler<GetPatientsForStayQuery, List<PatientListItemDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetPatientsForStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<PatientListItemDto>> Handle
           (GetPatientsForStayQuery request, CancellationToken cancellationToken)
        {

            var patients = await _context.StayParticipations
                .Where(sp => sp.StayId == request.StayId)
                .Select(sp => new PatientListItemDto
                {
                    Id = sp.Patient.Id,
                    FirstName = sp.Patient.FirstName,
                    LastName = sp.Patient.LastName,
                    Pesel = sp.Patient.Pesel,
                    IsActive = sp.Patient.IsActive
                })
                .ToListAsync(cancellationToken);

            return patients;
        }
        }
}
