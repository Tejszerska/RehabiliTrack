using MediatR;

namespace RehabiliTrack_API.Features.Appointments.Commands.DeleteAppointment
{
    public class DeleteAppointmentCommand : IRequest<Unit>
    {
        public int Id; 
        public DeleteAppointmentCommand(int id)
        {
            Id = id;
        }
    }
}
