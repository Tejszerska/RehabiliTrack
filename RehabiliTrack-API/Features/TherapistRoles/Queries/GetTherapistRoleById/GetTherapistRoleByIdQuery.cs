using MediatR;
using RehabiliTrack_API.Features.TherapistRoles.Queries;
namespace RehabiliTrack_API.Features.TherapistRoles.Queries.GetTherapistRoleById
{
    public class GetTherapistRoleByIdQuery : IRequest<TherapistRoleDto>
    {
        public int Id { get; set; }
        public GetTherapistRoleByIdQuery(int id) { Id = id; }
    }
}