using MediatR;
using RehabiliTrack_API.Features.Treatments.Queries;
namespace RehabiliTrack_API.Features.Treatments.Queries.GetAllTreatments
{
    public class GetAllTreatmentsQuery : IRequest<List<TreatmentDto>> { }
}