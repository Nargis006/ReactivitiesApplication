using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public readonly SignInManager<AppUser> _signInManager;
        public readonly UserManager<AppUser> _userManager;
        public readonly TokenService _tokenService;

        public AccountController(SignInManager<AppUser> singInManager,
            UserManager<AppUser> userManager,
            TokenService tokenService)
        {
            _signInManager = singInManager;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized();
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password,false);
            if (result.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image = null,
                    UserName = user.UserName,
                    Token = _tokenService.CreateToken(user)
                };
            }
            return Unauthorized();
        }
    }
}
