using MediatR;
namespace RehabiliTrack_API.Features.Treatments.Commands.DeleteTreatment
{
    public class DeleteTreatmentCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public DeleteTreatmentCommand(int id) { Id = id; }
    }
}