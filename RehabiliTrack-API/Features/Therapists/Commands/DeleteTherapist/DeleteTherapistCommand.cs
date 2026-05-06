using MediatR;
namespace RehabiliTrack_API.Features.Therapists.Commands.DeleteTherapist
{
    public class DeleteTherapistCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public DeleteTherapistCommand(int id) { Id = id; }
    }
}