using Application.Activities.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class Details
    {
        public class Query : IRequest<Result<Profiles.Profile>> {
            public string Username { get; set; }
        };
       

        public class Handler : IRequestHandler<Query, Result<Profiles.Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext dataContext,
                IMapper mapper)
            {
                _context = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<Profiles.Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x=>x.UserName == request.Username);

                if (user == null) return null;

                return Result<Profiles.Profile>.Success(user);
            }
        }
    }
}
