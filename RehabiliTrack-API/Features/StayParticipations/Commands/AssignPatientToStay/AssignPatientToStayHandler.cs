using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.StayParticipations.Commands.AssignPatientToStay
{
    public class AssignPatientToStayHandler : IRequestHandler<AssignPatientToStayCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public AssignPatientToStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(AssignPatientToStayCommand request, CancellationToken cancellationToken)
        {
            var participation = new StayParticipation
            {
                PatientId = request.PatientId,
                StayId = request.StayId
            };

            _context.StayParticipations.Add(participation);
            await _context.SaveChangesAsync(cancellationToken);

            return participation.Id;
        }
    }
}