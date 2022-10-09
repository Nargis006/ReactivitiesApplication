using Application.Activities.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.activity).SetValidator(new ActivityValidator());
            }
        }

        public class handler : IRequestHandler<Command, Result<Unit>>
        {
            public DataContext _context;
            public IUserAccessor _userAccessor;

            public handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.getUsername());

                var attendee = new ActivityAttendee()
                {
                    Activity = request.activity,
                    AppUser = user,
                    IsHost = true
                };

                request.activity.Attendees.Add(attendee);

                _context.Activities.Add(request.activity);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create activity!");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
