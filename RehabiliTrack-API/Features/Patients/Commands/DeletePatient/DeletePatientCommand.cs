using MediatR;

namespace RehabiliTrack_API.Features.Patients.Commands.DeletePatient
{
    public class DeletePatientCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public DeletePatientCommand(int id)
        {
            Id = id;
        }
    }
}
