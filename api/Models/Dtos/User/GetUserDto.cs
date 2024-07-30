using Api.Models.Dtos.User;

namespace api.Models.Dtos.User {
    public class GetUserDto {
        public Guid UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool Suspended { get; set; } = false;
        public bool Deleted { get; set; } = false;
        public string Role { get; set; } = "user";
        public string AccountStatus { get; set; } = "new";
        public List<EducationProfileDto> Educations { get; set; } = new List<EducationProfileDto>();
        public List<SkillProfileDto> UserSkills { get; set; } = new List<SkillProfileDto>();
        public List<ExperienceProfileDto> Experiences { get; set; } = new List<ExperienceProfileDto>();
        public List<CertificationProfileDto> Certifications { get; set; } = new List<CertificationProfileDto>();
        public List<ProjectProfileDto> UserProjects{ get; set; } = new List<ProjectProfileDto>();
       

        public int CurrentNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public int NextPage { get; set; } = 2;
    }
}