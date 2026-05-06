using MediatR;
namespace RehabiliTrack_API.Features.TherapistRoles.Commands.DeleteTherapistRole
{
    public class DeleteTherapistRoleCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public DeleteTherapistRoleCommand(int id) { Id = id; }
    }
}