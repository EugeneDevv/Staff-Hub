using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class EducationDTO {
        public Guid? Id { get; set; }

        [Required(ErrorMessage ="Area of study cannot be empty")]
       public required string AreaOfStudy { get; set; }

       [Required(ErrorMessage ="Instituition cannot be empty")]
        public required string Institution { get; set; }

       [Required(ErrorMessage ="Level of education cannot be empty")]
        public required string LevelOfEducation { get; set; }

        public string? StartMonth { get; set; }
        public int? StartYear { get; set; }
        public string? EndMonth { get; set; }
        public int? EndYear { get; set; }
        public bool IsContinuing { get; set; } = false;
    }
}
