using MediatR;
using RehabiliTrack_API.Features.Stays.Queries.GetAllStays;

namespace RehabiliTrack_API.Features.Stays.GetCurrentStay
{
    public class GetCurrentStayQuery : IRequest<List<StayDto?>>
    {
    }
}
