using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class ContactsDTO {

        [Required(ErrorMessage ="First Name cannot be empty")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name cannot be empty")]
        public required string LastName { get; set; }

        public string? PhoneNumber { get; set; }
    }
}
