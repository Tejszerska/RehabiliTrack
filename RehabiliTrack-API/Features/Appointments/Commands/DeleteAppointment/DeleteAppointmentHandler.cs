using MediatR;
using RehabiliTrack_API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace RehabiliTrack_API.Features.Appointments.Commands.DeleteAppointment
{
    public class DeleteAppointmentHandler : IRequestHandler<DeleteAppointmentCommand, Unit>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DeleteAppointmentHandler> _logger;

        public DeleteAppointmentHandler(ApplicationDbContext context, ILogger<DeleteAppointmentHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Unit> Handle(
           DeleteAppointmentCommand request,
           CancellationToken cancellationToken)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

            if (appointment == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found.", request.Id);
                throw new KeyNotFoundException($"Appointment with ID {request.Id} not found.");
            }

            _logger.LogWarning("Appointment with ID {Id} is being deleted.", request.Id);

            // overriden SaveChangesAsync() in ApplicationDbContext will change isActive to false instead of deleting the record
            _context.Appointments.Remove(appointment);

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogWarning("Appointment with ID {Id} has been deleted.", request.Id);

            return Unit.Value;
        }
    }
}