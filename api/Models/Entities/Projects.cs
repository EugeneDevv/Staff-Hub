namespace Api.Models.Entities {
    public class Projects {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public int ClientsId { get; set; }
        public bool IsDeleted { get; set; }=false;
        public Clients Clients { get; set; }
        public ICollection<UserProjectRole> UserProjectRoles { get; set; }
    }
}
