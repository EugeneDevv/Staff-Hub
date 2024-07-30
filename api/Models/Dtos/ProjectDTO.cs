using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class ProjectDTO {
        public int? Id { get; set; }

        public string? Name{ get; set; }
        public  int ClientId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage ="Role is required")]
        public required int RoleId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Project is required")]
        public required int ProjectId { get; set; }
        public Guid UserId { get; set; }
        public string? StartMonth { get; set; }
        public int? StartYear { get; set; }
        public string? EndMonth { get; set; }
        public int? EndYear { get; set; }
        public bool IsContinuing { get; set; } = false;
    }
}
