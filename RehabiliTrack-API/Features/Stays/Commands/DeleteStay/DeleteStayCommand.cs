using MediatR;

namespace RehabiliTrack_API.Features.Stays.Commands.DeleteStay
{
    public class DeleteStayCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteStayCommand(int id)
        {
            Id = id;
        }
    }
}