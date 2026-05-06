using MediatR;
using RehabiliTrack_API.Features.Therapists.Queries;
namespace RehabiliTrack_API.Features.Therapists.Queries.GetTherapistById
{
    public class GetTherapistByIdQuery : IRequest<TherapistDto>
    {
        public int Id { get; set; }
        public GetTherapistByIdQuery(int id) { Id = id; }
    }
}