namespace Api.Models.Dtos {
    public class ProfileDTO {
        public ContactsDTO? Contacts { get; set; }
        public List<EducationDTO>? Education{ get; set; }
        public List<ExperienceDTO>? Experience{ get; set; }
        public List<CertificationDTO>? Certification { get; set; }
        public List<SkillsDTO>? Skills{ get; set; }
        public List<ProjectDTO>? Project{ get; set; }
    }
}
