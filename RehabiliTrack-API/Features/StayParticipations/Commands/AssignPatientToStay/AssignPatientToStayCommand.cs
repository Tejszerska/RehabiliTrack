using MediatR;

namespace RehabiliTrack_API.Features.StayParticipations.Commands.AssignPatientToStay
{
    public class AssignPatientToStayCommand : IRequest<int>
    {
        public int PatientId { get; set; }
        public int StayId { get; set; }
    }
}