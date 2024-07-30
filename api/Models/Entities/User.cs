using System.Security.Cryptography.X509Certificates;

namespace Api.Models.Entities {
        public class User {
                public Guid UserId { get; set; }
                public string? FirstName { get; set; }
                public string? LastName { get; set; }
                public string Email { get; set; } = string.Empty;
                public string PhoneNumber { get; set; } = string.Empty;
                public string Password { get; set; } = string.Empty;
                public bool? SecurityQuestion { get; set; } = false;
                public string Role { get; set; } = "user";
                public string AccountStatus { get; set; } = "new";
                public string ProfileStatus { get; set; } = "pending";
                public DateTime DateCreated { get; set; } = DateTime.UtcNow;
                public DateTime DateUpdated { get; set; }
                public int Otp { get; set; } = 0;
                public bool Suspended { get; set; } = false;
                public bool Deleted { get; set; } = false;
                public string? SuspensionReason { get; set; }
                public List<Education> Educations { get; set; } = new List<Education>();
                public List<Experience> Experiences { get; set; } = new List<Experience>();
                public List<UserProjectRole> UserProjectRoles { get; set; } = new List<UserProjectRole>();
                public List<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
                public List<Certification> Certifications { get; set; } = new List<Certification>();
        }
}
