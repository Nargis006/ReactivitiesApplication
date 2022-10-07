using Application;
using Application.Activities;
using Application.Activities.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            return HandleRequest(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleRequest(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> AddActivity(Activity activity)
        {
            return HandleRequest(await Mediator.Send(new Create.Command { activity = activity }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id , Activity activity)
        {
            activity.Id = id;
            return HandleRequest(await Mediator.Send(new Edit.Command { activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleRequest(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}
