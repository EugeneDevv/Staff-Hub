using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class AddSkillDTO {
        [Required(ErrorMessage = "Skill cannot be empty")]
        public required string Name { get; set; }
    }
}
