using MediatR;
using System.ComponentModel.DataAnnotations;

namespace RehabiliTrack_API.Features.Stays.Commands.CreateStay
{
    public class CreateStayCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int MaxCapacity { get; set; }
    }
}