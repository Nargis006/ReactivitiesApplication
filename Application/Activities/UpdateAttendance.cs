using Application.Activities.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get;set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _context = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a=>a.Attendees)
                    .ThenInclude(u=>u.AppUser)
                    .SingleOrDefaultAsync(x=>x.Id == request.Id);

                if (activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.getUsername());
                if (user == null) return null;

                var hostUserName = activity.Attendees.FirstOrDefault(x=>x.IsHost)?
                    .AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(x=>x.AppUser.UserName == user.UserName);

                if (attendance != null && hostUserName == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if (attendance != null && hostUserName != user.UserName)
                    activity.Attendees.Remove(attendance);
                if(attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        Activity = activity,
                        AppUser = user,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendance);
                }
                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>
                    .Success(Unit.Value) : Result<Unit>
                    .Failure("Problem attainding attendance");
            }
        }
    }
}
