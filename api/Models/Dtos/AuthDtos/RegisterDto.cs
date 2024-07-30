using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos.AuthDtos {
    public class RegisterDto {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

      
        public string FirstName { get; set; } = string.Empty;

        
        public string LastName { get; set; } = string.Empty;

       

        public string PhoneNumber { get; set; } =string.Empty;

        [Required(ErrorMessage = "User type is required")]
        public string Role { get; set; } = string.Empty;
        public int ProjectRoleId { get; set; }
        public int ProjectId { get; set; }
    }
}
