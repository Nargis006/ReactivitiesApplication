using Application.Activities;
using Application.Activities.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            public DataContext _context;
            public IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _context = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                //var result = await _context.Activities
                //    .Include(a=>a.Attendees)
                //    .ThenInclude(u=>u.AppUser)
                //    .ToListAsync(cancellationToken);

                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                //var activitiesToReturn = _mapper.Map<List<ActivityDto>>(result);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}
