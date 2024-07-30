using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.Dtos.User {
    public class EducationProfileDto {
        public Guid Id { get; set; }
        public required string AreaOfStudy { get; set; }
        public required string Institution { get; set; }
        public required string LevelOfEducation { get; set; }

        public string? StartMonth { get; set; }
        public int? StartYear { get; set; }
        public string? EndMonth { get; set; }
        public int? EndYear { get; set; }

        public bool IsContinuing { get; set; } = false;

        public Guid? UserId { get; set; }
    }
}