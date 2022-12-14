using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [AllowAnonymous]
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
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(x => x.Photos).
                FirstOrDefaultAsync(x => x.Email == loginDto.Email);
            var loginUser = new AppUser()
            {
                UserName = user.UserName,
                Email = user.Email,
                DisplayName = user.DisplayName
            };

            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                return CreateUserObject(loginUser);
            }
            return Unauthorized();
        }
        [HttpPost("register")]
        public  async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email)){
                ModelState.AddModelError("email", "Email already exists");
                return ValidationProblem();
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Username already exist try with another username!");
                return ValidationProblem();
            }
            var user = new AppUser()
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }
            return BadRequest("Registration Failed, Please try again!");

        }

        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(x=>x.Photos).
                FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }
        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto()
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x=>x.IsMain).Url ?? null,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName
            };
        }
    }
}
