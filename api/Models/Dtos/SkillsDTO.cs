namespace Api.Models.Dtos {
    public class SkillsDTO {
        public int? Id { get; set; }

        public required  Guid UserId{ get; set; }
        public Guid? SkillId{ get; set; }
        public string? Name { get; set; }
        public required  string ProficiencyLevel{ get; set; }
    }
}
