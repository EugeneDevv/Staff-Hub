namespace Api.Models.Entities {
    public class UserSkill {
        public int Id { get; set; }
        public Guid SkillId { get; set; }
        public Skills Skill { get; set;}
        public string ProficiencyLevel { get; set; }
    
        public Guid? UserId { get; set; }
        //Navigation property
        public User? User { get; set; }
    }
}
