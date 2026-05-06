using MediatR;
namespace RehabiliTrack_API.Features.Treatments.Commands.CreateTreatment
{
    public class CreateTreatmentCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
    }
}