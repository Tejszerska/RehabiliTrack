using MediatR;

namespace RehabiliTrack_API.Features.Stays.Queries.GetStayById
{
    public class GetStayByIdQuery : IRequest<StayDetailsDto>
    {
        public int Id { get; set; }

        public GetStayByIdQuery(int id)
        {
            Id = id;
        }
    }
}