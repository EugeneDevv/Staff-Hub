using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class AddProjectDto {
        [Required(ErrorMessage = "ClientId is required")]
        public  int clientId { get; set; } = 0;

       [Required(ErrorMessage = "Project name is required")]
       public  string projectName { get; set; } = string.Empty;
    }
}
