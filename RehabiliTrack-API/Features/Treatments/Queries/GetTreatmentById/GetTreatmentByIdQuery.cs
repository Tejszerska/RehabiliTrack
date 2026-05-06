using MediatR;
using RehabiliTrack_API.Features.Treatments.Queries;
namespace RehabiliTrack_API.Features.Treatments.Queries.GetTreatmentById
{
    public class GetTreatmentByIdQuery : IRequest<TreatmentDto>
    {
        public int Id { get; set; }
        public GetTreatmentByIdQuery(int id) { Id = id; }
    }
}