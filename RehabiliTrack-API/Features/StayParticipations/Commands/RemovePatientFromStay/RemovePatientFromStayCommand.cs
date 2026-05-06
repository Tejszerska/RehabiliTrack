using MediatR;

namespace RehabiliTrack_API.Features.StayParticipations.Commands.RemovePatientFromStay
{
    public class RemovePatientFromStayCommand : IRequest<Unit>
    {
        public int StayParticipationId { get; set; }

        public RemovePatientFromStayCommand(int stayParticipationId)
        {
            StayParticipationId = stayParticipationId;
        }
    }
}