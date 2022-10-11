using Application.Photos;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> Details(string username)
        {
            return HandleRequest(await Mediator.Send(new Details.Query{ Username = username}));
        }
    }
}
