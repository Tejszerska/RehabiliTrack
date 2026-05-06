using MediatR;
using Microsoft.EntityFrameworkCore;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Stays.Commands.DeleteStay
{
    public class DeleteStayHandler : IRequestHandler<DeleteStayCommand, Unit>
    {
        private readonly ApplicationDbContext _context;

        public DeleteStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteStayCommand request, CancellationToken cancellationToken)
        {
            var stay = await _context.Stays
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (stay == null)
            {
                throw new KeyNotFoundException($"Stay with ID {request.Id} not found.");
            }

            _context.Stays.Remove(stay);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}