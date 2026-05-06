using MediatR;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;

namespace RehabiliTrack_API.Features.Stays.Commands.CreateStay
{
    public class CreateStayHandler : IRequestHandler<CreateStayCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public CreateStayHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateStayCommand request, CancellationToken cancellationToken)
        {
            var stay = new Stay
            {
                Name = request.Name,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.Stays.Add(stay);
            await _context.SaveChangesAsync(cancellationToken);

            return stay.Id;
        }
    }
}