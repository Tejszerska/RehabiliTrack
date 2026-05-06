using MediatR;

namespace RehabiliTrack_API.Features.Stays.Commands.UpdateStay
{
    public class UpdateStayCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}