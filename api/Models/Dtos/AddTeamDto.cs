namespace Api.Models.Dtos {
    public class AddTeamDto {
        public Guid? UserId { get; set; }
        public int ProjectId { get; set; }
        public int ProjectRoleId { get; set; }
    }
}
