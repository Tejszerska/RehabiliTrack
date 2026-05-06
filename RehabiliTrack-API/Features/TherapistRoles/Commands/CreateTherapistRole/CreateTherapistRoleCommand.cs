using MediatR;
namespace RehabiliTrack_API.Features.TherapistRoles.Commands.CreateTherapistRole
{
    public class CreateTherapistRoleCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
    }
}