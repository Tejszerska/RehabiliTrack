using MediatR;
using RehabiliTrack_API.Features.TherapistRoles.Queries;
namespace RehabiliTrack_API.Features.TherapistRoles.Queries.GetAllTherapistRoles
{
    public class GetAllTherapistRolesQuery : IRequest<List<TherapistRoleDto>> { }
}