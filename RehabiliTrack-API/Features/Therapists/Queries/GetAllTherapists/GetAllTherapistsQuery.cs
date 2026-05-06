using MediatR;
using RehabiliTrack_API.Features.Therapists.Queries;
namespace RehabiliTrack_API.Features.Therapists.Queries.GetAllTherapists
{
    public class GetAllTherapistsQuery : IRequest<List<TherapistDto>> { }
}