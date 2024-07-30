using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class ExperienceDTO {
        public Guid? Id { get; set; }

        [Required(ErrorMessage = "Job title cannot be empty")]
        public required string JobTitle { get; set; }

        [Required(ErrorMessage = "Company name cannot be empty")]
        public required string CompanyName { get; set; }

        [Required(ErrorMessage = "Start month cannot be empty")]
        public required string StartMonth { get; set; }

        [Required(ErrorMessage = "Start year cannot be empty")]
        public required int StartYear { get; set; }
        public string? EndMonth { get; set; }
        public int? EndYear { get; set; }
        public bool IsContinuing { get; set; }
    }
}
