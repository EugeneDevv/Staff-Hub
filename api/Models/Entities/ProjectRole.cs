namespace Api.Models.Entities {
    public class ProjectRole {
        public int ProjectRoleId { get; set; } = 0;
        public required string ProjectRoleName { get; set;} = string.Empty;
        public bool deleted { get; set; } = false;
        public  ICollection<UserProjectRole> UserProjectRoles { get; set; }
    }
}
