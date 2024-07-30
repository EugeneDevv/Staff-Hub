using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.Dtos.User {
    public class SkillProfileDto {
        public Guid SkillId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ProficiencyLevel { get; set; } = string.Empty;

        public Guid? UserId { get; set; }
    }
}