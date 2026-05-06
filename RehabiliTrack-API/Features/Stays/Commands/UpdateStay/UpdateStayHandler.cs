using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Stays.Commands.UpdateStay
{
    public class UpdateStayHandler : IRequestHandler<UpdateStayCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public UpdateStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateStayCommand request, CancellationToken cancellationToken)
        {
            var stay = await _context.Stays
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (stay == null)
            {
                throw new KeyNotFoundException($"Stay with ID {request.Id} not found.");
            }

            stay.Name = request.Name;
            stay.StartDate = request.StartDate;
            stay.EndDate = request.EndDate;
            stay.MaxCapacity = request.MaxCapacity;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}