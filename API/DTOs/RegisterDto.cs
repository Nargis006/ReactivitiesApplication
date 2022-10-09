using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("^(?=(.*\\d){1})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\\d]).{5,}$",
            ErrorMessage = "Please provide complex password")]
        public string Password { get; set; }
        [Required]
        public string UserName { get; set; }
    }
}
