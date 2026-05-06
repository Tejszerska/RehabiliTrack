using MediatR;
namespace RehabiliTrack_API.Features.Treatments.Commands.UpdateTreatment
{
    public class UpdateTreatmentCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
    }
}