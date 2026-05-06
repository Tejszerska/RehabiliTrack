using MediatR;
namespace RehabiliTrack_API.Features.TherapistRoles.Commands.UpdateTherapistRole
{
    public class UpdateTherapistRoleCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}