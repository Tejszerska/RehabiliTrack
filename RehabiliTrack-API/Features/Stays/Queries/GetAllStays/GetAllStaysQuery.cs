using MediatR;

namespace RehabiliTrack_API.Features.Stays.Queries.GetAllStays
{
    public class GetAllStaysQuery : IRequest<List<StayDto>>
    {
    }
}