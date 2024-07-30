using System.Text.Json.Serialization;

namespace Api.Models.Entities {
    public class Education {
        public Guid Id { get; set; }
        public required string  AreaOfStudy { get; set; }
        public required string Institution { get; set; }
        public required string LevelOfEducation { get; set; }

        public string? StartMonth { get; set; }
        public int? StartYear { get; set; }
        public string? EndMonth { get; set; }
        public int? EndYear { get; set; }

        public bool IsContinuing { get; set; } = false;

        public Guid? UserId { get; set; }
        //Navigation property
        public required User? User { get; set; }

    }
}
