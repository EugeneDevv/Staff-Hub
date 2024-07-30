namespace Api.Models.Entities {
    public class Skills {
        internal readonly object Experiences;

        public Guid Id { get; set; }
        public required string Name  { get; set; }
        public bool? deleted { get; set; } = false;
        public List<UserSkill> UserSkills { get; set; } = new List<UserSkill>();

    }
}
