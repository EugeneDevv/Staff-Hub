using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.Dtos.User {
    public class ProjectProfileDto {
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string StartMonth { get; set; } = string.Empty;
        public string EndMonth { get; set; } = string.Empty;
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public bool IsContinuing { get; set; }
    }
}
