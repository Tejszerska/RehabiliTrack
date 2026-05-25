using MediatR;
using RehabiliTrack_API.Features.Patients.Queries.GetAllPatients;

namespace RehabiliTrack_API.Features.StayParticipations.Queries.GetPatientsForStay
{
    public class GetPatientsForStayQuery : IRequest<List<PatientListItemDto>>
    {    
        public int StayId { get; set; }

        public GetPatientsForStayQuery (int stayId)
        {
            StayId = stayId;
        }
    }    

}
